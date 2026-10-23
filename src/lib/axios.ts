import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const requestUrl = error.config?.url ?? "";

      const isLoginRequest = requestUrl.includes("/auth/login");

      if (status === 401 && !isLoginRequest) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
