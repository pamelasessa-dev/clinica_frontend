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

// Estructura que devuelve GET /citas/ (el backend no pagina esta lista).
export interface RespuestaCitas {
  data: Cita[];
}

