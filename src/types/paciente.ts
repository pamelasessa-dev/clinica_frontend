
export type FiltroEstado =  'Todos';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadAsignada: string;
  ultimaCita: string;
}

export interface NuevoPaciente {
  nombre: string;
  apellido: string;
  email: string;
}


export interface PacienteApi {
  CI: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface CitaExpedienteApi {
  id_cita: number;
  fecha_hora: string;
  estado: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
  medico: {
    nombre: string;
    apellido: string;
    especialidad: {
      nombre: string;
    };
  };
}

export interface PacienteExpedienteApi extends PacienteApi {
  citas: CitaExpedienteApi[];
}

export interface CrearPacienteDTO {
  CI: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
}
