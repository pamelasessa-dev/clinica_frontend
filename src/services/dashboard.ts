import { api } from "../lib/axios";

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

interface RespuestaCitasApi {
  data: CitaApi[];
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
    api.get<RespuestaCitasApi>("/citas/", {
      params: { estado: "PROGRAMADA" },
    }),
    api.get<RespuestaCitasApi>("/citas/", {
      params: { estado: "COMPLETADA" },
    }),
  ]);

  return {
    pacientes: respuestaPacientes.data.length,
    medicos: respuestaMedicos.data.length,
    citasProgramadas: respuestaProgramadas.data.data.length,
    citasCompletadas: respuestaCompletadas.data.data.length,
  };
}
