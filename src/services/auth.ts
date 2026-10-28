import { api } from "../lib/axios";
import type { LoginFormData } from "../schemas/loginSchema";

export interface LoginResponse {
  token: string;

  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    telefono?: string;
    foto?: string;
  };
}

export type Usuario = LoginResponse["usuario"];

type PerfilResponse = Usuario | { usuario: Usuario };

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);
  return data;
}

export async function actualizarPerfil(formData: FormData): Promise<Usuario> {
  const { data } = await api.put<PerfilResponse>("/auth/perfil", formData);
  return "usuario" in data ? data.usuario : data;
}
