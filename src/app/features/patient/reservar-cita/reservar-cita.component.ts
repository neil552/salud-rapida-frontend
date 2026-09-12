import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { CitaService } from '../../../core/services/cita.service';
import { MedicoService } from '../../../core/services/medico.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MedicoModel } from '../../../core/models/medico.model';
import { DoctorFormatPipe } from '../../../shared/pipes/doctor-format.pipe';
import { HighlightSlotDirective } from '../../../shared/directives/highlight-slot.directive';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reservar-cita',
  imports: [HighlightSlotDirective, ReactiveFormsModule, RouterLink, DoctorFormatPipe],
  templateUrl: './reservar-cita.component.html',
  styleUrl: './reservar-cita.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservarCitaComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly medicoService = inject(MedicoService);
  private readonly citaService = inject(CitaService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly medicos = signal<MedicoModel[]>([]);
  readonly especialidadSeleccionada = signal('');
  readonly medicoSeleccionado = signal<MedicoModel | undefined>(undefined);
  readonly fechaMinima = new Date().toISOString().slice(0, 10);
  readonly fechasDisponibles = Array.from({ length: 14 }, (_, index) => {
    const fecha = new Date();
    fecha.setHours(12, 0, 0, 0);
    fecha.setDate(fecha.getDate() + index);
    return {
      value: fecha.toISOString().slice(0, 10),
      dia: new Intl.DateTimeFormat('es-PE', { weekday: 'short' }).format(fecha).replace('.', ''),
      numero: fecha.getDate()
    };
  });
  readonly especialidades = computed(() =>
    [...new Set(this.medicos().map((medico) => medico.especialidad))]
  );

  readonly reservaForm = this.formBuilder.nonNullable.group({
    especialidad: ['', Validators.required],
    medicoId: [0, Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    pacienteDni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
    pacienteNombre: ['', [Validators.required, Validators.minLength(3)]],
    pacienteEmail: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    const usuario = this.authService.getCurrentUser();
    if (usuario?.rol === 'PACIENTE') {
      this.reservaForm.patchValue({
        pacienteNombre: usuario.nombre,
        pacienteEmail: usuario.email
      });
    }

    this.medicoService.getMedicos().pipe(take(1)).subscribe((medicos) => this.medicos.set(medicos));

    this.reservaForm.controls.especialidad.valueChanges.subscribe((especialidad) => {
      this.especialidadSeleccionada.set(especialidad);
      this.reservaForm.controls.medicoId.setValue(0);
      this.medicoSeleccionado.set(undefined);
    });

    this.reservaForm.controls.medicoId.valueChanges.subscribe((medicoId) => {
      this.medicoSeleccionado.set(this.medicos().find((medico) => medico.id === medicoId));
    });
  }

  readonly medicosDisponibles = computed(() =>
    this.medicos().filter((medico) => medico.especialidad === this.especialidadSeleccionada())
  );

  campoInvalido(campo: keyof typeof this.reservaForm.controls): boolean {
    const control = this.reservaForm.controls[campo];
    return control.invalid && control.touched;
  }

  seleccionarFecha(fecha: string): void {
    this.reservaForm.controls.fecha.setValue(fecha);
    this.reservaForm.controls.fecha.markAsTouched();
  }

  seleccionarHora(hora: string): void {
    if (this.horarioEstaOcupado(hora)) {
      return;
    }
    this.reservaForm.controls.hora.setValue(hora);
    this.reservaForm.controls.hora.markAsTouched();
  }

  horarioEstaOcupado(hora: string): boolean {
    const medicoId = this.reservaForm.controls.medicoId.value;
    const fecha = this.reservaForm.controls.fecha.value;
    return medicoId > 0 && Boolean(fecha) && this.citaService.horarioOcupado(medicoId, fecha, hora);
  }

  enviarReserva(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const valores = this.reservaForm.getRawValue();
    const usuario = this.authService.getCurrentUser();
    const medico = this.medicoSeleccionado();
    if (!medico) {
      return;
    }

    this.citaService.crearCita({
      ...valores,
      pacienteNombre: usuario?.rol === 'PACIENTE' ? usuario.nombre : valores.pacienteNombre,
      pacienteEmail: usuario?.rol === 'PACIENTE' ? usuario.email : valores.pacienteEmail,
      medicoId: medico.id,
      medicoNombre: medico.nombreCompleto,
      especialidad: medico.especialidad,
      estado: 'PENDIENTE'
    }).pipe(take(1)).subscribe((cita) => {
      this.notificationService.notify('Tu cita fue registrada correctamente.');
      void this.router.navigate(['/paciente/confirmacion'], { queryParams: { citaId: cita.id } });
    });
  }
}
