import { useCallback, useEffect, useState } from "react";
import type {
  FiltroEstado as FiltroEstadoValor,
  Paciente,
  PacienteApi,
  CrearPacienteDTO,
} from "../types/paciente";
import { PacienteCard } from "../components/PacienteCard";
import { BuscadorPacientes } from "../components/BuscadorPacientes";
import { FormularioPaciente } from "../components/FormularioPaciente";
import { 
  crearPaciente,
  eliminarPaciente as eliminarPacienteAPI, 
  obtenerPacientes,
 } from "../services/pacientes";

function adaptarPaciente(p: PacienteApi): Paciente {
  return {
    id: String(p.CI),
    nombre: p.nombre,
    apellido: p.apellido,
    email: p.email,
    telefono: p.telefono,
    especialidadAsignada: "Sin asignar",
    ultimaCita: "No disponible",
  };
}

export function PaginaPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstadoValor>("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarPacientes = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await obtenerPacientes();
      setPacientes(datos.map(adaptarPaciente));
    } catch (err) {
      setError(
        "No se pudieron cargar los pacientes. Comprueba la conexión e inténtalo de nuevo.",
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarPacientes();
  }, [cargarPacientes]);

  const termino = busqueda.trim().toLowerCase();

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const coincideBusqueda =
      paciente.nombre.toLowerCase().includes(termino) ||
      paciente.apellido.toLowerCase().includes(termino) ||
      paciente.email.toLowerCase().includes(termino);

   
    return coincideBusqueda;
  });

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("Todos");
  };
  
  const agregarPaciente = async (datos: CrearPacienteDTO): Promise<void> => {
    const pacienteCreado = await crearPaciente(datos);
    setPacientes((prev) => [
      ...prev,
      adaptarPaciente(pacienteCreado),
    ]);
  };

  const eliminarPaciente = async (id: string): Promise<void> => {
    const paciente = pacientes.find((p) => p.id === id);
    if (!paciente) return;
    
    const confirmado = window.confirm(
    `¿Eliminar a ${paciente.nombre} ${paciente.apellido}?`,
  );
  
  if (!confirmado) return;
    try {
      await eliminarPacienteAPI(id);
      
      setPacientes((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar el paciente:", error);
      
      window.alert(
        "No se pudo eliminar el paciente. Comprueba la conexión e inténtalo de nuevo.",
      );
    }
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <p role="status" className="mx-auto max-w-7xl rounded-xl bg-white p-6">
          Cargando pacientes...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <section
          role="alert"
          className="mx-auto max-w-7xl rounded-xl border border-rose-200 bg-white p-6"
        >
          <p className="text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => void cargarPacientes()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Reintentar
          </button>
        </section>
      </main>
    );
  }

  const hayFiltrosActivos = busqueda !== "" || estadoFiltro !== "Todos";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">Gestión clínica</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Pacientes
          </h1>
          <p className="mt-2 text-slate-600">
            Consulta y administra la información de tus pacientes.
          </p>
        </header>

        <section
          aria-label="Agregar paciente"
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Agregar paciente
          </h2>
          <FormularioPaciente onAgregar={agregarPaciente} />
        </section>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <BuscadorPacientes value={busqueda} onChange={setBusqueda} />

            <label className="flex flex-col gap-1 text-sm text-slate-700">
              Filtrar por estado
              <select
                value={estadoFiltro}
                onChange={(event) =>
                  setEstadoFiltro(event.target.value as FiltroEstadoValor)
                }
                className="rounded-lg border border-slate-300 bg-white px-3 py-2"
              >
                <option value="Todos">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="en_espera">En espera</option>
              </select>
            </label>

            <button
              type="button"
              onClick={limpiarFiltros}
              disabled={!hayFiltrosActivos}
              className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              Limpiar filtros
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-500" aria-live="polite">
            {pacientesFiltrados.length}{" "}
            {pacientesFiltrados.length === 1
              ? "paciente encontrado"
              : "pacientes encontrados"}
          </p>
        </section>

        {pacientesFiltrados.length > 0 ? (
          <section
            aria-label="Lista de pacientes"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {pacientesFiltrados.map((paciente) => (
              <PacienteCard
                key={paciente.id}
                paciente={paciente}
                onEliminar={eliminarPaciente}
              />
            ))}
          </section>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              No se encontraron pacientes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {pacientes.length === 0
                ? "La API no devolvió pacientes."
                : "Prueba con otro nombre, apellido o email."}
            </p>
            {pacientes.length > 0 && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
