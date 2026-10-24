import { api } from "../lib/axios";

interface CredencialesLogin {
  email: string;
  password: string;
}

interface RespuestaLogin {
  token: string;
}

export async function iniciarSesion(
  credenciales: CredencialesLogin,
): Promise<void> {
  const response = await api.post<RespuestaLogin>("/auth/login", credenciales);

  localStorage.setItem("token", response.data.token);
}

export function cerrarSesion(): void {
  localStorage.removeItem("token");
}
