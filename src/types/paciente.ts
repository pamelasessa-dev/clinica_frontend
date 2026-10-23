import type { Cita } from "./citas";

export type FiltroEstado = "Todos";

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  especialidadAsignada: string;
  ultimaCita: string;
}

// Modelo resumido del frontend.
export type NuevoPaciente = Pick<Paciente, "nombre" | "apellido" | "email">;

export interface PacienteApi {
  CI: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
}

// El expediente trae las mismas citas que GET /citas/, sin el paciente.
export type CitaExpedienteApi = Omit<Cita, "paciente">;

export interface PacienteExpedienteApi extends PacienteApi {
  citas: CitaExpedienteApi[];
}

