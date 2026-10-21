import { Link } from "react-router";
import type { Paciente } from "../types/paciente";

interface PacienteCardProps {
  paciente: Paciente;
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
}

export function PacienteCard({
  paciente,
  onEditar,
  onEliminar,
}: PacienteCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {paciente.nombre} {paciente.apellido}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {paciente.especialidadAsignada}
        </p>
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
