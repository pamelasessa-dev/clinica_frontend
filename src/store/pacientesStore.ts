import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Paciente,
  PacienteApi,
  CrearPacienteDTO,
} from "../types/paciente";

import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente as eliminarPacienteAPI,
} from "../services/pacientes";

// Estado y acciones del store.
interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;

  cargar: (query?: string) => Promise<void>;
  crear: (datos: CrearPacienteDTO) => Promise<void>;
  actualizar: (
    id: string,
    datos: Omit<CrearPacienteDTO, "CI">,
  ) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
}

// Adaptamos la respuesta de la API al formato de la aplicación.
function adaptarPaciente(p: PacienteApi): Paciente {
  return {
    id: String(p.CI),
    nombre: p.nombre,
    apellido: p.apellido,
    email: p.email,
    telefono: p.telefono,
    fecha_nacimiento: p.fecha_nacimiento,
    direccion: p.direccion,
    especialidadAsignada: "Sin asignar",
    ultimaCita: "No disponible",
  };
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set({ cargando: true, error: null }, false, "cargar/inicio");

        try {
          const datos = await obtenerPacientes(query);

          set({ pacientes: datos.map(adaptarPaciente) }, false, "cargar/exito");
        } catch (err) {
          set(
            {
              error:
                err instanceof Error
                  ? err.message
                  : "No se pudieron cargar los pacientes",
            },
            false,
            "cargar/error",
          );
        } finally {
          set({ cargando: false }, false, "cargar/fin");
        }
      },

      crear: async (datos) => {
        const creado = await crearPaciente(datos);

        set(
          (state) => ({
            pacientes: [...state.pacientes, adaptarPaciente(creado)],
          }),
          false,
          "crear",
        );
      },

      actualizar: async (id, datos) => {
        const actualizado = await actualizarPaciente(id, datos);

        set(
          (state) => ({
            pacientes: state.pacientes.map((paciente) =>
              paciente.id === id ? adaptarPaciente(actualizado) : paciente,
            ),
          }),
          false,
          "actualizar",
        );
      },

      eliminar: async (id) => {
        await eliminarPacienteAPI(id);

        set(
          (state) => ({
            pacientes: state.pacientes.filter((paciente) => paciente.id !== id),
          }),
          false,
          "eliminar",
        );
      },
    }),
    { name: "PacientesStore" },
  ),
);
