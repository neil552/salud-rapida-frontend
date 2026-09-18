import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolUsuario } from '../models/usuario.model';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se devuelve un UrlTree para que Angular redirija sin navegación manual.
  return authService.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

export const roleGuard = (role: RolUsuario): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // La ruta exige tanto una sesión válida como el rol indicado por su configuración.
  return authService.hasRole(role) ? true : router.createUrlTree(['/login']);
};
