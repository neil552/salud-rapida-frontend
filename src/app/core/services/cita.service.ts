import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { CitaModel, EstadoCita } from '../models/cita.model';

const CITAS_INICIALES: CitaModel[] = [
  {
    id: 'cita-demo-1',
    pacienteNombre: 'Paciente demo',
    pacienteDni: '45678912',
    pacienteEmail: 'paciente@saludrapida.pe',
    medicoId: 2,
    medicoNombre: 'Jorge Salazar',
    especialidad: 'Cardiología',
    fecha: '2026-09-15',
    hora: '08:30 AM',
    estado: 'PENDIENTE'
  }
];

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly storageKey = 'salud-rapida.citas';
  private readonly citasSubject = new BehaviorSubject<CitaModel[]>(this.cargarCitas());

  private cargarCitas(): CitaModel[] {
    // Las citas iniciales permiten utilizar la aplicación sin un servidor real.
    const citasGuardadas = localStorage.getItem(this.storageKey);
    if (!citasGuardadas) {
      return CITAS_INICIALES;
    }

    try {
      const citas = JSON.parse(citasGuardadas) as unknown;
      return Array.isArray(citas) ? citas as CitaModel[] : CITAS_INICIALES;
    } catch {
      localStorage.removeItem(this.storageKey);
      return CITAS_INICIALES;
    }
  }

  private guardarCitas(citas: CitaModel[]): void {
    // BehaviorSubject mantiene la interfaz reactiva y localStorage conserva los datos.
    localStorage.setItem(this.storageKey, JSON.stringify(citas));
  }

  getCitas(): Observable<CitaModel[]> {
    return this.citasSubject.asObservable();
  }

  horarioOcupado(medicoId: number, fecha: string, hora: string): boolean {
    // Las citas canceladas liberan el horario y dejan de bloquear nuevas reservas.
    return this.citasSubject.value.some((cita) =>
      cita.medicoId === medicoId && cita.fecha === fecha && cita.hora === hora && cita.estado !== 'CANCELADA'
    );
  }

  actualizarDatosPaciente(emailAnterior: string, nombre: string, email: string): void {
    const citas = this.citasSubject.value.map((cita) =>
      cita.pacienteEmail === emailAnterior
        ? { ...cita, pacienteNombre: nombre, pacienteEmail: email }
        : cita
    );
    this.citasSubject.next(citas);
    this.guardarCitas(citas);
  }

  crearCita(cita: CitaModel): Observable<CitaModel> {
    // La cita se completa aquí para centralizar el identificador y el estado inicial.
    const nuevaCita: CitaModel = {
      ...cita,
      id: cita.id ?? crypto.randomUUID(),
      estado: cita.estado ?? 'PENDIENTE'
    };

    const citas = [...this.citasSubject.value, nuevaCita];
    this.citasSubject.next(citas);
    this.guardarCitas(citas);
    return of(nuevaCita);
  }

  cancelarCita(id: string): Observable<boolean> {
    return this.cambiarEstado(id, 'CANCELADA');
  }

  cambiarEstado(id: string, estado: EstadoCita): Observable<boolean> {
    // El booleano informa al componente si realmente se encontró la cita solicitada.
    let actualizada = false;
    const citas = this.citasSubject.value.map((cita) => {
      if (cita.id !== id) {
        return cita;
      }

      actualizada = true;
      return { ...cita, estado };
    });

    if (actualizada) {
      this.citasSubject.next(citas);
      this.guardarCitas(citas);
    }

    return of(actualizada);
  }
}
