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
  readonly citasDelPaciente = computed(() => {
    const email = this.authService.getCurrentUser()?.email;
    return this.citas().filter((cita) => cita.pacienteEmail === email);
  });

  constructor() {
    this.citaService.getCitas().subscribe((citas) => this.citas.set(citas));
  }

  cancelar(cita: CitaModel): void {
    if (!cita.id || cita.estado === 'CANCELADA' || cita.estado === 'ATENDIDA') {
      return;
    }

    this.citaService.cancelarCita(cita.id).subscribe((cancelada) => {
      if (cancelada) {
        this.notificationService.notify('La cita fue cancelada correctamente.');
      }
    });
  }
}
