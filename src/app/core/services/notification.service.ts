import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Subject evita almacenar avisos antiguos: solo interesa notificar eventos nuevos.
  private readonly notificationSubject = new Subject<string>();

  readonly onNotification$ = this.notificationSubject.asObservable();

  notify(mensaje: string): void {
    this.notificationSubject.next(mensaje);
  }
}
