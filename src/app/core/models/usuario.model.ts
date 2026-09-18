export type RolUsuario = 'PACIENTE' | 'MEDICO' | 'ADMIN';

// medicoId solo aplica a cuentas médicas y permite filtrar su propia agenda.
export interface UsuarioModel {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  medicoId?: number;
}
