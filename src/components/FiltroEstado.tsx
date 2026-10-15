import type { ChangeEvent } from 'react';
import type { FiltroEstado as FiltroEstadoValor } from '../types/paciente';
import { ESTADOS_PACIENTE, etiquetasPorEstado } from '../types/estados';

interface FiltroEstadoProps {
  value: FiltroEstadoValor;
  onChange: (value: FiltroEstadoValor) => void;
}

export function FiltroEstado({ value, onChange }: FiltroEstadoProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as FiltroEstadoValor);
  };

  return (
    <div className="w-full sm:w-48">
      <label
        htmlFor="filtro-estado"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Estado
      </label>

      <select
        id="filtro-estado"
        value={value}
        onChange={handleChange}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="Todos">Todos</option>
        {ESTADOS_PACIENTE.map((estado) => (
          <option key={estado} value={estado}>
            {etiquetasPorEstado[estado]}
          </option>
        ))}
      </select>
    </div>
  );
}
