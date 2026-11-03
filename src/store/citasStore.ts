import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Cita, EstadoCita, EstadoFiltroCita } from "../types/citas";
import type { RespuestaPaginada } from "../types/api";
import type { CrearCitaDTO } from "../types/dtos";
import { extraerMensajeError } from "../lib/errorHandler";
import {
  obtenerCitasPorPaciente,
  obtenerCitasPagina,
  crearCita,
  actualizarEstadoCita,
} from "../services/citas";

type EstadoActualizable = Exclude<EstadoCita, "PROGRAMADA">;

interface CitasState {
  citas: Cita[];
  citaSeleccionada: Cita | null;
  cargando: boolean;
  error: string | null;
  respuestaPaginada: RespuestaPaginada<Cita> | null;

  cargarPorPaciente: (id: string) => Promise<void>;
  cargarPagina: (pagina: number, estado: EstadoFiltroCita) => Promise<void>;
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
      error: null,
      respuestaPaginada: null,

      cargarPorPaciente: async (id) => {
        set({ cargando: true, error: null }, false, "cargarPorPaciente/inicio");

        try {
          const citas = await obtenerCitasPorPaciente(Number(id));
          set({ citas }, false, "cargarPorPaciente/exito");
        } finally {
          set({ cargando: false }, false, "cargarPorPaciente/fin");
        }
      },

      cargarPagina: async (pagina, estado) => {
        set({ cargando: true, error: null }, false, "cargarPagina/inicio");

        try {
          const respuesta = await obtenerCitasPagina(pagina, estado);
          set({ respuestaPaginada: respuesta }, false, "cargarPagina/exito");
        } catch (err: unknown) {
          set({ error: extraerMensajeError(err) }, false, "cargarPagina/error");
        } finally {
          set({ cargando: false }, false, "cargarPagina/fin");
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
