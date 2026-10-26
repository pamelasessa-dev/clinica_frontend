import { Link } from "react-router";
import type { EstadoPaciente, Paciente } from "../types/paciente";
import { ESTADOS_PACIENTE, etiquetasPorEstado } from "../constants/estados";
import { BadgeEstado } from "./BadgeEstado";

interface PacienteCardProps {
  paciente: Paciente;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, estado: EstadoPaciente) => void;
}

export function PacienteCard({
  paciente,
  onEditar,
  onEliminar,
  onCambiarEstado,
}: PacienteCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {paciente.nombre} {paciente.apellido}
        </h2>
        <div className="mt-2">
          <BadgeEstado estado={paciente.estado} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {paciente.especialidadAsignada}
        </p>
      </div>

      <label className="text-sm font-medium text-slate-700">
        Cambiar estado
        <select
          value={paciente.estado}
          onChange={(event) =>
            onCambiarEstado(
              paciente.id,
              event.target.value as EstadoPaciente,
            )
          }
          className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {ESTADOS_PACIENTE.map((estado) => (
            <option key={estado} value={estado}>
              {etiquetasPorEstado[estado]}
            </option>
          ))}
        </select>
      </label>

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
        className="self-start text-sm font-semibold text-blue-700 hover:text-blue-800"
      >
        Ver detalle →
      </Link>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEditar(paciente.id)}
          className="rounded-lg border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onEliminar(paciente.id)}
          className="rounded-lg border border-rose-200 px-3 py-1 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
