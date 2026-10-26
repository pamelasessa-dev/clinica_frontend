import type { Cita } from "./citas";

export type EstadoPaciente = "activo" | "inactivo" | "en_espera";
export type FiltroEstado = "Todos" | EstadoPaciente;

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  estado: EstadoPaciente;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  especialidadAsignada: string;
  ultimaCita: string;
}
export type NuevoPaciente = Pick<Paciente, "nombre" | "apellido" | "email">;

export interface PacienteApi {
  CI: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: EstadoPaciente;
}

export type CitaExpedienteApi = Omit<Cita, "paciente">;

export interface PacienteExpedienteApi extends PacienteApi {
  citas: CitaExpedienteApi[];
}

