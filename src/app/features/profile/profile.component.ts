import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { CitaService } from '../../core/services/cita.service';
import { RolUsuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  readonly closed = output<void>();
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly citaService = inject(CitaService);
  readonly usuario = this.authService.getCurrentUser();
  readonly error = signal('');
  readonly guardado = signal(false);

  readonly profileForm = this.formBuilder.nonNullable.group({
    nombre: [this.usuario?.nombre ?? '', [Validators.required, Validators.minLength(3)]],
    email: [this.usuario?.email ?? '', [Validators.required, Validators.email]]
  });

  rolTexto(rol: RolUsuario | undefined): string {
    return rol === 'ADMIN' ? 'Administrador' : rol === 'MEDICO' ? 'Médico' : 'Paciente';
  }

  guardar(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const emailAnterior = this.usuario?.email ?? '';
    const nombre = this.profileForm.controls.nombre.value;
    const email = this.profileForm.controls.email.value;
    const result = this.authService.updateProfile(nombre, email);
    if (!result.success) {
      this.error.set(result.message ?? 'No se pudo actualizar el perfil.');
      this.guardado.set(false);
      return;
    }

    this.error.set('');
    this.citaService.actualizarDatosPaciente(emailAnterior, nombre.trim(), email.trim().toLowerCase());
    this.guardado.set(true);
    this.notificationService.notify('Perfil actualizado correctamente.');
  }

  campoInvalido(campo: 'nombre' | 'email'): boolean {
    const control = this.profileForm.controls[campo];
    return control.invalid && control.touched;
  }

  cerrar(): void {
    this.closed.emit();
  }
}
