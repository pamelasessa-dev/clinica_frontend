
interface BuscadorPacientesProps {
  value: string;
  onChange: (value: string) => void;
}

export function BuscadorPacientes({
  value,
  onChange,
}: BuscadorPacientesProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="busqueda-pacientes"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Buscar pacientes
      </label>

      <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5 shrink-0 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>

        <input
          id="busqueda-pacientes"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nombre, apellido o email..."
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
