import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicoModel } from '../../../core/models/medico.model';
import { MedicoService } from '../../../core/services/medico.service';

@Component({
  selector: 'app-buscar-medico',
  imports: [RouterLink],
  templateUrl: './buscar-medico.component.html',
  styleUrl: './buscar-medico.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BuscarMedicoComponent {
  private readonly medicoService = inject(MedicoService);
  readonly medicos = signal<MedicoModel[]>([]);

  constructor() {
    this.medicoService.getMedicos().subscribe((medicos) => this.medicos.set(medicos));
  }
}
