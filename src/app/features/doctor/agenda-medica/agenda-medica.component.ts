import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

  constructor() {
    this.citaService.getCitas().subscribe((citas) => this.citas.set(citas));
  }

  citasFiltradas(): CitaModel[] {
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
