import { useEffect } from "react";
import type { EstadoFiltroCita } from "../../../types/citas";
import { useCitasStore } from "../../../store/citasStore";

interface OpcionesUseCitas {
  pacienteId?: string;
  pagina?: number;
  estado?: EstadoFiltroCita;
}

export function useCitas(opciones: OpcionesUseCitas = {}) {
  const { pacienteId, pagina, estado = "Todos" } = opciones;
  const citas = useCitasStore((s) => s.citas);
  const citaSeleccionada = useCitasStore((s) => s.citaSeleccionada);
  const cargando = useCitasStore((s) => s.cargando);
  const error = useCitasStore((s) => s.error);
  const respuestaPaginada = useCitasStore((s) => s.respuestaPaginada);
  const cargarPorPaciente = useCitasStore((s) => s.cargarPorPaciente);
  const cargarPagina = useCitasStore((s) => s.cargarPagina);
  const seleccionar = useCitasStore((s) => s.seleccionar);
  const actualizarEstado = useCitasStore((s) => s.actualizarEstado);
  const agregarCita = useCitasStore((s) => s.agregarCita);

  useEffect(() => {
    if (pacienteId !== undefined) {
      void cargarPorPaciente(pacienteId);
    } else if (pagina !== undefined) {
      void cargarPagina(pagina, estado);
    }
  }, [pacienteId, pagina, estado, cargarPorPaciente, cargarPagina]);

  return {
    citas,
    citaSeleccionada,
    respuestaPaginada,
    cargando,
    error,
    cargarPorPaciente,
    cargarPagina,
    seleccionar,
    actualizarEstado,
    agregarCita,
  };
}
