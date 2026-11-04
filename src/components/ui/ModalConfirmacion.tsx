interface ModalConfirmacionProps {
  abierto: boolean;
  titulo: string;
  mensaje: string;
  cargando?: boolean;
  etiquetaConfirmar?: string;
  mensajeCargando?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  cargando = false,
  etiquetaConfirmar = "Sí, continuar",
  mensajeCargando = "Procesando...",
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !cargando) onCancelar();
    }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="modal-confirmacion-titulo" aria-describedby="modal-confirmacion-mensaje" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="modal-confirmacion-titulo" className="text-lg font-bold text-slate-900">{titulo}</h2>
        <p id="modal-confirmacion-mensaje" className="mt-3 text-sm text-slate-600">{mensaje}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" disabled={cargando} onClick={onCancelar} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50">Cancelar</button>
          <button type="button" disabled={cargando} onClick={onConfirmar} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{cargando ? mensajeCargando : etiquetaConfirmar}</button>
        </div>
      </section>
    </div>
  );
}
