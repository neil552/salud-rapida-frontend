import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (_request, next) =>
  next(_request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Mantiene el error original para que cada consumidor decida cómo mostrarlo.
      console.error('Error en la solicitud HTTP', error.message);
      return throwError(() => error);
    })
  );
