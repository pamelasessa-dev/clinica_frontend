
import { useState } from 'react';
import type { Paciente } from '../types/paciente';
import { PacienteCard } from '../components/PacienteCard';
import { BuscadorPacientes } from '../components/BuscadorPacientes';


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
  const [busqueda, setBusqueda] = useState('');
  
  const pacientesFiltrados = pacientesIniciales.filter((paciente) => {
  const termino = busqueda.trim().toLowerCase();

  return (
    paciente.nombre.toLowerCase().includes(termino) ||
    paciente.apellido.toLowerCase().includes(termino) ||
    paciente.email.toLowerCase().includes(termino)
  );
});

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

      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <BuscadorPacientes
          value={busqueda}
          onChange={setBusqueda}
        />

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
            />
          ))}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No se encontraron pacientes
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Prueba con otro nombre, apellido o email.
          </p>

          <button
            type="button"
            onClick={() => setBusqueda('')}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}
    </div>
  </main>
);
}