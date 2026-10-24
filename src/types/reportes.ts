
export interface CitasPorEspecialidad {
  especialidad: string;
  total_citas: number;
}

export interface RespuestaCitasPorEspecialidad {
  data: CitasPorEspecialidad[];
}

export interface CitasPorDia {
  fecha: string; // YYYY-MM-DD (día local del navegador)
  etiqueta: string; 
  total: number;
}
