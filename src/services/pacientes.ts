import { api } from "../lib/axios";
import type {
  PacienteApi,
  PacienteExpedienteApi,
  CrearPacienteDTO,
} from "../types/paciente";

export async function obtenerPacientes(query?: string): Promise<PacienteApi[]> {
  const response = await api.get<PacienteApi[]>("/pacientes/", {
    params: query ? { query } : {},
  });

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
  const response = await api.post<PacienteApi>("/pacientes/", datos);
  return response.data;
}

export async function actualizarPaciente(
  CI: string,
  datos: Partial<Omit<CrearPacienteDTO, "CI">>,
): Promise<PacienteApi> {
  const response = await api.put<PacienteApi>(`/pacientes/${CI}`, datos);
  return response.data;
}

export async function eliminarPaciente(CI: string): Promise<void> {
  await api.delete(`/pacientes/${CI}`);
}
