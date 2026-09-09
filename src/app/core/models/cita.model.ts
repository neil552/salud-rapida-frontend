export type EstadoCita = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'ATENDIDA';

export interface CitaModel {
  id?: string;
  pacienteNombre: string;
  pacienteDni: string;
  pacienteEmail: string;
  medicoId: number;
  medicoNombre: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: EstadoCita;
}
