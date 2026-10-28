import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginResponse } from "../services/auth";

type UsuarioAuth = NonNullable<LoginResponse["usuario"]>;

interface AuthState {
  token: string | null;
  usuario: UsuarioAuth | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: UsuarioAuth | null) => void;
  actualizarUsuario: (usuario: UsuarioAuth) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      login: (token, usuario) =>
        set({ 
          token, 
          usuario, 
          isAuthenticated: true 
        
        }),

      actualizarUsuario: (usuario) => set({ usuario }),

      logout: () => 
        set({ 
          token: null, 
          usuario: null, 
          isAuthenticated: false 
        }),
    }),

    { 
      name: "auth-storage" 
    },
  ),
);
