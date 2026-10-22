import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Cita, EstadoCita, CrearCitaDTO } from "../types/citas";
import {
  obtenerCitasPorPaciente,
  crearCita,
  actualizarEstadoCita,
} from "../services/citas";

type EstadoActualizable = Exclude<EstadoCita, "PROGRAMADA">;

interface CitasState {
  citas: Cita[];
  citaSeleccionada: Cita | null;
  cargando: boolean;

  cargarPorPaciente: (id: string) => Promise<void>;
  seleccionar: (id: number) => void;
  actualizarEstado: (id: number, estado: EstadoActualizable) => Promise<void>;
  agregarCita: (datos: CrearCitaDTO) => Promise<void>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,

      cargarPorPaciente: async (id) => {
        set({ cargando: true }, false, "cargarPorPaciente/inicio");

        try {
          const citas = await obtenerCitasPorPaciente(Number(id));
          set({ citas }, false, "cargarPorPaciente/exito");
        } finally {
          set({ cargando: false }, false, "cargarPorPaciente/fin");
        }
      },

      seleccionar: (id) => {
        const cita = get().citas.find((item) => item.id_cita === id);

        set({ citaSeleccionada: cita ?? null }, false, "seleccionar");
      },

      actualizarEstado: async (id, estado) => {
        await actualizarEstadoCita(id, estado);

        set(
          (state) => {
            const citasActualizadas = state.citas.map((cita) =>
              cita.id_cita === id ? { ...cita, estado } : cita,
            );

            const citaSeleccionada =
              state.citaSeleccionada?.id_cita === id
                ? { ...state.citaSeleccionada, estado }
                : state.citaSeleccionada;

            return {
              citas: citasActualizadas,
              citaSeleccionada,
            };
          },
          false,
          "actualizarEstado",
        );
      },

      agregarCita: async (datos) => {
        const cita = await crearCita(datos);

        set(
          (state) => ({ citas: [...state.citas, cita] }),
          false,
          "agregarCita",
        );
      },
    }),
    { name: "CitasStore" },
  ),
);
