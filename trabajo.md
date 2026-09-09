MASTER PROMPT: DESARROLLO DE SISTEMA WEB DE CITAS MÉDICAS EN ANGULAR (SALUD RÁPIDA S.A.)

🎯 OBJETIVO DEL PROMPT

Actúa como un Desarrollador Frontend Senior y Arquitecto de Software experto en Angular 17+ / 18+, TypeScript, RxJS, y Tailwind CSS.
Tu tarea es construir paso a paso la estructura, modelos, servicios, componentes, formularios y enrutamiento para el sistema web de reserva de citas médicas de la clínica "Salud Rápida S.A." (Proyecto Final SENATI PAWD-401).

🏗️ 1. TECNOLOGÍAS Y REQUISITOS TÉCNICOS

Framework: Angular 17+ / 18+ (Utilizando Standalone Components o Feature Modules estructurados).

Estilos: Tailwind CSS v3+ (o Angular Material si aplica).

Estado y Asincronía: RxJS (Observables, BehaviorSubjects, Operators como map, switchMap, tap).

Formularios: Angular ReactiveFormsModule (FormBuilder, FormGroup, Validators).

Enrutamiento: Angular Router con Lazy Loading y Guards (canActivate).

Despliegue target: Vercel (incluyendo configuración vercel.json).

📁 2. ARQUITECTURA DE ARCHIVOS REQUERIDA

Genera los archivos siguiendo de manera estricta esta estructura modular:

src/app/
├── core/
│ ├── models/
│ │ ├── cita.model.ts
│ │ ├── medico.model.ts
│ │ └── usuario.model.ts
│ ├── services/
│ │ ├── auth.service.ts
│ │ ├── cita.service.ts
│ │ ├── medico.service.ts
│ │ └── notification.service.ts
│ ├── guards/
│ │ └── auth.guard.ts
│ └── interceptors/
│ └── http-error.interceptor.ts
├── shared/
│ ├── components/
│ │ ├── navbar/
│ │ ├── footer/
│ │ └── toast/
│ ├── pipes/
│ │ ├── doctor-format.pipe.ts
│ │ └── fecha-corta.pipe.ts
│ └── directives/
│ └── highlight-slot.directive.ts
├── features/
│ ├── auth/
│ │ └── login/
│ ├── patient/
│ │ ├── buscar-medico/
│ │ ├── reservar-cita/
│ │ └── mis-citas/
│ ├── doctor/
│ │ └── agenda-medica/
│ └── admin/
│ └── dashboard/
├── app.routes.ts
└── app.component.ts

📝 3. ESPECIFICACIÓN DE MÓDULOS Y COMPONENTES

A. Modelos de Datos (core/models/)

medico.model.ts:

id: number

nombreCompleto: string

especialidad: string

cmp: string

disponibilidad: string[] (ej. ['09:00 AM', '11:30 AM', '03:00 PM'])

imagenUrl?: string

cita.model.ts:

id?: string

pacienteNombre: string

pacienteDni: string

pacienteEmail: string

medicoId: number

medicoNombre: string

especialidad: string

fecha: string

hora: string

estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'ATENDIDA'

B. Servicios e Inyección de Dependencias (core/services/)

CitaService (providedIn: 'root'):

Mantener un estado local con BehaviorSubject<CitaModel[]> para simular la persistencia de datos.

Métodos:

getCitas(): Observable<CitaModel[]>

crearCita(cita: CitaModel): Observable<CitaModel>

cancelarCita(id: string): Observable<boolean>

cambiarEstado(id: string, estado: string): Observable<boolean>

NotificationService (providedIn: 'root'):

Un Subject<string> para disparar notificaciones en tiempo real (simulación de WebSockets/Toasts).

Método notify(mensaje: string) y observable onNotification$.

AuthService (providedIn: 'root'):

Manejo de usuario actual (BehaviorSubject), método login(), logout(), isLoggedIn(), hasRole(role).

C. Custom Pipes (shared/pipes/)

DoctorFormatPipe (@Pipe({ name: 'doctorFormat' })):

Transforma datos del médico en un formato corporativo: Dr. [NOMBRE] — ESPECIALIDAD (CMP [NÚMERO]).

FechaCortaPipe (@Pipe({ name: 'fechaCorta' })):

Formatea strings de fecha YYYY-MM-DD a formato largo legible en español (Ej: Lunes, 15 de Octubre de 2025).

D. Componentes Clave y Formularios Reactivos

ReservarCitaComponent (features/patient/reservar-cita/):

Crear un Reactive Form (FormGroup) con los campos:

especialidad: Requerido.

medicoId: Requerido. Al cambiar, filtra los médicos y sus horarios.

fecha: Requerida (fecha mínima: hoy).

hora: Requerida.

pacienteDni: Requerido, exactamente 8 dígitos numéricos (Validators.pattern('^[0-9]{8}$')).

pacienteNombre: Requerido, mínimo 3 caracteres.

pacienteEmail: Requerido, formato email válido (Validators.email).

Implementar feedback visual de validación: mostrar mensajes de error solo si el campo es invalid y touched.

Al enviar el formulario con éxito, invocar CitaService.crearCita(), disparar NotificationService.notify() y navegar a la confirmación.

AgendaMedicaComponent (features/doctor/agenda-medica/):

Vista de tabla para el médico donde pueda filtrar citas por fecha y cambiar el estado (Confirmar / Cancelar / Marcar como Atendida).

E. Enrutamiento y Carga Diferida (app.routes.ts)

Configura las rutas con Lazy Loading:

import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
{ path: '', redirectTo: 'paciente/buscar', pathMatch: 'full' },
{
path: 'paciente/buscar',
loadComponent: () => import('./features/patient/buscar-medico/buscar-medico.component').then(m => m.BuscarMedicoComponent)
},
{
path: 'paciente/reservar',
loadComponent: () => import('./features/patient/reservar-cita/reservar-cita.component').then(m => m.ReservarCitaComponent)
},
{
path: 'medico/agenda',
loadComponent: () => import('./features/doctor/agenda-medica/agenda-medica.component').then(m => m.AgendaMedicaComponent),
canActivate: [AuthGuard]
},
{ path: '**', redirectTo: 'paciente/buscar' }
];

⚙️ 4. ARCHIVOS DE CONFIGURACIÓN ADICIONALES

vercel.json (para correcto enrutamiento SPA en Vercel):

{
"rewrites": [
{ "source": "/(.*)", "destination": "/index.html" }
]
}

tailwind.config.js (configuración básica para paleta médica):

module.exports = {
content: ["./src/**/*.{html,ts}"],
theme: {
extend: {
colors: {
brand: {
50: '#f0fdfa',
500: '#14b8a6',
600: '#0d9488',
700: '#0f766e',
900: '#134e4a',
}
}
},
},
plugins: [],
}

🚀 INSTRUCCIÓN DE SALIDA DESEADA

Por favor, genera primero la estructura de carpetas y luego escribe el código completo y sin omitir detalles para:

core/models/cita.model.ts y medico.model.ts

core/services/cita.service.ts y notification.service.ts

shared/pipes/doctor-format.pipe.ts

features/patient/reservar-cita/reservar-cita.component.ts (con su HTML/TypeScript)

app.routes.ts y vercel.json
