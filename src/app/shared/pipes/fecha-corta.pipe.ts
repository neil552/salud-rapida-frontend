import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaCorta' })
export class FechaCortaPipe implements PipeTransform {
  transform(fecha: string | null | undefined): string {
    if (!fecha) {
      return '';
    }

    // Mediodía local evita que la conversión UTC desplace la fecha mostrada.
    const fechaLocal = new Date(`${fecha}T12:00:00`);
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(fechaLocal);
  }
}
