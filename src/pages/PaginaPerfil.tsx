import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InputFotoPerfil } from "../components/InputFotoPerfil";
import { extraerMensajeError } from "../lib/errorHandler";
import { perfilSchema, type PerfilFormData } from "../schemas/perfilSchema";
import { actualizarPerfil } from "../services/auth";
import { useAuthStore } from "../store/authStore";

const claseInput = "w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export function PaginaPerfil() {
  const usuario = useAuthStore((state) => state.usuario);
  const actualizarUsuario = useAuthStore((state) => state.actualizarUsuario);
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      email: usuario?.email ?? "",
      telefono: usuario?.telefono ?? "",
    },
  });

  const onSubmit = async (datos: PerfilFormData) => {
    const formData = new FormData();
    formData.append("nombre", datos.nombre);
    formData.append("email", datos.email);
    if (datos.telefono) formData.append("telefono", datos.telefono);
    if (archivoFoto) formData.append("foto", archivoFoto);

    try {
      const usuarioActualizado = await actualizarPerfil(formData);
      actualizarUsuario(usuarioActualizado);
      setArchivoFoto(null);
      toast.success("Perfil actualizado");
    } catch (err: unknown) {
      toast.error(extraerMensajeError(err));
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl p-4 sm:p-8">
      <header className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Cuenta</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Mi perfil</h1>
        <p className="mt-2 text-slate-600">Actualizá tus datos personales y tu foto de perfil.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <InputFotoPerfil fotoActual={usuario?.foto} onChange={setArchivoFoto} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-slate-700">Nombre</label>
            <input id="nombre" autoComplete="name" aria-invalid={Boolean(errors.nombre)} className={claseInput} {...register("nombre")} />
            {errors.nombre && <p role="alert" className="mt-1 text-sm text-red-700">{errors.nombre.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
            <input id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} className={claseInput} {...register("email")} />
            {errors.email && <p role="alert" className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="telefono" className="mb-2 block text-sm font-medium text-slate-700">Teléfono <span className="font-normal text-slate-400">(opcional)</span></label>
            <input id="telefono" type="tel" autoComplete="tel" inputMode="numeric" placeholder="099123456" aria-invalid={Boolean(errors.telefono)} className={claseInput} {...register("telefono")} />
            {errors.telefono && <p role="alert" className="mt-1 text-sm text-red-700">{errors.telefono.message}</p>}
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}
