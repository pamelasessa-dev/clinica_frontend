import type { Cita } from "./citas";
import type { Paciente, PacienteApi } from "./paciente";

export type CrearPacienteDTO = Pick<
  PacienteApi,
  | "CI"
  | "nombre"
  | "apellido"
  | "email"
  | "estado"
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
