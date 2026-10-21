import { api } from '../lib/axios';
import type {
  PacienteApi,
  PacienteExpedienteApi,
  CrearPacienteDTO,
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

export async function crearPaciente(
  datos: CrearPacienteDTO,
): Promise<PacienteApi> {
  const response = await api.post<PacienteApi>(
    '/pacientes/',
    datos,
  );

  return response.data;
}


export async function eliminarPaciente(CI: string): Promise<void> {
  await api.delete(`/pacientes/${CI}`);
}
