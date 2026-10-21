
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { CrearPacienteDTO } from '../types/paciente';

interface FormularioPacienteProps {
  onAgregar: (paciente: CrearPacienteDTO) => Promise<void>;
}

interface ErroresFormulario {
  CI?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  telefono?: string;
}

const formularioInicial = {
  CI: '',
  nombre: '',
  apellido: '',
  email: '',
  fecha_nacimiento: '',
  direccion: '',
  telefono: '',
};

const claseInput =
  'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

const claseLabel = 'mb-1.5 block text-sm font-medium text-slate-700';

export function FormularioPaciente({ onAgregar }: FormularioPacienteProps) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [guardando, setGuardando] = useState(false);
  const [errorServidor, setErrorServidor] = useState('');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormulario((prev) => ({ ...prev, [name]: value }));

    setErrores((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setErrorServidor('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nuevosErrores: ErroresFormulario = {};

    if (!formulario.CI.trim() || !/^\d+$/.test(formulario.CI)) {
      nuevosErrores.CI = 'Ingresa un CI numérico válido';
    }

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formulario.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es obligatorio';
    }

    if (
      !formulario.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)
    ) {
      nuevosErrores.email = 'Ingresa un email válido';
    }

    if (!formulario.fecha_nacimiento) {
      nuevosErrores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (formulario.fecha_nacimiento > new Date().toISOString().slice(0, 10)) {
      nuevosErrores.fecha_nacimiento = 'La fecha no puede ser futura';
    }

    if (!formulario.direccion.trim()) {
      nuevosErrores.direccion = 'La dirección es obligatoria';
    }

    if (!formulario.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio';
    }

    if (Object.values(nuevosErrores).some(Boolean)) {
      setErrores(nuevosErrores);
      return;
    }

    setGuardando(true);
    setErrorServidor('');

    try {
      await onAgregar({
        CI: Number(formulario.CI),
        nombre: formulario.nombre.trim(),
        apellido: formulario.apellido.trim(),
        email: formulario.email.trim(),
        fecha_nacimiento: formulario.fecha_nacimiento,
        direccion: formulario.direccion.trim(),
        telefono: formulario.telefono.trim(),
      });

      setFormulario(formularioInicial);
      setErrores({});
    } catch (error) {
      setErrorServidor(
        error instanceof Error
          ? error.message
          : 'No se pudo registrar el paciente.',
      );
    } finally {
      setGuardando(false);
    }
  };

  const campo = (
    nombre: keyof typeof formulario,
    etiqueta: string,
    tipo: string = 'text',
  ) => (
    <div key={nombre}>
      <label htmlFor={`nuevo-${nombre}`} className={claseLabel}>
        {etiqueta} <span className="text-rose-500">*</span>
      </label>
      <input
        id={`nuevo-${nombre}`}
        name={nombre}
        type={tipo}
        value={formulario[nombre]}
        onChange={handleChange}
        required
        disabled={guardando}
        max={tipo === 'date' ? new Date().toISOString().slice(0, 10) : undefined}
        aria-invalid={Boolean(errores[nombre])}
        aria-describedby={errores[nombre] ? `error-${nombre}` : undefined}
        className={claseInput}
      />
      {errores[nombre] && (
        <p id={`error-${nombre}`} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
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
      {campo('CI', 'CI', 'number')}
      {campo('nombre', 'Nombre')}
      {campo('apellido', 'Apellido')}
      {campo('email', 'Email', 'email')}
      {campo('fecha_nacimiento', 'Fecha de nacimiento', 'date')}
      {campo('telefono', 'Teléfono', 'tel')}
      <div className="sm:col-span-2 lg:col-span-3">
        {campo('direccion', 'Dirección')}
      </div>

      {errorServidor && (
        <p role="alert" className="sm:col-span-2 lg:col-span-3 text-sm text-rose-700">
          {errorServidor}
        </p>
      )}

      <div className="flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-3">
        <p className="text-xs text-slate-500">
          <span className="text-rose-500">*</span> Todos los campos son obligatorios.
        </p>

        <button
          type="submit"
          disabled={guardando}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {guardando ? 'Guardando...' : 'Registrar paciente'}
        </button>
      </div>
    </form>
  );
}
