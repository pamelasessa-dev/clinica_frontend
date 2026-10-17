import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import type { EstadoPaciente, NuevoPaciente } from '../types/paciente';
import { ESTADOS_PACIENTE, etiquetasPorEstado } from '../constants/estados';

interface FormularioPacienteProps {
  onAgregar: (paciente: NuevoPaciente) => void;
}

interface ErroresFormulario {
  nombre?: string;
  email?: string;
}

const formularioInicial: NuevoPaciente = {
  nombre: '',
  apellido: '',
  email: '',
  estado: 'activo',
};

const claseInput =
  'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4';

const claseLabel = 'mb-1.5 block text-sm font-medium text-slate-700';

export function FormularioPaciente({ onAgregar }: FormularioPacienteProps) {
  // Controlled inputs: React es la única fuente de verdad de cada campo
  const [formulario, setFormulario] = useState<NuevoPaciente>(formularioInicial);
  const [errores, setErrores] = useState<ErroresFormulario>({});

  // Un solo handler para los inputs de texto y el select, usando el atributo name
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: name === 'estado' ? (value as EstadoPaciente) : value,
    }));

    // Al corregir un campo con error, se quita su mensaje
    if (name === 'nombre' || name === 'email') {
      setErrores((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nuevosErrores: ErroresFormulario = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }

    if (!formulario.email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    }

    if (nuevosErrores.nombre || nuevosErrores.email) {
      setErrores(nuevosErrores);
      return;
    }

    onAgregar({
      ...formulario,
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      email: formulario.email.trim(),
    });

    // Se limpia el formulario después de agregar
    setFormulario(formularioInicial);
    setErrores({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <div>
        <label
          htmlFor="nuevo-nombre"
          className={claseLabel}
        >
          Nombre <span className="text-rose-500">*</span>
        </label>
        <input
          id="nuevo-nombre"
          name="nombre"
          type="text"
          value={formulario.nombre}
          onChange={handleChange}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={errores.nombre ? 'error-nombre' : undefined}
          className={`${claseInput} ${
            errores.nombre
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
          }`}
        />
        {errores.nombre && (
          <p id="error-nombre" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
            {errores.nombre}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="nuevo-apellido"
          className={claseLabel}
        >
          Apellido
        </label>
        <input
          id="nuevo-apellido"
          name="apellido"
          type="text"
          value={formulario.apellido}
          onChange={handleChange}
          className={`${claseInput} border-slate-300 focus:border-blue-500 focus:ring-blue-100`}
        />
      </div>

      <div>
        <label
          htmlFor="nuevo-email"
          className={claseLabel}
        >
          Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="nuevo-email"
          name="email"
          type="email"
          value={formulario.email}
          onChange={handleChange}
          aria-invalid={Boolean(errores.email)}
          aria-describedby={errores.email ? 'error-email' : undefined}
          className={`${claseInput} ${
            errores.email
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
          }`}
        />
        {errores.email && (
          <p id="error-email" role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
            {errores.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="nuevo-estado"
          className={claseLabel}
        >
          Estado
        </label>
        <select
          id="nuevo-estado"
          name="estado"
          value={formulario.estado}
          onChange={handleChange}
          className={`${claseInput} border-slate-300 focus:border-blue-500 focus:ring-blue-100`}
        >
          {ESTADOS_PACIENTE.map((estado) => (
            <option key={estado} value={estado}>
              {etiquetasPorEstado[estado]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between gap-3 sm:col-span-2 lg:col-span-4">
        <p className="text-xs text-slate-500">
          <span className="text-rose-500">*</span> Campos obligatorios
        </p>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="size-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Agregar paciente
        </button>
      </div>
    </form>
  );
}
