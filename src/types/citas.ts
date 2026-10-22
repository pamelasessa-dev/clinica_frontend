export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface Cita {
  id_cita: number;
  fecha_hora: string;
  estado: EstadoCita;
  paciente: {
    CI: number;
    nombre: string;
    apellido: string;
  };
  medico: {
    nombre: string;
    apellido: string;
    especialidad: {
      nombre: string;
    };
  };
}

export interface CrearCitaDTO {
  fecha_hora: string;
  CI_paciente: number;
  id_medico: number;
}
