import { Link } from 'react-router';
import type { ChangeEvent } from "react";
import type { EstadoPaciente } from "../types/paciente";
import type { Paciente } from "../types/paciente";
import { ESTADOS_PACIENTE, etiquetasPorEstado } from "../constants/estados";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
  onEliminar: (id: string) => void;
}

export function PacienteCard({
  paciente,
  onCambiarEstado,
  onEliminar,
}: PacienteCardProps) {
  const handleCambioEstado = (event: ChangeEvent<HTMLSelectElement>) => {
    onCambiarEstado(paciente.id, event.target.value as EstadoPaciente);
  };
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {paciente.nombre} {paciente.apellido}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {paciente.especialidadAsignada}
          </p>
        </div>

        <BadgeEstado estado={paciente.estado} />
      </div>

      <div className="flex flex-col gap-2 text-sm text-slate-600">
        <p>
          <span className="font-medium text-slate-800">Email:</span>{" "}
          {paciente.email}
        </p>

        <p>
          <span className="font-medium text-slate-800">Teléfono:</span>{" "}
          {paciente.telefono}
        </p>

        <p>
          <span className="font-medium text-slate-800">Última cita:</span>{" "}
          {paciente.ultimaCita}
        </p>
      </div>

      <Link
        to={`/pacientes/${paciente.id}`}
        className="inline-flex items-center gap-1 self-start text-sm font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Ver detalle <span aria-hidden="true">→</span>
      </Link>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium text-slate-800">Estado:</span>
          <select
            value={paciente.estado}
            onChange={handleCambioEstado}
            aria-label={`Cambiar estado de ${paciente.nombre} ${paciente.apellido}`}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {ESTADOS_PACIENTE.map((estado) => (
              <option key={estado} value={estado}>
                {etiquetasPorEstado[estado]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => onEliminar(paciente.id)}
          className="rounded-lg border border-rose-200 px-3 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}