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
    
    const timer = setTimeout(() => {
      setMedicos(MEDICOS);
      setCargando(false);
    }, 800);

    
    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}