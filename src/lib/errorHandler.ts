import axios from "axios";

const MENSAJE_POR_DEFECTO =
  "Ocurrió un error inesperado. Inténtalo nuevamente.";
const MENSAJE_SIN_CONEXION =
  "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.";
const MENSAJE_TIMEOUT =
  "El servidor tardó demasiado en responder. Inténtalo de nuevo.";

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

// Acepta un texto o un array de textos y devuelve un único mensaje (o null).
function aTexto(valor: unknown): string | null {
  if (typeof valor === "string") {
    const texto = valor.trim();
    return texto === "" ? null : texto;
  }

  if (Array.isArray(valor)) {
    const textos = valor
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    return textos.length > 0 ? textos.join(". ") : null;
  }

  return null;
}

// El backend responde { message } en la mayoría de los casos y { error }
// en el controlador de citas. Se comprueba el tipo antes de leer cada campo.
function mensajeDelBackend(data: unknown): string | null {
  if (typeof data === "string") return aTexto(data);
  if (Array.isArray(data)) return aTexto(data);
  if (!esRegistro(data)) return null;

  return (
    aTexto(data.message) ??
    aTexto(data.error) ??
    aTexto(data.detail) ??
    aTexto(data.errors)
  );
}

export function extraerMensajeError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const mensaje = mensajeDelBackend(err.response?.data);

    if (mensaje) return mensaje;

    if (err.code === "ECONNABORTED" || err.code === "ETIMEDOUT") {
      return MENSAJE_TIMEOUT;
    }

    if (!err.response) return MENSAJE_SIN_CONEXION;

    if (err.response.status === 404) {
      return "No se encontró el recurso solicitado. Verifica que el endpoint de perfil esté disponible en el servidor.";
    }

    return `El servidor respondió con un error (HTTP ${err.response.status}).`;
  }

  if (err instanceof Error && err.message.trim() !== "") {
    return err.message;
  }

  return MENSAJE_POR_DEFECTO;
}
