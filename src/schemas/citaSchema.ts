import { z } from 'zod';
import { esFechaReal, obtenerFechaHoy } from '../utils/fecha';

export const URGENCIAS = ['baja', 'media', 'alta', 'critica'] as const;

export type UrgenciaCita = (typeof URGENCIAS)[number];

export const citaSchema = z.object({
  pacienteNombre: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),

  medicoId: z.string().min(1, 'Selecciona un médico'),

  fecha: z
    .string()
    .min(1, 'La fecha es obligatoria')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
    .refine(esFechaReal, 'La fecha no es válida')
    .refine((valor: string) => valor >= obtenerFechaHoy(), 'La fecha no puede ser pasada'),

  hora: z
    .string()
    .min(1, 'La hora es obligatoria')
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:MM (00:00 a 23:59)'),

  motivo: z
    .string()
    .trim()
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede superar los 500 caracteres'),

  urgencia: z.enum(URGENCIAS),
});

export type CitaFormData = z.infer<typeof citaSchema>;