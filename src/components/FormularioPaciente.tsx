import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { CrearPacienteDTO, Paciente } from "../types/paciente";
import { extraerMensajeError } from "../lib/errorHandler";
import { obtenerFechaHoy } from "../utils/fecha";

interface FormularioPacienteProps {
  pacienteInicial?: Paciente | null;
  onGuardar: (datos: CrearPacienteDTO) => Promise<void>;
  onCancelar?: () => void;
}

type FormularioValores = {
  CI: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
};

type CampoFormulario = keyof FormularioValores;

type ErroresFormulario = Partial<Record<CampoFormulario, string>>;

const formularioInicial: FormularioValores = {
  CI: "",
  nombre: "",
  apellido: "",
  email: "",
  fecha_nacimiento: "",
  direccion: "",
  telefono: "",
};

const claseInput =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

const claseLabel = "mb-1.5 block text-sm font-medium text-slate-700";

export function FormularioPaciente({
  pacienteInicial = null,
  onGuardar,
  onCancelar,
}: FormularioPacienteProps) {
  const [formulario, setFormulario] =
    useState<FormularioValores>(formularioInicial);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  const editando = pacienteInicial !== null;

  useEffect(() => {
    if (!pacienteInicial) {
      setFormulario(formularioInicial);
      return;
    }

    setFormulario({
      CI: pacienteInicial.id,
      nombre: pacienteInicial.nombre,
      apellido: pacienteInicial.apellido,
      email: pacienteInicial.email,
      fecha_nacimiento: pacienteInicial.fecha_nacimiento,
      direccion: pacienteInicial.direccion,
      telefono: pacienteInicial.telefono,
    });

    setErrores({});
    setErrorServidor("");
  }, [pacienteInicial]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormulario((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
    setErrorServidor("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nuevosErrores: ErroresFormulario = {};

    if (!formulario.CI.trim() || !/^\d+$/.test(formulario.CI)) {
      nuevosErrores.CI = "Ingresa un CI numérico válido";
    }

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (!formulario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio";
    }

    if (
      !formulario.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)
    ) {
      nuevosErrores.email = "Ingresa un email válido";
    }

    if (!formulario.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = "La fecha de nacimiento es obligatoria";
    } else if (formulario.fecha_nacimiento > obtenerFechaHoy()) {
      nuevosErrores.fecha_nacimiento = "La fecha no puede ser futura";
    }

    if (!formulario.direccion.trim()) {
      nuevosErrores.direccion = "La dirección es obligatoria";
    }

    if (!formulario.telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    }

    if (Object.values(nuevosErrores).some(Boolean)) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    setErrorServidor("");

    try {
      await onGuardar({
        CI: Number(formulario.CI),
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        email: formulario.email.trim(),
        fecha_nacimiento: formulario.fecha_nacimiento,
        direccion: formulario.direccion.trim(),
        telefono: formulario.telefono.trim(),
      });

      if (!editando) {
        setFormulario(formularioInicial);
      }

      setErrores({});
    } catch (err) {
      const mensaje = extraerMensajeError(err);
      setErrorServidor(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const campo = (nombre: CampoFormulario, etiqueta: string, tipo = "text") => (
    <div key={nombre}>
      <label htmlFor={`paciente-${nombre}`} className={claseLabel}>
        {etiqueta} <span className="text-rose-500">*</span>
      </label>

      <input
        id={`paciente-${nombre}`}
        name={nombre}
        type={tipo}
        value={formulario[nombre]}
        onChange={handleChange}
        required
        disabled={guardando || (editando && nombre === "CI")}
        max={tipo === "date" ? obtenerFechaHoy() : undefined}
        aria-invalid={Boolean(errores[nombre])}
        aria-describedby={errores[nombre] ? `error-${nombre}` : undefined}
        className={claseInput}
      />

      {errores[nombre] && (
        <p
          id={`error-${nombre}`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-rose-600"
        >
          {errores[nombre]}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {campo("CI", "CI", "number")}
      {campo("nombre", "Nombre")}
      {campo("apellido", "Apellido")}
      {campo("email", "Email", "email")}
      {campo("fecha_nacimiento", "Fecha de nacimiento", "date")}
      {campo("telefono", "Teléfono", "tel")}

      <div className="sm:col-span-2 lg:col-span-3">
        {campo("direccion", "Dirección")}
      </div>

      {errorServidor && (
        <p
          role="alert"
          className="text-sm text-rose-700 sm:col-span-2 lg:col-span-3"
        >
          {errorServidor}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2 lg:col-span-3">
        <p className="text-xs text-slate-500">
          <span className="text-rose-500">*</span> Todos los campos son
          obligatorios.
        </p>

        <div className="flex gap-2">
          {onCancelar && (
            <button
              type="button"
              disabled={guardando}
              onClick={onCancelar}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={guardando}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando
              ? "Guardando..."
              : editando
                ? "Guardar cambios"
                : "Registrar paciente"}
          </button>
        </div>
      </div>
    </form>
  );
}
