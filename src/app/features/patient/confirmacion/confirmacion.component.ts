import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirmacion',
  imports: [RouterLink],
  template: `
    <main class="confirmation">
      <div class="check" aria-hidden="true">✓</div>
      <p class="eyebrow">Reserva registrada</p>
      <h1>Tu cita está en camino.</h1>
      <p>Hemos guardado tu solicitud. Recibirás la confirmación en tu correo electrónico.</p>
      <a routerLink="/paciente/buscar">Buscar otro especialista</a>
    </main>
  `,
  styles: `
    :host { display: block; }
    .confirmation { margin: 0 auto; max-width: 600px; padding: 8rem 1.25rem; text-align: center; }
    .check { align-items: center; background: #ccfbf1; border-radius: 50%; color: #0f766e; display: flex; font-size: 2rem; height: 4rem; justify-content: center; margin: 0 auto 1.5rem; width: 4rem; }
    .eyebrow { color: #0f766e; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    h1 { color: #134e4a; font-size: clamp(2rem, 5vw, 3.5rem); margin: .5rem 0 1rem; }
    p:not(.eyebrow) { color: #52706e; font-size: 1.05rem; line-height: 1.6; }
    a { color: #0f766e; display: inline-block; font-weight: 800; margin-top: 1.5rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmacionComponent {}
