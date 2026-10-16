import { useEffect, useState } from 'react';
import type { Medico } from '../types/medico';
import { MEDICOS } from '../data/medicos';

interface UseMedicosResultado {
  medicos: Medico[];
  cargando: boolean;
}

export function useMedicos(): UseMedicosResultado {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simula una petición al backend con 800 ms de demora
    const timer = setTimeout(() => {
      setMedicos(MEDICOS);
      setCargando(false);
    }, 800);

    // Cleanup: si el componente se desmonta antes, se cancela el timer
    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
