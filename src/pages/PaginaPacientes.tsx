import { useState } from 'react';
import type {
  EstadoPaciente,
  FiltroEstado as FiltroEstadoValor,
  NuevoPaciente,
  Paciente,
} from '../types/paciente';
import { PacienteCard } from '../components/PacienteCard';
import { BuscadorPacientes } from '../components/BuscadorPacientes';
import { FiltroEstado } from '../components/FiltroEstado';
import { FormularioPaciente } from '../components/FormularioPaciente';


const pacientesIniciales: Paciente[] = [
  {
    id: '1',
    nombre: 'Ana',
    apellido: 'García',
    email: 'ana.garcia@ejemplo.com',
    telefono: '099 123 456',
    especialidadAsignada: 'Cardiología',
    ultimaCita: '2026-10-05',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    email: 'carlos.rodriguez@ejemplo.com',
    telefono: '098 234 567',
    especialidadAsignada: 'Dermatología',
    ultimaCita: '2026-09-28',
    estado: 'en_espera',
  },
  {
    id: '3',
    nombre: 'Lucía',
    apellido: 'Fernández',
    email: 'lucia.fernandez@ejemplo.com',
    telefono: '097 345 678',
    especialidadAsignada: 'Pediatría',
    ultimaCita: '2026-10-01',
    estado: 'activo',
  },
  {
    id: '4',
    nombre: 'Martín',
    apellido: 'Pérez',
    email: 'martin.perez@ejemplo.com',
    telefono: '096 456 789',
    especialidadAsignada: 'Neurología',
    ultimaCita: '2026-08-15',
    estado: 'inactivo',
  },
  {
    id: '5',
    nombre: 'Sofía',
    apellido: 'López',
    email: 'sofia.lopez@ejemplo.com',
    telefono: '095 567 890',
    especialidadAsignada: 'Cardiología',
    ultimaCita: '2026-10-10',
    estado: 'en_espera',
  },
];

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstadoValor>('Todos');

  // Se calcula en cada render: los filtros nunca modifican `pacientes`
  const termino = busqueda.trim().toLowerCase();

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const coincideBusqueda =
      paciente.nombre.toLowerCase().includes(termino) ||
      paciente.apellido.toLowerCase().includes(termino) ||
      paciente.email.toLowerCase().includes(termino);

    const coincideEstado =
      estadoFiltro === 'Todos' || paciente.estado === estadoFiltro;

    // El paciente debe cumplir ambas condiciones a la vez
    return coincideBusqueda && coincideEstado;
  });

  const hayFiltrosActivos = busqueda !== '' || estadoFiltro !== 'Todos';

  const limpiarFiltros = () => {
    setBusqueda('');
    setEstadoFiltro('Todos');
  };

  const agregarPaciente = (datos: NuevoPaciente) => {
    const nuevo: Paciente = {
      id: crypto.randomUUID(),
      ...datos,
      // El formulario no pide estos campos todavía
      telefono: 'Sin registrar',
      especialidadAsignada: 'Sin asignar',
      ultimaCita: 'Sin citas',
    };

    setPacientes((prev) => [...prev, nuevo]);
  };

  const cambiarEstado = (id: string, estado: EstadoPaciente) => {
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado } : p)),
    );
  };

  const eliminarPaciente = (id: string) => {
    const paciente = pacientes.find((p) => p.id === id);
    if (!paciente) return;

    const confirmado = window.confirm(
      `¿Eliminar a ${paciente.nombre} ${paciente.apellido}?`,
    );
    if (!confirmado) return;

    setPacientes((prev) => prev.filter((p) => p.id !== id));
  };

return (
  <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">
          Gestión clínica
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Pacientes
        </h1>

        <p className="mt-2 text-slate-600">
          Consulta y administra la información de tus pacientes.
        </p>
      </header>

      <section
        aria-label="Agregar paciente"
        className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Agregar paciente
        </h2>

        <FormularioPaciente onAgregar={agregarPaciente} />
      </section>

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <BuscadorPacientes
            value={busqueda}
            onChange={setBusqueda}
          />

          <FiltroEstado
            value={estadoFiltro}
            onChange={setEstadoFiltro}
          />

          <button
            type="button"
            onClick={limpiarFiltros}
            disabled={!hayFiltrosActivos}
            className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Limpiar filtros
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-500" aria-live="polite">
          {pacientesFiltrados.length}{' '}
          {pacientesFiltrados.length === 1
            ? 'paciente encontrado'
            : 'pacientes encontrados'}
        </p>
      </section>

      {pacientesFiltrados.length > 0 ? (
        <section
          aria-label="Lista de pacientes"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {pacientesFiltrados.map((paciente) => (
            <PacienteCard
              key={paciente.id}
              paciente={paciente}
              onCambiarEstado={cambiarEstado}
              onEliminar={eliminarPaciente}
            />
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No se encontraron pacientes
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {pacientes.length === 0
              ? 'Aún no hay pacientes registrados. Agrega el primero con el formulario.'
              : 'Prueba con otro nombre, apellido, email o estado.'}
          </p>

          {pacientes.length > 0 && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  </main>
);
}