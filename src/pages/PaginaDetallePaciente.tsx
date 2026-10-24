import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PaginaNotFound } from "./PaginaNotFound";
import { obtenerExpedientePaciente } from "../services/pacientes";
import type { PacienteExpedienteApi } from "../types/paciente";
import { extraerMensajeError } from "../lib/errorHandler";

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

function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-UY", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<PacienteExpedienteApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarExpediente = useCallback(async () => {
    if (!id || !/^\d+$/.test(id)) {
      setPaciente(null);
      setError("El identificador del paciente no es válido.");
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const datos = await obtenerExpedientePaciente(id);
      setPaciente(datos);
    } catch (err: unknown) {
      setPaciente(null);
      setError(extraerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    void cargarExpediente();
  }, [cargarExpediente]);

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-sm">
          <p role="status" className="text-slate-600">
            Cargando expediente del paciente...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-rose-200 bg-white p-6">
          <h1 className="text-xl font-bold text-slate-900">
            No se pudo cargar el expediente
          </h1>
          <p role="alert" className="mt-2 text-rose-700">
            {error}
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => void cargarExpediente()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            >
              Volver
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!paciente) {
    return <PaginaNotFound />;
  }

  const ultimaCita = paciente.citas[0];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          ← Volver
        </button>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <header className="mb-6 border-b border-slate-200 pb-6">
            <p className="text-sm font-medium text-blue-600">
              Expediente del paciente
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {paciente.nombre} {paciente.apellido}
            </h1>

            <p className="mt-2 text-sm text-slate-500">CI: {paciente.CI}</p>
          </header>

          <section aria-label="Datos del paciente">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Datos personales
            </h2>

            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DatoDetalle etiqueta="Email" valor={paciente.email} />
              <DatoDetalle etiqueta="Teléfono" valor={paciente.telefono} />
              <DatoDetalle
                etiqueta="Fecha de nacimiento"
                valor={formatearFecha(paciente.fecha_nacimiento)}
              />
              <DatoDetalle etiqueta="Dirección" valor={paciente.direccion} />
            </dl>
          </section>

          <section
            aria-label="Última cita"
            className="mt-8 border-t border-slate-200 pt-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Última cita
            </h2>

            {ultimaCita ? (
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <DatoDetalle
                  etiqueta="Fecha y hora"
                  valor={formatearFecha(ultimaCita.fecha_hora)}
                />
                <DatoDetalle etiqueta="Estado" valor={ultimaCita.estado} />
                <DatoDetalle
                  etiqueta="Médico"
                  valor={`${ultimaCita.medico.nombre} ${ultimaCita.medico.apellido}`}
                />
                <DatoDetalle
                  etiqueta="Especialidad"
                  valor={ultimaCita.medico.especialidad.nombre}
                />
              </dl>
            ) : (
              <p className="text-sm text-slate-500">
                Este paciente todavía no tiene citas registradas.
              </p>
            )}
          </section>

          <section
            aria-label="Historial de citas"
            className="mt-8 border-t border-slate-200 pt-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Historial de citas
            </h2>

            {paciente.citas.length > 0 ? (
              <ul className="space-y-4">
                {paciente.citas.map((cita) => (
                  <li
                    key={cita.id_cita}
                    className="rounded-lg border border-slate-200 p-4"
                  >
                    <p className="font-medium text-slate-900">
                      {formatearFecha(cita.fecha_hora)}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Dr./Dra. {cita.medico.nombre} {cita.medico.apellido}
                    </p>
                    <p className="text-sm text-slate-600">
                      {cita.medico.especialidad.nombre}
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-700">
                      Estado: {cita.estado}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                No hay citas en el historial de este paciente.
              </p>
            )}
          </section>
        </article>
      </div>
    </main>
  );
}
