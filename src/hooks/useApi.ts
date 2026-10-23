import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { extraerMensajeError } from "../lib/errorHandler";

interface UseApiResultado<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

export function useApi<T>(url: string): UseApiResultado<T> {
  const [data, setData] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const recargar = useCallback(() => {
    setVersion((actual) => actual + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function cargarDatos() {
      setCargando(true);
      setError(null);

      try {
        const response = await api.get<T>(url, {
          signal: controller.signal,
        });

        setData(response.data);
      } catch (err: unknown) {
        if (controller.signal.aborted) return;

        setError(extraerMensajeError(err));
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    }

    void cargarDatos();

    return () => {
      controller.abort();
    };
  }, [url, version]);

  return { data, cargando, error, recargar };
}
