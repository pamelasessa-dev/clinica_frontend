import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { SkeletonCitaRow } from "../components/SkeletonCitaRow";
import { AlertaBanner, EstadoVacio } from "../shared/components/ui";
import { extraerMensajeError } from "../lib/errorHandler";
import { obtenerCitasPagina } from "../services/citas";
import type { RespuestaPaginada } from "../types/api";
import type { Cita, EstadoFiltroCita } from "../types/citas";

const estados: EstadoFiltroCita[] = ["Todos", "PROGRAMADA", "COMPLETADA", "CANCELADA"];
const etiquetas: Record<EstadoFiltroCita, string> = {
  Todos: "Todos los estados",
  PROGRAMADA: "Programada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
};

function esEstadoFiltro(valor: string | null): valor is EstadoFiltroCita {
  return estados.some((estado) => estado === valor);
}

export function PaginaHistorialCitas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paginaParam = Number(searchParams.get("pagina"));
  const pagina = Number.isInteger(paginaParam) && paginaParam > 0 ? paginaParam : 1;
  const estadoParam = searchParams.get("estado");
  const estado: EstadoFiltroCita = esEstadoFiltro(estadoParam) ? estadoParam : "Todos";
  const [respuesta, setRespuesta] = useState<RespuestaPaginada<Cita> | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);

    obtenerCitasPagina(pagina, estado, controller.signal)
      .then(setRespuesta)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) setError(extraerMensajeError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false);
      });

    return () => controller.abort();
  }, [pagina, estado]);

  const cambiarEstado = (nuevoEstado: EstadoFiltroCita) => {
    setSearchParams({ pagina: "1", estado: nuevoEstado });
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setSearchParams({ pagina: String(nuevaPagina), estado });
  };

  const totalPaginas = respuesta?.totalPaginas ?? 0;

  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-8">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Atención clínica</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Historial de citas</h1>
          <p className="mt-2 text-slate-600">Consulta y filtra las citas registradas.</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          Estado
          <select
            value={estado}
            onChange={(event) => cambiarEstado(event.target.value as EstadoFiltroCita)}
            className="mt-1 block min-w-52 rounded-lg border border-slate-300 bg-white px-3 py-2.5"
          >
            {estados.map((opcion) => <option key={opcion} value={opcion}>{etiquetas[opcion]}</option>)}
          </select>
        </label>
      </header>

      <section aria-label="Lista de citas" aria-busy={cargando} className="space-y-3">
        {cargando && Array.from({ length: 10 }, (_, index) => <SkeletonCitaRow key={index} />)}

        {!cargando && error && <AlertaBanner tipo="error" mensaje={error} />}

        {!cargando && !error && respuesta?.data.length === 0 && <EstadoVacio titulo="No hay citas para mostrar" descripcion="Prueba con otro estado o vuelve más tarde." />}

        {!cargando && !error && respuesta?.data.map((cita) => (
          <article key={cita.id_cita} className="flex min-h-[76px] flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50">📅</span>
            <div className="min-w-48 flex-1">
              <h2 className="font-semibold text-slate-900">{cita.paciente.nombre} {cita.paciente.apellido}</h2>
              <p className="text-sm text-slate-500">CI {cita.paciente.CI}</p>
            </div>
            <div className="min-w-44 text-sm text-slate-600">
              <p>{new Intl.DateTimeFormat("es-UY", { dateStyle: "medium" }).format(new Date(cita.fecha_hora))}</p>
              <p>{new Intl.DateTimeFormat("es-UY", { timeStyle: "short" }).format(new Date(cita.fecha_hora))} · Dr/a. {cita.medico.nombre} {cita.medico.apellido}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{etiquetas[cita.estado]}</span>
          </article>
        ))}
      </section>

      {!cargando && !error && respuesta && (
        <nav aria-label="Paginación de citas" className="mt-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Página {pagina} de {totalPaginas} — {respuesta.total} registros</p>
          <div className="flex gap-2">
            <button type="button" disabled={pagina <= 1} onClick={() => cambiarPagina(pagina - 1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">← Anterior</button>
            <button type="button" disabled={pagina >= totalPaginas} onClick={() => cambiarPagina(pagina + 1)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">Siguiente →</button>
          </div>
        </nav>
      )}
    </main>
  );
}
