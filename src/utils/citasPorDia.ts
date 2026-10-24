import type { Cita } from "../types/citas";
import type { CitasPorDia } from "../types/reportes";


export interface RangoDias {
  desde: Date; // 00:00 local del primer día
  hasta: Date; // 00:00 local del día siguiente
  claves: string[]; // YYYY-MM-DD de cada día, del más antiguo al más reciente
}

function claveLocal(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

export function obtenerRangoUltimosDias(
  dias: number = 7,
  ahora: Date = new Date(),
): RangoDias {
  const desde = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - (dias - 1));
  const hasta = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1);

  const claves: string[] = [];

  for (let i = 0; i < dias; i += 1) {
    claves.push(
      claveLocal(new Date(desde.getFullYear(), desde.getMonth(), desde.getDate() + i)),
    );
  }

  return { desde, hasta, claves };
}

function etiquetaDia(clave: string): string {
  const [anio, mes, dia] = clave.split("-").map(Number);

  return new Intl.DateTimeFormat("es-UY", {
    weekday: "short",
    day: "2-digit",
  }).format(new Date(anio, mes - 1, dia));
}

export function agruparCitasPorDia(
  citas: ReadonlyArray<Pick<Cita, "id_cita" | "fecha_hora">>,
  rango: RangoDias,
): CitasPorDia[] {
  const totales = new Map<string, number>(rango.claves.map((clave) => [clave, 0]));
  const vistas = new Set<number>();

  for (const cita of citas) {
    if (vistas.has(cita.id_cita)) continue;
    vistas.add(cita.id_cita);

    const fecha = new Date(cita.fecha_hora);

    if (Number.isNaN(fecha.getTime())) continue;

    const clave = claveLocal(fecha);
    const actual = totales.get(clave);

    if (actual !== undefined) {
      totales.set(clave, actual + 1);
    }
  }

  return rango.claves.map((clave) => ({
    fecha: clave,
    etiqueta: etiquetaDia(clave),
    total: totales.get(clave) ?? 0,
  }));
}
