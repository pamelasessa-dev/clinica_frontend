type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  titulo?: string;
  accion?: { label: string; onClick: () => void };
}

const estilos: Record<TipoAlerta, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  exito: "border-emerald-200 bg-emerald-50 text-emerald-900",
  advertencia: "border-amber-200 bg-amber-50 text-amber-950",
  error: "border-rose-200 bg-rose-50 text-rose-900",
};

export function AlertaBanner({ tipo, mensaje, titulo, accion }: AlertaBannerProps) {
  return (
    <div role={tipo === "error" ? "alert" : "status"} className={`rounded-xl border p-4 ${estilos[tipo]}`}>
      {titulo && <p className="font-semibold">{titulo}</p>}
      <p className={titulo ? "mt-1 text-sm" : "text-sm"}>{mensaje}</p>
      {accion && <button type="button" onClick={accion.onClick} className="mt-3 text-sm font-semibold underline underline-offset-2">{accion.label}</button>}
    </div>
  );
}
