import { useDebounce } from "./useDebounce";
import { useFiltrosStore } from "../store/filtrosStore";
import { usePacientes } from "../features/pacientes/hooks/usePacientes";

export function usePacientesFiltrados() {
  const query = useFiltrosStore((s) => s.queryPacientes);
  const setQuery = useFiltrosStore((s) => s.setQueryPacientes);
  const estadoFiltro = useFiltrosStore((s) => s.estadoPacienteFiltro);
  const setEstadoFiltro = useFiltrosStore((s) => s.setEstadoPaciente);
  const resetFiltros = useFiltrosStore((s) => s.resetFiltros);

  const queryDebounced = useDebounce(query, 350);
  const { pacientes, cargando, error, cargar, crear, actualizar, eliminar } =
    usePacientes(queryDebounced.trim());

  const filtrados = pacientes.filter(
    (paciente) => estadoFiltro === "Todos" || paciente.estado === estadoFiltro,
  );

  return {
    pacientes,
    filtrados,
    query,
    setQuery,
    estadoFiltro,
    setEstadoFiltro,
    limpiarFiltros: resetFiltros,
    cargando,
    error,
    crear,
    actualizar,
    eliminar,
    recargar: () => void cargar(queryDebounced.trim()),
  };
}
