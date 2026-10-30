import { api } from "../lib/axios";
import type {
  Cita,
  EstadoCita,
  EstadoFiltroCita,
} from "../types/citas";
import type { CrearCitaDTO } from "../types/dtos";
import type { RespuestaPaginada } from "../types/api";

export async function obtenerCitasPagina(
  pagina: number,
  estado: EstadoFiltroCita,
  signal?: AbortSignal,
): Promise<RespuestaPaginada<Cita>> {
  const response = await api.get<RespuestaPaginada<Cita>>("/citas/", {
    params: { pagina, limite: 10, ...(estado !== "Todos" && { estado }) },
    signal,
  });

  return response.data;
}

export async function obtenerCitasPorPaciente(CI: number): Promise<Cita[]> {
  const response = await api.get<Cita[]>(`/citas/paciente/${CI}`);
  return response.data;
}

export async function crearCita(datos: CrearCitaDTO): Promise<Cita> {
  const response = await api.post<Cita>("/citas/", datos);
  const creada = await api.get<Cita>(`/citas/${response.data.id_cita}`);
  return creada.data;
}

export async function actualizarEstadoCita(
  id: number,
  estado: EstadoCita,
): Promise<void> {
  await api.patch(`/citas/${id}/status`, { estado });
}
