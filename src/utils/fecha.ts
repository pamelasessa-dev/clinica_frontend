
// Fecha de hoy en formato YYYY-MM-DD usando la hora LOCAL del usuario.
// toISOString() usa UTC y, de noche, puede devolver el día siguiente.
export function obtenerFechaHoy(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');

  return `${anio}-${mes}-${dia}`;
}

// Verifica que el string YYYY-MM-DD sea un día que existe (rechaza 2026-02-31)
export function esFechaReal(valor: string): boolean {
  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);

  return (
    fecha.getFullYear() === anio &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === dia
  );
}
