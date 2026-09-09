export interface MedicoModel {
  id: number;
  nombreCompleto: string;
  especialidad: string;
  cmp: string;
  disponibilidad: string[];
  imagenUrl?: string;
}
