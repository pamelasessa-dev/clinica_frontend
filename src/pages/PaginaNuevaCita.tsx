import { useNavigate } from "react-router";
import { FormularioCita } from "../components/FormularioCita";

export function PaginaNuevaCita() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">Gestión clínica</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Agendar nueva cita
          </h1>

          <p className="mt-2 text-slate-600">
            Completa los datos para programar una cita médica.
          </p>
        </header>

        <FormularioCita onCancelar={() => navigate(-1)} />
      </div>
    </main>
  );
}
