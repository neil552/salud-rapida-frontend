import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CitaModel, EstadoCita } from '../../../core/models/cita.model';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-agenda-medica',
  templateUrl: './agenda-medica.component.html',
  styleUrl: './agenda-medica.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaMedicaComponent {
  private readonly citaService = inject(CitaService);
  private readonly authService = inject(AuthService);
  readonly citas = signal<CitaModel[]>([]);
  readonly fechaFiltro = signal('');
  readonly citasVisibles = computed(() => this.citasFiltradas());
  readonly pendientes = computed(() => this.citasVisibles().filter((cita) => cita.estado === 'PENDIENTE').length);
  readonly confirmadas = computed(() => this.citasVisibles().filter((cita) => cita.estado === 'CONFIRMADA').length);
  readonly atendidas = computed(() => this.citasVisibles().filter((cita) => cita.estado === 'ATENDIDA').length);

  constructor() {
    this.citaService.getCitas().subscribe((citas) => this.citas.set(citas));
  }

  citasFiltradas(): CitaModel[] {
    // El médico solo consulta sus citas; opcionalmente puede limitar el día visible.
    const fecha = this.fechaFiltro();
    const medicoId = this.authService.getCurrentUser()?.medicoId;
    return this.citas().filter((cita) =>
      cita.medicoId === medicoId && (!fecha || cita.fecha === fecha)
    );
  }

  actualizarEstado(cita: CitaModel, estado: EstadoCita): void {
    if (cita.id) {
      this.citaService.cambiarEstado(cita.id, estado).subscribe();
    }
  }
}
