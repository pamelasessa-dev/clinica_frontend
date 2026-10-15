import type { EstadoPaciente } from '../types/paciente';

export const ESTADOS_PACIENTE: EstadoPaciente[] = [
  'activo',
  'inactivo',
  'en_espera',
];

export const etiquetasPorEstado: Record<EstadoPaciente, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  en_espera: 'En espera',
};
