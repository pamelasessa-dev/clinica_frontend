import { api } from "../lib/axios";
import type { RespuestaPaginada } from "../types/api";

interface PacienteApi {
  CI: number;
}

interface MedicoApi {
  id_medico: number;
}

interface CitaApi {
  id_cita: number;
  estado: "PROGRAMADA" | "COMPLETADA" | "CANCELADA";
}

export interface MetricasDashboard {
  pacientes: number;
  medicos: number;
  citasProgramadas: number;
  citasCompletadas: number;
}

export async function obtenerMetricasDashboard(): Promise<MetricasDashboard> {
  const [
    respuestaPacientes,
    respuestaMedicos,
    respuestaProgramadas,
    respuestaCompletadas,
  ] = await Promise.all([
    api.get<PacienteApi[]>("/pacientes/"),
    api.get<MedicoApi[]>("/medicos/"),
    api.get<RespuestaPaginada<CitaApi>>("/citas/", {
      params: { estado: "PROGRAMADA", limite: 1 },
    }),
    api.get<RespuestaPaginada<CitaApi>>("/citas/", {
      params: { estado: "COMPLETADA", limite: 1 },
    }),
  ]);

  return {
    pacientes: respuestaPacientes.data.length,
    medicos: respuestaMedicos.data.length,
    citasProgramadas: respuestaProgramadas.data.total,
    citasCompletadas: respuestaCompletadas.data.total,
  };
}
