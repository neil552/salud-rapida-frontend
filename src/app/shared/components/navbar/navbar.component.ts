import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileComponent } from '../../../features/profile/profile.component';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, ProfileComponent, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly showNavigation = signal(this.router.url !== '/login');
  readonly profileOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      this.showNavigation.set((event as NavigationEnd).urlAfterRedirects !== '/login');
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  abrirPerfil(): void {
    this.profileOpen.set(true);
  }

  cerrarPerfil(): void {
    this.profileOpen.set(false);
  }
}
