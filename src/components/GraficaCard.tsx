import type { ReactNode } from "react";

interface GraficaCardProps {
  titulo: string;
  descripcion: string;
  cargando: boolean;
  error: string | null;
  vacio: boolean;
  mensajeVacio: string;
  onReintentar: () => void;
  children: ReactNode;
}

function EsqueletoGrafica() {
  return (
    <div
      role="status"
      aria-label="Cargando gráfica"
      className="flex h-72 animate-pulse items-end gap-3 rounded-lg bg-slate-50 p-4"
    >
      {["h-1/3", "h-2/3", "h-1/2", "h-5/6", "h-2/5", "h-3/5", "h-1/4"].map(
        (altura) => (
          <div key={altura} className={`flex-1 rounded-t bg-slate-200 ${altura}`} />
        ),
      )}
    </div>
  );
}

export function GraficaCard({
  titulo,
  descripcion,
  cargando,
  error,
  vacio,
  mensajeVacio,
  onReintentar,
  children,
}: GraficaCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
        <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
      </header>

      {cargando ? (
        <EsqueletoGrafica />
      ) : error ? (
        <div
          role="alert"
          className="flex h-72 flex-col items-center justify-center rounded-lg border border-rose-200 px-4 text-center"
        >
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={onReintentar}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      ) : vacio ? (
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 px-4 text-center">
          <p className="text-sm text-slate-500">{mensajeVacio}</p>
        </div>
      ) : (
        <div className="h-72 w-full">{children}</div>
      )}
    </section>
  );
}
