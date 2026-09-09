import { Routes } from '@angular/router';
import { AuthGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{
		path: 'login',
		loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
	},
	{
		path: 'registro',
		loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
	},
	{
		path: 'paciente/buscar',
		loadComponent: () => import('./features/patient/buscar-medico/buscar-medico.component').then((m) => m.BuscarMedicoComponent)
	},
	{
		path: 'paciente/reservar',
		loadComponent: () => import('./features/patient/reservar-cita/reservar-cita.component').then((m) => m.ReservarCitaComponent)
	},
	{
		path: 'paciente/confirmacion',
		loadComponent: () => import('./features/patient/confirmacion/confirmacion.component').then((m) => m.ConfirmacionComponent)
	},
	{
		path: 'paciente/mis-citas',
		loadComponent: () => import('./features/patient/mis-citas/mis-citas.component').then((m) => m.MisCitasComponent),
		canActivate: [AuthGuard]
	},
	{
		path: 'medico/agenda',
		loadComponent: () => import('./features/doctor/agenda-medica/agenda-medica.component').then((m) => m.AgendaMedicaComponent),
		canActivate: [AuthGuard, roleGuard('MEDICO')]
	},
	{
		path: 'admin/dashboard',
		loadComponent: () => import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
		canActivate: [AuthGuard, roleGuard('ADMIN')]
	},
	{ path: '**', redirectTo: 'paciente/buscar' }
];
