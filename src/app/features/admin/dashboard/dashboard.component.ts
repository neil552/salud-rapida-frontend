import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  readonly filtroEstado = signal<'TODAS' | CitaModel['estado']>('TODAS');
  readonly citasFiltradas = computed(() => {
    const estado = this.filtroEstado();
    return this.citas().filter((cita) => estado === 'TODAS' || cita.estado === estado);
  });
  readonly porcentajeConfirmadas = computed(() => this.citas().length
    ? Math.round((this.contarPorEstado('CONFIRMADA') / this.citas().length) * 100)
    : 0);
  readonly porcentajePendientes = computed(() => this.citas().length
    ? Math.round((this.contarPorEstado('PENDIENTE') / this.citas().length) * 100)
    : 0);

  constructor() {
    this.citaService.getCitas().subscribe((citas) => this.citas.set(citas));
  }

  contarPorEstado(estado: CitaModel['estado']): number {
    return this.citas().filter((cita) => cita.estado === estado).length;
  }
}
