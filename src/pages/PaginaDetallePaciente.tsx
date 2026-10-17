import { useNavigate, useParams } from 'react-router';
import { PaginaNotFound } from './PaginaNotFound';
import { PACIENTES_INICIALES } from '../data/pacientes';
import { BadgeEstado } from '../components/BadgeEstado';

interface DatoDetalleProps {
  etiqueta: string;
  valor: string;
}

function DatoDetalle({ etiqueta, valor }: DatoDetalleProps) {
  return (
    <div>
      <dt className="text-sm font-medium text-slate-500">{etiqueta}</dt>
      <dd className="mt-1 text-slate-900">{valor}</dd>
    </div>
  );
}

export function PaginaDetallePaciente() {
  // useParams devuelve el segmento dinámico de la URL (/pacientes/:id) como string
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const paciente = PACIENTES_INICIALES.find((p) => p.id === id);

  if (!paciente) {
    return <PaginaNotFound />;
  }

  const iniciales = (
    paciente.nombre.charAt(0) + paciente.apellido.charAt(0)
  ).toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Volver
        </button>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700"
            >
              {iniciales}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {paciente.nombre} {paciente.apellido}
              </h1>
              <p className="mt-1 text-slate-500">
                {paciente.especialidadAsignada}
              </p>
            </div>

            <BadgeEstado estado={paciente.estado} />
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <DatoDetalle etiqueta="Email" valor={paciente.email} />
            <DatoDetalle etiqueta="Teléfono" valor={paciente.telefono} />
            <DatoDetalle
              etiqueta="Especialidad asignada"
              valor={paciente.especialidadAsignada}
            />
            <DatoDetalle etiqueta="Última cita" valor={paciente.ultimaCita} />
            <DatoDetalle etiqueta="ID de paciente" valor={paciente.id} />
          </dl>
        </article>
      </div>
    </main>
  );
}