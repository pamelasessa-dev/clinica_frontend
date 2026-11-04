import { useCallback, useEffect, useState } from "react";
import { obtenerExpedientePaciente } from "../../../services/pacientes";
import { extraerMensajeError } from "../../../lib/errorHandler";
import type { PacienteExpedienteApi } from "../../../types/paciente";

export function useExpedientePaciente(id?: string) {
  const [paciente, setPaciente] = useState<PacienteExpedienteApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarExpediente = useCallback(async () => {
    if (!id || !/^\d+$/.test(id)) {
      setPaciente(null);
      setError("El identificador del paciente no es válido.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      setPaciente(await obtenerExpedientePaciente(id));
    } catch (err: unknown) {
      setPaciente(null);
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    void cargarExpediente();
  }, [cargarExpediente]);

  return { paciente, cargando, error, recargar: cargarExpediente };
}
