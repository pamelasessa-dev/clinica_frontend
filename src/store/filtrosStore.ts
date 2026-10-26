import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EstadoCita } from "../types/citas";
import type { FiltroEstado } from "../types/paciente";

type EstadoCitaFiltro = EstadoCita | "Todos";

interface FiltrosState {
  queryPacientes: string;
  estadoPacienteFiltro: FiltroEstado;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCitaFiltro;

  setQueryPacientes: (query: string) => void;
  setEstadoPaciente: (estado: FiltroEstado) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCitaFiltro) => void;
  resetFiltros: () => void;
}

const filtrosIniciales = {
  queryPacientes: "",
  estadoPacienteFiltro: "Todos" as FiltroEstado,
  especialidadFiltro: "Todas",
  estadoCitaFiltro: "Todos" as EstadoCitaFiltro,
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...filtrosIniciales,

      setQueryPacientes: (query) => {
        set({ queryPacientes: query }, false, "setQueryPacientes");
      },

      setEstadoPaciente: (estado) => {
        set({ estadoPacienteFiltro: estado }, false, "setEstadoPaciente");
      },

      setEspecialidad: (especialidad) => {
        set({ especialidadFiltro: especialidad }, false, "setEspecialidad");
      },

      setEstadoCita: (estado) => {
        set({ estadoCitaFiltro: estado }, false, "setEstadoCita");
      },

      resetFiltros: () => {
        set({ ...filtrosIniciales }, false, "resetFiltros");
      },
    }),
    { name: "FiltrosStore" },
  ),
);
