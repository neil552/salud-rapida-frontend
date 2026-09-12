# Salud Rápida S.A.

Sistema web frontend para la gestión de citas médicas de la clínica **Salud Rápida S.A.**

La aplicación permite que los pacientes se registren, consulten médicos, reserven citas y revisen sus reservas. Los médicos pueden visualizar su agenda y actualizar el estado de sus citas. El administrador puede supervisar todas las reservas desde un dashboard centralizado.

> Proyecto frontend desarrollado con Angular 21. Actualmente utiliza datos mock y `localStorage`, sin backend externo.

## Contenido

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Perfiles de usuario](#perfiles-de-usuario)
- [Credenciales demo](#credenciales-demo)
- [Rutas](#rutas)
- [Arquitectura](#arquitectura)
- [Persistencia local](#persistencia-local)
- [Instalación](#instalación)
- [Comandos](#comandos)
- [Pruebas](#pruebas)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Limitaciones actuales](#limitaciones-actuales)

## Características

### Autenticación y registro

- Pantalla de login como entrada principal de la aplicación.
- Autenticación demo mediante correo y contraseña.
- Roles diferenciados para paciente, médico y administrador.
- Guards de autenticación y autorización por rol.
- Registro exclusivo para pacientes.
- Validación de correo, contraseña y duplicados.
- Persistencia de la sesión en `localStorage`.
- Perfil modal reutilizable para los tres roles.
- Edición local de nombre y correo.

### Funciones del paciente

- Consulta de médicos disponibles.
- Visualización de especialidad, CMP y horarios.
- Reserva de citas mediante formulario reactivo.
- Selección visual de fecha y horario.
- Bloqueo de horarios ocupados.
- Resumen de la reserva antes de confirmar.
- Validaciones de DNI, nombre, correo, médico, fecha y hora.
- Confirmación visual después de crear una cita.
- Vista **Mis citas** filtrada por paciente.
- Filtro de citas por estado.
- Cancelación con confirmación previa.
- Notificaciones Toast para operaciones exitosas.

### Funciones del médico

- Agenda exclusiva del médico autenticado.
- Visualización de pacientes asignados.
- Datos de paciente, DNI, fecha, hora y especialidad.
- Resumen de citas pendientes, confirmadas y atendidas.
- Filtro de agenda por fecha.
- Cambio de estado de una cita:
  - Confirmar.
  - Marcar como atendida.
  - Cancelar.
- Acciones deshabilitadas cuando el estado ya no permite otra transición.
- Cada médico está asociado a un `medicoId` específico.

### Funciones del administrador

- Dashboard exclusivo para administradores.
- Métricas de citas totales, pendientes, confirmadas y atendidas.
- Porcentajes visuales de citas pendientes y confirmadas.
- Filtro de reservas por estado.
- Tabla de actividad reciente.
- Visualización global de paciente, médico, fecha, hora y estado.
- Diseño responsive para escritorio y móvil.

### Diseño y experiencia

- Identidad visual azul clínico con acentos coral.
- Login y registro con composición premium.
- Dashboards con hero visual, tarjetas y métricas.
- Tablas responsive y estados diferenciados por color.
- Navbar contextual según el rol.
- Footer global presente en todas las páginas.
- Modal global de perfil.
- Estados vacíos y mensajes de validación.
- Foco visible y mejoras de accesibilidad.
- Diseño adaptable para móviles, tablets y escritorio.

## Tecnologías

- Angular 21.
- TypeScript 5.9.
- RxJS 7.8.
- Angular Router.
- Reactive Forms.
- Tailwind CSS 3.
- CSS responsive.
- Vitest para pruebas unitarias.
- Vercel para despliegue.

## Perfiles de usuario

### Paciente

Puede registrarse, iniciar sesión, buscar médicos, reservar citas y administrar sus propias reservas.

### Médico

Puede ingresar con una cuenta médica, consultar las citas que le fueron asignadas y actualizar su estado.

### Administrador

Puede visualizar todas las citas y consultar los indicadores generales de operación.

## Credenciales demo

Estas credenciales son únicamente para probar el prototipo frontend:

| Perfil                  | Correo                    | Contraseña     |
| ----------------------- | ------------------------- | -------------- |
| Paciente                | `paciente@saludrapida.pe` | `Paciente123!` |
| Médico: Jorge Salazar   | `medico@saludrapida.pe`   | `Medico123!`   |
| Médico: Valeria Mendoza | `valeria@saludrapida.pe`  | `Valeria123!`  |
| Médico: Lucía Fernández | `lucia@saludrapida.pe`    | `Lucia123!`    |
| Administrador           | `admin@saludrapida.pe`    | `Admin123!`    |

El registro público solo está habilitado para pacientes.

## Rutas

| Ruta                     | Acceso               | Descripción                |
| ------------------------ | -------------------- | -------------------------- |
| `/`                      | Público              | Redirige al login.         |
| `/login`                 | Público              | Inicio de sesión.          |
| `/registro`              | Público              | Registro de pacientes.     |
| `/paciente/buscar`       | Paciente             | Búsqueda de médicos.       |
| `/paciente/reservar`     | Paciente             | Reserva de una cita.       |
| `/paciente/confirmacion` | Paciente             | Confirmación de reserva.   |
| `/paciente/mis-citas`    | Paciente autenticado | Citas del paciente actual. |
| `/medico/agenda`         | Rol médico           | Agenda del médico actual.  |
| `/admin/dashboard`       | Rol administrador    | Dashboard global de citas. |

El perfil se abre como modal desde **Mi perfil** y no utiliza una ruta independiente.

## Arquitectura

```text
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   ├── http-error.interceptor.ts
│   │   └── mock-api.interceptor.ts
│   ├── mocks/
│   │   └── mock-database.ts
│   ├── models/
│   │   ├── cita.model.ts
│   │   ├── medico.model.ts
│   │   └── usuario.model.ts
│   └── services/
│       ├── auth.service.ts
│       ├── cita.service.ts
│       ├── medico.service.ts
│       └── notification.service.ts
├── features/
│   ├── admin/dashboard/
│   ├── auth/login/
│   ├── auth/register/
│   ├── doctor/agenda-medica/
│   ├── patient/buscar-medico/
│   ├── patient/confirmacion/
│   ├── patient/mis-citas/
│   ├── patient/reservar-cita/
│   └── profile/
└── shared/
    ├── components/
    │   ├── footer/
    │   ├── navbar/
    │   └── toast/
    ├── directives/
    │   └── highlight-slot.directive.ts
    └── pipes/
        ├── doctor-format.pipe.ts
        └── fecha-corta.pipe.ts
```

La aplicación utiliza componentes standalone, `ChangeDetectionStrategy.OnPush`, rutas lazy con `loadComponent`, servicios singleton y control de flujo moderno de Angular.

## Servicios principales

### `AuthService`

Gestiona:

- Login.
- Logout.
- Registro de pacientes.
- Usuario actual.
- Validación de roles.
- Persistencia de sesión.
- Actualización de perfil.

### `CitaService`

Gestiona:

- Consulta de citas mediante `BehaviorSubject`.
- Creación de citas.
- Cancelación de citas.
- Cambio de estado.
- Detección de horarios ocupados.
- Sincronización de datos del paciente.
- Persistencia en `localStorage`.

### `MedicoService`

Consulta médicos mediante `HttpClient`. Durante el desarrollo, el interceptor mock responde con información local sin necesidad de backend.

### `NotificationService`

Emite notificaciones mediante RxJS para mostrarlas en el componente Toast global.

## Persistencia local

El prototipo utiliza las siguientes claves de `localStorage`:

| Clave                    | Contenido                                |
| ------------------------ | ---------------------------------------- |
| `salud-rapida.usuario`   | Sesión del usuario autenticado.          |
| `salud-rapida.pacientes` | Pacientes registrados desde el frontend. |
| `salud-rapida.citas`     | Citas creadas y estados actualizados.    |

La información se conserva al recargar la página en el mismo navegador.

Para limpiar los datos durante una prueba, ejecutar en la consola del navegador:

```js
localStorage.clear();
location.reload();
```

## Instalación

Requisitos:

- Node.js compatible con Angular 21.
- npm.
- Git.

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm start
```

Abrir en el navegador:

```text
http://localhost:4200/
```

## Comandos

### Desarrollo

```bash
npm start
```

### Compilación de producción

```bash
npm run build
```

La salida se genera en:

```text
dist/salud-rapida-frontend/browser
```

### Pruebas unitarias

```bash
npm test -- --watch=false
```

### Compilación en modo watch

```bash
npm run watch
```

## Pruebas

La suite actual valida:

- Creación de la aplicación.
- Login con credenciales válidas.
- Rechazo de credenciales inválidas.
- Asociación de médicos con su `medicoId`.
- Registro de pacientes.
- Prevención de correos duplicados.
- Logout y limpieza de sesión.
- Creación de citas.
- Actualización de estados.
- Cancelación de citas inexistentes.

Última validación registrada:

```text
3 archivos de prueba
10 pruebas correctas
npm run build correcto
```

## API mock frontend

El proyecto incluye un interceptor mock para simular endpoints de médicos:

```text
GET /api/medicos
GET /api/medicos/:id
```

Las respuestas se obtienen de:

```text
src/app/core/mocks/mock-database.ts
```

Esto permite que los componentes consuman `HttpClient` con una estructura similar a una futura API real.

## Despliegue en Vercel

El proyecto incluye [vercel.json](vercel.json) para soportar el enrutamiento SPA de Angular.

Configuración recomendada en Vercel:

```text
Framework Preset: Angular
Root Directory: ./
Install Command: npm install
Build Command: npm run build
Output Directory: dist/salud-rapida-frontend/browser
```

Después de conectar el repositorio de GitHub, cada `push` a `main` genera un nuevo despliegue automáticamente.

## Repositorio

```text
https://github.com/neil552/salud-rapida-frontend
```

## Limitaciones actuales

Este proyecto es un prototipo frontend. Por ese motivo:

- No existe un backend real.
- Las contraseñas demo están definidas en el frontend.
- La persistencia usa `localStorage`.
- Los datos no se comparten entre navegadores o dispositivos.
- No se utilizan JWT ni sesiones seguras.
- El interceptor HTTP es simulado.

Para una versión productiva se debería incorporar una API, una base de datos, autenticación segura, contraseñas cifradas y validaciones del lado del servidor.

## Próximas mejoras

- Backend y base de datos centralizada.
- JWT o sesiones seguras.
- Recuperación de contraseña.
- Calendario semanal para médicos.
- Gestión de disponibilidad.
- Reportes administrativos.
- Exportación de citas.
- Pruebas de componentes y guards.

## Estado del proyecto

El frontend se encuentra funcional y desplegado como prototipo. Cubre el flujo principal de autenticación, registro de pacientes, reserva, consulta y administración de citas médicas.
