import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Arranca la aplicación standalone con la configuración global de Angular.
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
