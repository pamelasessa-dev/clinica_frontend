
import { useState } from 'react';
import MetricCard from '../components/MetricCard';
import StatusBadge from '../components/StatusBadge';
import type { Metrica } from '../types';

export default function PaginaDashboard() {
  const [pacientes, setPacientes] = useState(128); 
  const [mantenimiento, setMantenimiento] = useState(false);

  const metricas: Metrica[] = [
    {
      id: 'pacientes',
      titulo: 'Pacientes',
      valor: pacientes,
      descripcion: 'Pacientes registrados',
      tendencia: 'positiva',
      icono: '👥',
    },
    {
      id: 'citas',
      titulo: 'Citas Hoy',
      valor: 24,
      descripcion: 'Agenda del día',
      tendencia: 'positiva',
      icono: '📅',
    },
    {
      id: 'pendientes',
      titulo: 'Consultas Pendientes',
      valor: 8,
      descripcion: 'Requieren atención',
      tendencia: 'negativa',
      icono: '📋',
    },
    {
      id: 'disponibilidad',
      titulo: 'Disponibilidad',
      valor: '92%',
      descripcion: 'Capacidad disponible',
      tendencia: 'neutra',
      icono: '📊',
    },
  ];

  const incrementarPacientes = () => {
    setPacientes((prev) => prev + 1);
  };

  const decrementarPacientes = () => {
    setPacientes((prev) => Math.max(0, prev - 1));
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7x1">
      {mantenimiento && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-rose-100 p-4 font-medium text-rose-800"
        >
          El sistema está en modo mantenimiento.
        </div>
      )}

      <header className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">ç
        <div>
    <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
      Clínica Salud Integral
    </p>

    <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
      Dashboard
    </h1>

    <p className="mt-2 text-sm text-slate-500 sm:text-base">
      Resumen general de la clínica
    </p>
  </div>

  <StatusBadge activo={!mantenimiento} />
      </header>

      <section aria-label="Métricas de la clínica">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-800">
            Indicadores principales
          </h2>

          <button
            type="button"
            onClick={() => setMantenimiento((prev) => !prev)}
            aria-pressed={mantenimiento}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            {mantenimiento
              ? 'Desactivar mantenimiento'
              : 'Activar mantenimiento'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {metricas.map((metrica) => (
            <div key={metrica.id}>
              <MetricCard metrica={metrica} />

              {metrica.id === 'pacientes' && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={decrementarPacientes}
                    aria-label="Disminuir pacientes"
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
                  >-
                  </button>

                  <button
                    type="button"
                    onClick={incrementarPacientes}
                    aria-label="Incrementar pacientes"
                    className="flex-1 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
                  >+
                    
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      </div>
    </main>
  );
}
