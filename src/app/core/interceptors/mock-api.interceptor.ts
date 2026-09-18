import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MOCK_MEDICOS } from '../mocks/mock-database';

export const mockApiInterceptor: HttpInterceptorFn = (request, next): Observable<HttpEvent<unknown>> => {
  // Intercepta únicamente los endpoints de médicos; el resto sigue hacia la cadena HTTP.
  if (request.url === '/api/medicos' && request.method === 'GET') {
    return of(new HttpResponse({ status: 200, body: MOCK_MEDICOS }));
  }

  if (request.url.startsWith('/api/medicos/') && request.method === 'GET') {
    const id = Number(request.url.split('/').pop());
    const medico = MOCK_MEDICOS.find((item) => item.id === id);
    return of(new HttpResponse({ status: medico ? 200 : 404, body: medico }));
  }

  return next(request);
};
