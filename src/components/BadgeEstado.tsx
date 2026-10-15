import type { EstadoPaciente } from "../types/paciente";
import { etiquetasPorEstado } from "../types/estados";

interface BadgeEstadoProps {
  estado: EstadoPaciente;
}

const estilosPorEstado: Record<EstadoPaciente, string> = {
  activo: "bg-emerald-100 text-emerald-800",
  inactivo: "bg-rose-100 text-rose-800",
  en_espera: "bg-amber-100 text-amber-800",
};

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${estilosPorEstado[estado]}`}
    >
      {etiquetasPorEstado[estado]}
    </span>
  );
}
