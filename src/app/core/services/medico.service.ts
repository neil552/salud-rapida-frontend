import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoModel } from '../models/medico.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly http = inject(HttpClient);

  getMedicos(): Observable<MedicoModel[]> {
    // La fuente de datos puede cambiar del interceptor mock a una API real sin afectar al componente.
    return this.http.get<MedicoModel[]>('/api/medicos');
  }

  getMedicoById(id: number): Observable<MedicoModel | undefined> {
    // El endpoint devuelve undefined cuando el interceptor no encuentra el identificador.
    return this.http.get<MedicoModel>(`/api/medicos/${id}`).pipe(map((medico) => medico));
  }
}
