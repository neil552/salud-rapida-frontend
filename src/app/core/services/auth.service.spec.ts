import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());

  it('accepts valid credentials and persists the derived role', () => {
    // El login debe actualizar tanto el estado reactivo como la sesión persistida.
    const service = new AuthService();

    expect(service.login('medico@saludrapida.pe', 'Medico123!')).toBe(true);

    expect(service.isLoggedIn()).toBe(true);
    expect(service.hasRole('MEDICO')).toBe(true);
    expect(JSON.parse(localStorage.getItem('salud-rapida.usuario')!).rol).toBe('MEDICO');
  });

  it('associates each doctor account with its doctor id', () => {
    const service = new AuthService();

    expect(service.login('valeria@saludrapida.pe', 'Valeria123!')).toBe(true);
    expect(service.getCurrentUser()?.medicoId).toBe(1);
    expect(service.getCurrentUser()?.rol).toBe('MEDICO');
  });

  it('rejects invalid credentials without creating a session', () => {
    const service = new AuthService();

    expect(service.login('admin@saludrapida.pe', 'MEDICO123!')).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('registers a patient in localStorage and allows login', () => {
    // Una cuenta nueva debe poder autenticarse inmediatamente después del registro.
    const service = new AuthService();

    expect(service.registerPatient('Ana Pérez', 'ana@example.com', 'Paciente123!').success).toBe(true);
    expect(service.login('ana@example.com', 'Paciente123!')).toBe(true);
    expect(service.getCurrentUser()?.rol).toBe('PACIENTE');
  });

  it('rejects a duplicate patient email', () => {
    const service = new AuthService();
    service.registerPatient('Ana Pérez', 'ana@example.com', 'Paciente123!');

    expect(service.registerPatient('Otra Persona', 'ANA@example.com', 'Paciente456!').success).toBe(false);
  });

  it('logs out and clears the persisted session', () => {
    const service = new AuthService();
    service.login('admin@saludrapida.pe', 'Admin123!');

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('salud-rapida.usuario')).toBeNull();
  });
});
