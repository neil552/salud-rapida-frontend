import { MedicoModel } from '../models/medico.model';

export const MOCK_MEDICOS: MedicoModel[] = [
  {
    id: 1,
    nombreCompleto: 'Valeria Mendoza',
    especialidad: 'Medicina general',
    cmp: '10234',
    disponibilidad: ['09:00 AM', '11:30 AM', '03:00 PM']
  },
  {
    id: 2,
    nombreCompleto: 'Jorge Salazar',
    especialidad: 'Cardiología',
    cmp: '18452',
    disponibilidad: ['08:30 AM', '10:00 AM', '04:30 PM']
  },
  {
    id: 3,
    nombreCompleto: 'Lucía Fernández',
    especialidad: 'Pediatría',
    cmp: '21987',
    disponibilidad: ['09:30 AM', '01:00 PM', '05:00 PM']
  }
];
