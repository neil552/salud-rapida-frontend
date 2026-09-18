import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CitaModel } from '../../../core/models/cita.model';
import { CitaService } from '../../../core/services/cita.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FechaCortaPipe } from '../../../shared/pipes/fecha-corta.pipe';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-citas',
  imports: [RouterLink, FechaCortaPipe],
  templateUrl: './mis-citas.component.html',
  styleUrl: './mis-citas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MisCitasComponent {
  private readonly citaService = inject(CitaService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  readonly citas = signal<CitaModel[]>([]);
  readonly filtroEstado = signal<'TODAS' | CitaModel['estado']>('TODAS');
  readonly citasDelPaciente = computed(() => {
    // El paciente solo ve sus citas y puede aplicar un filtro por estado.
    const email = this.authService.getCurrentUser()?.email;
    const estado = this.filtroEstado();
    return this.citas().filter((cita) =>
      cita.pacienteEmail === email && (estado === 'TODAS' || cita.estado === estado)
    );
  });

  constructor() {
    this.citaService.getCitas().subscribe((citas) => this.citas.set(citas));
  }

  cancelar(cita: CitaModel): void {
    // Las citas finalizadas o ya canceladas no admiten nuevas transiciones.
    if (!cita.id || cita.estado === 'CANCELADA' || cita.estado === 'ATENDIDA') {
      return;
    }

    if (!window.confirm(`¿Deseas cancelar la cita con ${cita.medicoNombre}?`)) {
      return;
    }

    this.citaService.cancelarCita(cita.id).subscribe((cancelada) => {
      if (cancelada) {
        this.notificationService.notify('La cita fue cancelada correctamente.');
      }
    });
  }
}
