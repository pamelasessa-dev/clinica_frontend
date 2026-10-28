import { useEffect, useRef, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";

interface InputFotoPerfilProps {
  fotoActual?: string;
  onChange: (archivo: File | null) => void;
}

const TAMANO_MAXIMO = 5 * 1024 * 1024;

export function InputFotoPerfil({ fotoActual, onChange }: InputFotoPerfilProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const handleSeleccion = (event: ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen");
      event.target.value = "";
      return;
    }
    if (archivo.size > TAMANO_MAXIMO) {
      toast.error("La imagen no puede superar los 5MB");
      event.target.value = "";
      return;
    }

    setPreview(URL.createObjectURL(archivo));
    onChange(archivo);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Seleccionar foto de perfil"
        className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-teal-50 shadow-lg ring-1 ring-slate-200"
      >
        {preview || fotoActual ? (
          <img src={preview ?? fotoActual} alt="Foto de perfil" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-4xl font-semibold text-teal-700" aria-hidden="true">👤</span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-slate-900/65 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">Cambiar foto</span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleSeleccion} />
      <p className="text-xs text-slate-500">Imagen JPG, PNG o similar. Máximo 5MB.</p>
    </div>
  );
}
