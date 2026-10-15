
export type EstadoPaciente = 'activo' | 'inactivo' | 'en_espera';

// Valor del select de filtro: un estado concreto o "Todos"
export type FiltroEstado = EstadoPaciente | 'Todos';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidadAsignada: string;
  ultimaCita: string;
  estado: EstadoPaciente;
}

// Datos que el formulario de "Agregar paciente" entrega a la página
export interface NuevoPaciente {
  nombre: string;
  apellido: string;
  email: string;
  estado: EstadoPaciente;
}
