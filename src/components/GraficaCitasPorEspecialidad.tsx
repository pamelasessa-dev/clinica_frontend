import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApi } from "../hooks/useApi";
import type { RespuestaCitasPorEspecialidad } from "../types/reportes";
import { GraficaCard } from "./GraficaCard";

// Endpoint real del backend (solo rol GERENCIA):
// GET /reports/appointments-by-specialty → { data: [{ especialidad, total_citas }] }
const URL_REPORTE = "/reports/appointments-by-specialty";

export function GraficaCitasPorEspecialidad() {
  const { data, cargando, error, recargar } =
    useApi<RespuestaCitasPorEspecialidad>(URL_REPORTE);

  const datos = data?.data ?? [];

  return (
    <GraficaCard
      titulo="Citas por especialidad"
      descripcion="Total de citas registradas en cada especialidad."
      cargando={cargando}
      error={error}
      vacio={datos.length === 0}
      mensajeVacio="Todavía no hay citas registradas por especialidad."
      onReintentar={recargar}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datos} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="especialidad" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar
            dataKey="total_citas"
            name="Citas"
            fill="#059669"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </GraficaCard>
  );
}
