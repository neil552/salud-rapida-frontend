import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CitaModel } from '../../../core/models/cita.model';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly citaService = inject(CitaService);
  readonly citas = signal<CitaModel[]>([]);

  constructor() {
    this.citaService.getCitas().subscribe((citas) => this.citas.set(citas));
  }

  contarPorEstado(estado: CitaModel['estado']): number {
    return this.citas().filter((cita) => cita.estado === estado).length;
  }
}
