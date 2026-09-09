import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  private readonly notificationService = inject(NotificationService);
  readonly message = signal<string | null>(null);
  private dismissTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.notificationService.onNotification$.subscribe((message) => {
      this.message.set(message);
      if (this.dismissTimer) {
        clearTimeout(this.dismissTimer);
      }
      this.dismissTimer = setTimeout(() => this.message.set(null), 4500);
    });
  }

  cerrar(): void {
    this.message.set(null);
  }
}
