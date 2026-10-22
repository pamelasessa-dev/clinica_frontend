import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { citaSchema, URGENCIAS } from "../schemas/citaSchema";
import type { CitaFormData, UrgenciaCita } from "../schemas/citaSchema";

import { useMedicos } from "../hooks/useMedicos";
import { usePacientesStore } from "../store/pacientesStore";
import { useCitasStore } from "../store/citasStore";
import { obtenerFechaHoy } from "../utils/fecha";

const etiquetasUrgencia: Record<UrgenciaCita, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  critica: "Crítica",
};

const valoresIniciales: CitaFormData = {
  pacienteCI: "",
  medicoId: "",
  fecha: "",
  hora: "",
  motivo: "",
  urgencia: "media",
};

const claseBase =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4";

const claseCampo = (hayError: boolean) =>
  `${claseBase} ${
    hayError
      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-100"
      : "border-slate-300 focus:border-blue-500 focus:ring-blue-100"
  }`;

interface CampoProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Campo({ id, label, error, children }: CampoProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface FormularioCitaProps {
  onCancelar: () => void;
}

export function FormularioCita({ onCancelar }: FormularioCitaProps) {
  const pacientes = usePacientesStore((state) => state.pacientes);
  const cargandoPacientes = usePacientesStore((state) => state.cargando);
  const errorPacientes = usePacientesStore((state) => state.error);
  const cargarPacientes = usePacientesStore((state) => state.cargar);

  const agregarCita = useCitasStore((state) => state.agregarCita);

  const {
    medicos,
    cargando: cargandoMedicos,
    error: errorMedicos,
  } = useMedicos();

  const [citaConfirmada, setCitaConfirmada] = useState<CitaFormData | null>(
    null,
  );
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  useEffect(() => {
    if (pacientes.length === 0) {
      void cargarPacientes();
    }
  }, [pacientes.length, cargarPacientes]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: valoresIniciales,
  });

  const onSubmit = async (datos: CitaFormData) => {
    setErrorEnvio(null);

    try {
      await agregarCita({
        fecha_hora: `${datos.fecha}T${datos.hora}:00`,
        CI_paciente: Number(datos.pacienteCI),
        id_medico: Number(datos.medicoId),
      });

      setCitaConfirmada(datos);
    } catch (error) {
      setErrorEnvio(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la cita. Inténtalo nuevamente.",
      );
    }
  };

  const agendarOtra = () => {
    reset(valoresIniciales);
    setCitaConfirmada(null);
    setErrorEnvio(null);
  };

  if (citaConfirmada) {
    const paciente = pacientes.find(
      (item) => item.id === citaConfirmada.pacienteCI,
    );

    const medico = medicos.find(
      (item) => String(item.id_medico) === citaConfirmada.medicoId,
    );

    return (
      <section
        role="status"
        className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700"
          >
            ✓
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            ¡Cita guardada correctamente!
          </h2>
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Paciente</dt>
            <dd className="mt-0.5 text-slate-900">
              {paciente
                ? `${paciente.nombre} ${paciente.apellido}`
                : `CI: ${citaConfirmada.pacienteCI}`}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-slate-500">Médico</dt>
            <dd className="mt-0.5 text-slate-900">
              {medico
                ? `${medico.nombre} ${medico.apellido} · ${medico.especialidad.nombre}`
                : "Sin datos"}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-slate-500">Fecha</dt>
            <dd className="mt-0.5 text-slate-900">{citaConfirmada.fecha}</dd>
          </div>

          <div>
            <dt className="font-medium text-slate-500">Hora</dt>
            <dd className="mt-0.5 text-slate-900">{citaConfirmada.hora}</dd>
          </div>

          <div>
            <dt className="font-medium text-slate-500">Urgencia</dt>
            <dd className="mt-0.5 text-slate-900">
              {etiquetasUrgencia[citaConfirmada.urgencia]}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="font-medium text-slate-500">Motivo</dt>
            <dd className="mt-0.5 text-slate-900">{citaConfirmada.motivo}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={agendarOtra}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Agendar otra cita
        </button>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6"
    >
      <Campo
        id="pacienteCI"
        label="Paciente"
        error={errors.pacienteCI?.message}
      >
        <select
          id="pacienteCI"
          aria-invalid={Boolean(errors.pacienteCI)}
          className={claseCampo(Boolean(errors.pacienteCI))}
          {...register("pacienteCI")}
        >
          <option value="">
            {cargandoPacientes
              ? "Cargando pacientes..."
              : "Selecciona un paciente"}
          </option>

          {pacientes.map((paciente) => (
            <option key={paciente.id} value={paciente.id}>
              {paciente.nombre} {paciente.apellido} — CI: {paciente.id}
            </option>
          ))}
        </select>

        {errorPacientes && (
          <p role="alert" className="mt-1.5 text-xs text-rose-600">
            Error al cargar pacientes: {errorPacientes}
          </p>
        )}
      </Campo>

      <Campo id="medicoId" label="Médico" error={errors.medicoId?.message}>
        <select
          id="medicoId"
          aria-invalid={Boolean(errors.medicoId)}
          className={claseCampo(Boolean(errors.medicoId))}
          {...register("medicoId")}
        >
          <option value="">
            {cargandoMedicos ? "Cargando médicos..." : "Selecciona un médico"}
          </option>

          {medicos.map((medico) => (
            <option key={medico.id_medico} value={String(medico.id_medico)}>
              {medico.nombre} {medico.apellido} — {medico.especialidad.nombre}
            </option>
          ))}
        </select>

        {errorMedicos && (
          <p role="alert" className="mt-1.5 text-xs text-rose-600">
            Error al cargar médicos: {errorMedicos}
          </p>
        )}
      </Campo>

      <Campo id="fecha" label="Fecha" error={errors.fecha?.message}>
        <input
          id="fecha"
          type="date"
          min={obtenerFechaHoy()}
          aria-invalid={Boolean(errors.fecha)}
          className={claseCampo(Boolean(errors.fecha))}
          {...register("fecha")}
        />
      </Campo>

      <Campo id="hora" label="Hora" error={errors.hora?.message}>
        <input
          id="hora"
          type="time"
          aria-invalid={Boolean(errors.hora)}
          className={claseCampo(Boolean(errors.hora))}
          {...register("hora")}
        />
      </Campo>

      <Campo id="urgencia" label="Urgencia" error={errors.urgencia?.message}>
        <select
          id="urgencia"
          aria-invalid={Boolean(errors.urgencia)}
          className={claseCampo(Boolean(errors.urgencia))}
          {...register("urgencia")}
        >
          {URGENCIAS.map((urgencia) => (
            <option key={urgencia} value={urgencia}>
              {etiquetasUrgencia[urgencia]}
            </option>
          ))}
        </select>
      </Campo>

      <div className="sm:col-span-2">
        <Campo
          id="motivo"
          label="Motivo de la consulta"
          error={errors.motivo?.message}
        >
          <textarea
            id="motivo"
            rows={4}
            placeholder="Describe brevemente el motivo (mínimo 10 caracteres)"
            aria-invalid={Boolean(errors.motivo)}
            className={claseCampo(Boolean(errors.motivo))}
            {...register("motivo")}
          />
        </Campo>
      </div>

      {errorEnvio && (
        <p
          role="alert"
          className="sm:col-span-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
        >
          No se pudo guardar la cita: {errorEnvio}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            cargandoPacientes ||
            cargandoMedicos ||
            Boolean(errorPacientes) ||
            Boolean(errorMedicos) ||
            pacientes.length === 0 ||
            medicos.length === 0
          }
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isSubmitting ? "Guardando cita..." : "Agendar cita"}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          disabled={isSubmitting}
          className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
