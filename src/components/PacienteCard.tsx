
import type { Paciente } from '../types/paciente';
import { BadgeEstado } from './BadgeEstado';

interface PacienteCardProps {
  paciente: Paciente;
}

export function PacienteCard({ paciente }: PacienteCardProps) {
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
          <span className="font-medium text-slate-800">Email:</span>{' '}
          {paciente.email}
        </p>

        <p>
          <span className="font-medium text-slate-800">Teléfono:</span>{' '}
          {paciente.telefono}
        </p>

        <p>
          <span className="font-medium text-slate-800">Última cita:</span>{' '}
          {paciente.ultimaCita}
        </p>
      </div>
    </article>
  );
}
