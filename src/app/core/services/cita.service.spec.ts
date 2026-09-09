import { CitaService } from './cita.service';
import { CitaModel } from '../models/cita.model';

describe('CitaService', () => {
  beforeEach(() => localStorage.clear());

  it('creates and exposes a new appointment', () => {
    const service = new CitaService();
    const cita: CitaModel = {
      pacienteNombre: 'Ana Pérez',
      pacienteDni: '12345678',
      pacienteEmail: 'ana@example.com',
      medicoId: 1,
      medicoNombre: 'Valeria Mendoza',
      especialidad: 'Medicina general',
      fecha: '2026-09-15',
      hora: '09:00 AM',
      estado: 'PENDIENTE'
    };

    service.crearCita(cita).subscribe((creada) => expect(creada.id).toBeTruthy());
    service.getCitas().subscribe((citas) => expect(citas).toHaveLength(2));
  });

  it('changes an appointment status and reports unknown ids', () => {
    const service = new CitaService();
    service.crearCita({
      pacienteNombre: 'Luis Díaz', pacienteDni: '87654321', pacienteEmail: 'luis@example.com',
      medicoId: 1, medicoNombre: 'Valeria Mendoza', especialidad: 'Medicina general',
      fecha: '2026-09-15', hora: '11:30 AM', estado: 'PENDIENTE'
    }).subscribe((cita) => {
      service.cambiarEstado(cita.id!, 'CONFIRMADA').subscribe((actualizada) => {
        expect(actualizada).toBe(true);
        service.getCitas().subscribe((citas) => {
          expect(citas.find((item) => item.id === cita.id)?.estado).toBe('CONFIRMADA');
        });
      });
      service.cancelarCita('no-existe').subscribe((cancelada) => expect(cancelada).toBe(false));
    });
  });
});
