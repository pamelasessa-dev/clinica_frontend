import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { extraerMensajeError } from "../lib/errorHandler";
import { login } from "../services/auth";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../shared/components/ui";

const claseInput =
  "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export function PaginaLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (datos: LoginFormData) => {
    try {
      const respuesta = await login(datos);
      if (!respuesta.token) {
        throw new Error("El servidor no devolvió un token de acceso.");
      }
      setAuth(respuesta.token, respuesta.usuario);
      toast.success("¡Bienvenido!");
      navigate("/", { replace: true });
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <>
    {isSubmitting && <Spinner fullscreen label="Iniciando sesión" />}
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-2xl font-bold text-white">
            +
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Clínica Salud Integral
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresá a tu cuenta para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="nombre@clinica.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={claseInput}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-700">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Ingresá tu contraseña"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={claseInput}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-sm text-red-700">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <span className="inline-flex items-center gap-2"><Spinner />Ingresando...</span> : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Acceso exclusivo para personal autorizado.
        </p>
      </section>
    </main>
    </>
  );
}
