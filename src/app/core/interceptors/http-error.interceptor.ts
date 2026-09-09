import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (_request, next) =>
  next(_request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error en la solicitud HTTP', error.message);
      return throwError(() => error);
    })
  );
