import { useEffect, useState } from "react";
import type { Medico } from "../types/medico";
import { obtenerMedicos } from "../services/medicos";
import { extraerMensajeError } from "../lib/errorHandler";

interface UseMedicosResultado {
  medicos: Medico[];
  cargando: boolean;
  error: string | null;
}

export function useMedicos(): UseMedicosResultado {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarMedicos() {
      try {
        const datos = await obtenerMedicos();

        if (activo) {
          setMedicos(datos);
        }
      } catch (err: unknown) {
        if (activo) {
          setError(extraerMensajeError(err));
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarMedicos();

    return () => {
      activo = false;
    };
  }, []);

  return { medicos, cargando, error };
}
