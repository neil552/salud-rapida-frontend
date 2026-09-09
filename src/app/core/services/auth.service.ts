import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsuarioModel, RolUsuario } from '../models/usuario.model';

interface DemoCredential {
  email: string;
  password: string;
  nombre: string;
  rol: RolUsuario;
  medicoId?: number;
}

interface RegisteredPatient {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'PACIENTE';
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  { email: 'paciente@saludrapida.pe', password: 'Paciente123!', nombre: 'Paciente demo', rol: 'PACIENTE' },
  { email: 'medico@saludrapida.pe', password: 'Medico123!', nombre: 'Jorge Salazar', rol: 'MEDICO', medicoId: 2 },
  { email: 'valeria@saludrapida.pe', password: 'Valeria123!', nombre: 'Valeria Mendoza', rol: 'MEDICO', medicoId: 1 },
  { email: 'lucia@saludrapida.pe', password: 'Lucia123!', nombre: 'Lucía Fernández', rol: 'MEDICO', medicoId: 3 },
  { email: 'admin@saludrapida.pe', password: 'Admin123!', nombre: 'Administrador demo', rol: 'ADMIN' }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'salud-rapida.usuario';
  private readonly patientsKey = 'salud-rapida.pacientes';
  private readonly usuarioSubject = new BehaviorSubject<UsuarioModel | null>(null);
  readonly usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    const usuarioGuardado = localStorage.getItem(this.storageKey);
    if (usuarioGuardado) {
      try {
        this.usuarioSubject.next(JSON.parse(usuarioGuardado) as UsuarioModel);
      } catch {
        localStorage.removeItem(this.storageKey);
      }
    }
  }

  login(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const credential = DEMO_CREDENTIALS.find(
      (item) => item.email === normalizedEmail && item.password === password
    );

    const registeredPatient = this.getRegisteredPatients().find(
      (patient) => patient.email === normalizedEmail && patient.password === password
    );

    if (!credential && !registeredPatient) {
      return false;
    }

    const usuario: UsuarioModel = {
      id: credential ? `demo-${credential.rol.toLowerCase()}` : registeredPatient!.id,
      nombre: credential?.nombre ?? registeredPatient!.nombre,
      email: normalizedEmail,
      rol: credential?.rol ?? 'PACIENTE',
      medicoId: credential?.medicoId
    };
    this.usuarioSubject.next(usuario);
    localStorage.setItem(this.storageKey, JSON.stringify(usuario));
    return true;
  }

  registerPatient(nombre: string, email: string, password: string): { success: boolean; message?: string } {
    const normalizedEmail = email.trim().toLowerCase();
    const emailInUse = DEMO_CREDENTIALS.some((item) => item.email === normalizedEmail)
      || this.getRegisteredPatients().some((patient) => patient.email === normalizedEmail);

    if (emailInUse) {
      return { success: false, message: 'Este correo ya está registrado.' };
    }

    const patients = this.getRegisteredPatients();
    patients.push({
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      email: normalizedEmail,
      password,
      rol: 'PACIENTE'
    });
    localStorage.setItem(this.patientsKey, JSON.stringify(patients));
    return { success: true };
  }

  private getRegisteredPatients(): RegisteredPatient[] {
    const patients = localStorage.getItem(this.patientsKey);
    if (!patients) {
      return [];
    }

    try {
      const parsed = JSON.parse(patients) as unknown;
      return Array.isArray(parsed) ? parsed as RegisteredPatient[] : [];
    } catch {
      localStorage.removeItem(this.patientsKey);
      return [];
    }
  }

  logout(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return this.usuarioSubject.value !== null;
  }

  getCurrentUser(): UsuarioModel | null {
    return this.usuarioSubject.value;
  }

  hasRole(role: RolUsuario): boolean {
    return this.usuarioSubject.value?.rol === role;
  }
}
