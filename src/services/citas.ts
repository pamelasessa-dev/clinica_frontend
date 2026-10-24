import { api } from "../lib/axios";
import type {
  Cita,
  EstadoCita,
  RespuestaCitas,
} from "../types/citas";
import type { CrearCitaDTO } from "../types/dtos";

export async function obtenerCitas(estado?: EstadoCita): Promise<Cita[]> {
  const response = await api.get<RespuestaCitas>("/citas/", {
    params: estado ? { estado } : {},
  });

  return response.data.data;
}

export async function obtenerCitasPorPaciente(CI: number): Promise<Cita[]> {
  const citas = await obtenerCitas();

  return citas.filter((cita) => cita.paciente.CI === CI);
}

export async function crearCita(datos: CrearCitaDTO): Promise<Cita> {
  const response = await api.post<Cita>("/citas/", datos);

  const citas = await obtenerCitas();

  const creada = citas.find((cita) => cita.id_cita === response.data.id_cita);

  if (!creada) {
    throw new Error(
      "La cita se creó, pero no se pudo recuperar su información",
    );
  }

  return creada;
}

export async function actualizarEstadoCita(
  id: number,
  estado: EstadoCita,
): Promise<void> {
  await api.patch(`/citas/${id}/status`, { estado });
}
