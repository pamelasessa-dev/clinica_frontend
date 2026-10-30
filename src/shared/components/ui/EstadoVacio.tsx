interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: { label: string; onClick: () => void };
}

export function EstadoVacio({ titulo, descripcion, accion }: EstadoVacioProps) {
  return (
    <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
      {descripcion && <p className="mt-2 text-sm text-slate-500">{descripcion}</p>}
      {accion && <button type="button" onClick={accion.onClick} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{accion.label}</button>}
    </section>
  );
}
