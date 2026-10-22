export interface Medico {
  id_medico: number;
  nombre: string;
  apellido: string;
  especialidad: {
    id_especialidad: number;
    nombre: string;
  };
}
