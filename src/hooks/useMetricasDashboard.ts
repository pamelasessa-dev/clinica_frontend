import { useCallback, useEffect, useState } from "react";
import { obtenerMetricasDashboard, type MetricasDashboard } from "../services/dashboard";
import { extraerMensajeError } from "../lib/errorHandler";

export function useMetricasDashboard() {
  const [datos, setDatos] = useState<MetricasDashboard | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarMetricas = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      setDatos(await obtenerMetricasDashboard());
    } catch (err: unknown) {
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarMetricas();
  }, [cargarMetricas]);

  return { datos, cargando, error, recargar: cargarMetricas };
}
