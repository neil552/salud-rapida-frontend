export type RolUsuario = 'PACIENTE' | 'MEDICO' | 'ADMIN';

export interface UsuarioModel {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  medicoId?: number;
}
