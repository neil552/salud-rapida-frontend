import { Pipe, PipeTransform } from '@angular/core';
import { MedicoModel } from '../../core/models/medico.model';

@Pipe({ name: 'doctorFormat' })
export class DoctorFormatPipe implements PipeTransform {
  transform(medico: MedicoModel | null | undefined): string {
    if (!medico) {
      return '';
    }

    return `Dr. ${medico.nombreCompleto} — ${medico.especialidad} (CMP ${medico.cmp})`;
  }
}
