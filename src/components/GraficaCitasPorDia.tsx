import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApi } from "../hooks/useApi";
import type { RespuestaCitas } from "../types/citas";
import {
  agruparCitasPorDia,
  obtenerRangoUltimosDias,
} from "../utils/citasPorDia";
import { GraficaCard } from "./GraficaCard";

export function GraficaCitasPorDia() {
  // El rango se calcula una sola vez para que la URL sea estable y
  // useApi no repita la consulta en cada render.
  const rango = useMemo(() => obtenerRangoUltimosDias(7), []);

  // GET /citas/?desde=...&hasta=... (roles RECEPCIONISTA y MEDICO)
  const url = useMemo(
    () =>
      `/citas/?desde=${encodeURIComponent(rango.desde.toISOString())}` +
      `&hasta=${encodeURIComponent(rango.hasta.toISOString())}`,
    [rango],
  );

  const { data, cargando, error, recargar } = useApi<RespuestaCitas>(url);

  const datos = useMemo(
    () => agruparCitasPorDia(data?.data ?? [], rango),
    [data, rango],
  );

  const sinCitas = datos.every((dia) => dia.total === 0);

  return (
    <GraficaCard
      titulo="Citas por día"
      descripcion="Citas de los últimos 7 días, incluido hoy (todos los estados)."
      cargando={cargando}
      error={error}
      vacio={sinCitas}
      mensajeVacio="No hay citas en los últimos 7 días."
      onReintentar={recargar}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={datos} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="etiqueta" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="total"
            name="Citas"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GraficaCard>
  );
}
