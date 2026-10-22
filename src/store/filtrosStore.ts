import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { EstadoCita } from "../types/citas";

type EstadoCitaFiltro = EstadoCita | "Todos";

interface FiltrosState {
  queryPacientes: string;
  especialidadFiltro: string;
  estadoCitaFiltro: EstadoCitaFiltro;

  setQueryPacientes: (query: string) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCitaFiltro) => void;
  resetFiltros: () => void;
}

const filtrosIniciales = {
  queryPacientes: "",
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
