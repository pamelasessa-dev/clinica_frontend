import { useEffect, useState } from "react";
import type { Medico } from "../types/medico";
import { obtenerMedicos } from "../services/medicos";

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
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar los médicos",
          );
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
