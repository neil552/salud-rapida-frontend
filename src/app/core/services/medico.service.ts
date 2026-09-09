import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicoModel } from '../models/medico.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly http = inject(HttpClient);

  getMedicos(): Observable<MedicoModel[]> {
    return this.http.get<MedicoModel[]>('/api/medicos');
  }

  getMedicoById(id: number): Observable<MedicoModel | undefined> {
    return this.http.get<MedicoModel>(`/api/medicos/${id}`).pipe(map((medico) => medico));
  }
}
