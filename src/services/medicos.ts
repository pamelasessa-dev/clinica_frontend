import { api } from "../lib/axios";

export interface MedicoApi {
  id_medico: number;
  nombre: string;
  apellido: string;
  especialidad: {
    id_especialidad: number;
    nombre: string;
  };
}

export async function obtenerMedicos(): Promise<MedicoApi[]> {
  const response = await api.get<MedicoApi[]>("/medicos/");
  return response.data;
}
