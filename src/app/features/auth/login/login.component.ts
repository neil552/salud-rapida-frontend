import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly error = signal('');

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    const authenticated = this.authService.login(email, password);
    if (!authenticated) {
      this.error.set('Correo o contraseña incorrectos.');
      return;
    }

    this.error.set('');
    const rol = this.authService.getCurrentUser()?.rol;
    const destino = rol === 'MEDICO' ? '/medico/agenda' : rol === 'ADMIN' ? '/admin/dashboard' : '/paciente/buscar';
    void this.router.navigateByUrl(destino);
  }

  campoInvalido(campo: 'email' | 'password'): boolean {
    const control = this.loginForm.controls[campo];
    return control.invalid && control.touched;
  }
}
