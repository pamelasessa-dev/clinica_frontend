import type { Cita } from "./citas";
import type { Paciente, PacienteApi } from "./paciente";

// Los DTOs siguen el contrato de entrada de la API. PacienteApi es la forma
// de la entidad que devuelve el backend (CI), mientras Paciente es el modelo
// adaptado que usa la interfaz (id).
export type CrearPacienteDTO = Pick<
  PacienteApi,
  | "CI"
  | "nombre"
  | "apellido"
  | "email"
  | "fecha_nacimiento"
  | "direccion"
  | "telefono"
>;

export type ActualizarPacienteDTO = Partial<Omit<CrearPacienteDTO, "CI">>;
export type ResumenPaciente = Pick<
  Paciente,
  "id" | "nombre" | "apellido" | "email"
>;

export type CrearCitaDTO = Pick<Cita, "fecha_hora"> & {
  CI_paciente: Cita["paciente"]["CI"];
  id_medico: number;
};
