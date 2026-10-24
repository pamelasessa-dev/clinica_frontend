import { useEffect, useState } from "react";
import { usePacientesStore } from "../store/pacientesStore";
import toast from "react-hot-toast";
import type { Paciente } from "../types/paciente";
import type { CrearPacienteDTO } from "../types/dtos";
import { PacienteCard } from "../components/PacienteCard";
import { BuscadorPacientes } from "../components/BuscadorPacientes";
import { FormularioPaciente } from "../components/FormularioPaciente";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { extraerMensajeError } from "../lib/errorHandler";
import { useFiltrosStore } from "../store/filtrosStore";
import { useDebounce } from "../hooks/useDebounce";

export function PaginaPacientes() {
  const pacientes = usePacientesStore((s) => s.pacientes);
  const cargando = usePacientesStore((s) => s.cargando);
  const error = usePacientesStore((s) => s.error);
  const cargar = usePacientesStore((s) => s.cargar);
  const crear = usePacientesStore((s) => s.crear);
  const actualizar = usePacientesStore((s) => s.actualizar);
  const eliminar = usePacientesStore((s) => s.eliminar);

  const busqueda = useFiltrosStore((s) => s.queryPacientes);
  const setBusqueda = useFiltrosStore((s) => s.setQueryPacientes);
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros);
  const busquedaDebounced = useDebounce(busqueda, 350);

  const [pacienteEditando, setPacienteEditando] = useState<Paciente | null>(
    null,
  );

  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(
    null,
  );

  const [eliminando, setEliminando] = useState(false);

  // Cargar pacientes y buscar cuando termina el debounce
  useEffect(() => {
    void cargar(busquedaDebounced.trim());
  }, [cargar, busquedaDebounced]);

  // Los pacientes ya vienen filtrados desde el backend
  const pacientesFiltrados = pacientes;

  const limpiarBusqueda = () => {
    resetFiltros();
  };

  // Crear o actualizar un paciente
  const guardarPaciente = async (datos: CrearPacienteDTO): Promise<void> => {
    try {
      if (pacienteEditando) {
        const idOriginal = pacienteEditando.id;

        await actualizar(idOriginal, {
          nombre: datos.nombre,
          apellido: datos.apellido,
          email: datos.email,
          fecha_nacimiento: datos.fecha_nacimiento,
          direccion: datos.direccion,
          telefono: datos.telefono,
        });

        setPacienteEditando(null);
        toast.success("Paciente actualizado correctamente");
      } else {
        await crear(datos);
        toast.success("Paciente registrado correctamente");
      }
    } catch (err) {
      toast.error(extraerMensajeError(err));
      throw err;
    }
  };

  // Abrir el modal de confirmación
  const solicitarEliminarPaciente = (id: string) => {
    const seleccionado = pacientes.find((paciente) => paciente.id === id);

    if (seleccionado) {
      setPacienteAEliminar(seleccionado);
    }
  };

  // Eliminar después de confirmar en el modal
  const confirmarEliminarPaciente = async (): Promise<void> => {
    if (!pacienteAEliminar || eliminando) return;

    const id = pacienteAEliminar.id;
    setEliminando(true);

    try {
      await eliminar(id);
      setPacienteAEliminar(null);
      toast.success("Paciente eliminado correctamente");
    } catch (err) {
      toast.error(extraerMensajeError(err));
    } finally {
      setEliminando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">Gestión clínica</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Pacientes
          </h1>

          <p className="mt-2 text-slate-600">
            Consulta y administra la información de tus pacientes.
          </p>
        </header>

        {/* Error de carga */}
        {error && (
          <section
            role="alert"
            className="mb-6 rounded-xl border border-rose-200 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              No se pudieron cargar los pacientes
            </h2>

            <p className="mt-2 text-sm text-rose-700">{error}</p>

            <button
              type="button"
              onClick={() => void cargar(busquedaDebounced.trim())}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
          </section>
        )}

        {/* Formulario de creación y edición */}
        <section
          aria-label={pacienteEditando ? "Editar paciente" : "Agregar paciente"}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            {pacienteEditando ? "Editar paciente" : "Agregar paciente"}
          </h2>

          <FormularioPaciente
            key={pacienteEditando?.id ?? "nuevo-paciente"}
            pacienteInicial={pacienteEditando}
            onGuardar={guardarPaciente}
            onCancelar={
              pacienteEditando ? () => setPacienteEditando(null) : undefined
            }
          />
        </section>

        {/* Buscador */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <BuscadorPacientes
              value={busqueda}
              onChange={setBusqueda}
              cargando={cargando}
            />

            <button
              type="button"
              onClick={limpiarBusqueda}
              disabled={busqueda.trim() === ""}
              className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Limpiar búsqueda
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-500" aria-live="polite">
            {pacientesFiltrados.length}{" "}
            {pacientesFiltrados.length === 1
              ? "paciente encontrado"
              : "pacientes encontrados"}
          </p>
        </section>

        {/* Lista de pacientes */}
        {pacientesFiltrados.length > 0 ? (
          <section
            aria-label="Lista de pacientes"
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {pacientesFiltrados.map((paciente) => (
              <PacienteCard
                key={paciente.id}
                paciente={paciente}
                onEditar={(id) => {
                  const seleccionado = pacientes.find((p) => p.id === id);

                  if (seleccionado) {
                    setPacienteEditando(seleccionado);
                  }
                }}
                onEliminar={solicitarEliminarPaciente}
              />
            ))}
          </section>
        ) : (
          !cargando &&
          !error && (
            <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                No se encontraron pacientes
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {busqueda.trim() === ""
                  ? "La API no devolvió pacientes."
                  : "Prueba con otro nombre, apellido o email."}
              </p>

              {busqueda.trim() !== "" && (
                <button
                  type="button"
                  onClick={limpiarBusqueda}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Limpiar búsqueda
                </button>
              )}
            </section>
          )
        )}
      </div>

      {/* Modal para confirmar la eliminación */}
      <ModalConfirmacion
        abierto={pacienteAEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={
          pacienteAEliminar
            ? `¿Seguro que deseas eliminar a ${pacienteAEliminar.nombre} ${pacienteAEliminar.apellido}? Esta acción no se puede deshacer.`
            : ""
        }
        cargando={eliminando}
        onCancelar={() => {
          if (!eliminando) {
            setPacienteAEliminar(null);
          }
        }}
        onConfirmar={() => void confirmarEliminarPaciente()}
      />
    </main>
  );
}
