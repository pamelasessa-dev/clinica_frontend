import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  Paciente,
  PacienteApi,
} from "../types/paciente";
import type { CrearPacienteDTO, ActualizarPacienteDTO } from "../types/dtos";
import { extraerMensajeError } from "../lib/errorHandler";

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
  actualizar: (id: string, datos: ActualizarPacienteDTO) => Promise<void>;
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
    estado: p.estado,
    fecha_nacimiento: p.fecha_nacimiento,
    direccion: p.direccion,
    especialidadAsignada: "Sin asignar",
    ultimaCita: "No disponible",
  };
}

// Petición de búsqueda en curso. Al lanzar otra se cancela la anterior para
// que una respuesta lenta no pise a la más reciente.
let cargaEnCurso: AbortController | null = null;

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        cargaEnCurso?.abort();

        const controlador = new AbortController();
        cargaEnCurso = controlador;

        set({ cargando: true, error: null }, false, "cargar/inicio");

        try {
          const datos = await obtenerPacientes(query, controlador.signal);

          if (controlador.signal.aborted) return;

          set({ pacientes: datos.map(adaptarPaciente) }, false, "cargar/exito");
        } catch (err: unknown) {
          if (controlador.signal.aborted) return;

          set({ error: extraerMensajeError(err) }, false, "cargar/error");
        } finally {
          // Solo la petición vigente apaga el indicador de carga; una
          // petición cancelada no debe apagarlo mientras otra sigue en curso.
          if (cargaEnCurso === controlador) {
            cargaEnCurso = null;
            set({ cargando: false }, false, "cargar/fin");
          }
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
