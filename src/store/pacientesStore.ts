
import { create } from 'zustand';
import type {
  Paciente,
  PacienteApi,
  CrearPacienteDTO,
} from '../types/paciente';

import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente as eliminarPacienteAPI,
} from '../services/pacientes';

// Defino el estado y las acciones del store.
interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string;

  cargarPacientes: () => Promise<void>;
  agregarPaciente: (datos: CrearPacienteDTO) => Promise<void>;
  editarPaciente: (
    id: string,
    datos: Omit<CrearPacienteDTO, 'CI'>,
  ) => Promise<void>;
  eliminarPaciente: (id: string) => Promise<void>;
}

// Convierto los datos de la API al formato de mi aplicación.
function adaptarPaciente(p: PacienteApi): Paciente {
  return {
    id: String(p.CI),
    nombre: p.nombre,
    apellido: p.apellido,
    email: p.email,
    telefono: p.telefono,
    fecha_nacimiento: p.fecha_nacimiento,
    direccion: p.direccion,
    especialidadAsignada: 'Sin asignar',
    ultimaCita: 'No disponible',
  };
}

// Creo el store de Zustand.
export const usePacientesStore = create<PacientesState>()((set) => ({
  // Estado inicial.
  pacientes: [],
  cargando: false,
  error: '',

  // Obtengo los pacientes del backend.
  cargarPacientes: async () => {
    set({ cargando: true, error: '' });

    try {
      const datos = await obtenerPacientes();

      set({
        pacientes: datos.map(adaptarPaciente),
      });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los pacientes',
      });
    } finally {
      set({ cargando: false });
    }
  },

  // Creo un paciente y actualizo el estado.
  agregarPaciente: async (datos) => {
    const creado = await crearPaciente(datos);

    set((state) => ({
      pacientes: [...state.pacientes, adaptarPaciente(creado)],
    }));
  },

  // Actualizo un paciente existente.
  editarPaciente: async (id, datos) => {
    const actualizado = await actualizarPaciente(id, datos);

    set((state) => ({
      pacientes: state.pacientes.map((paciente) =>
        paciente.id === id
          ? adaptarPaciente(actualizado)
          : paciente,
      ),
    }));
  },

  // Elimino un paciente y lo quito del estado.
  eliminarPaciente: async (id) => {
    await eliminarPacienteAPI(id);

    set((state) => ({
      pacientes: state.pacientes.filter(
        (paciente) => paciente.id !== id,
      ),
    }));
  },
}));
