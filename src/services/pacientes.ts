import { api } from '../lib/axios';
import type {
  PacienteApi,
  PacienteExpedienteApi,
} from '../types/paciente';

export async function obtenerPacientes(): Promise<PacienteApi[]> {
  const response = await api.get<PacienteApi[]>('/pacientes/');
  return response.data;
}

export async function obtenerExpedientePaciente(
  CI: string,
): Promise<PacienteExpedienteApi> {
  const response = await api.get<PacienteExpedienteApi>(
    `/pacientes/${CI}/expediente`,
  );

  return response.data;
}