// Datos que necesita el buscador y el selector de horarios de reserva.
export interface MedicoModel {
  id: number;
  nombreCompleto: string;
  especialidad: string;
  cmp: string;
  disponibilidad: string[];
  imagenUrl?: string;
}
