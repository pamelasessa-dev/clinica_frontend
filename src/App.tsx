import { Navigate, Outlet, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaNotFound } from './pages/PaginaNotFound';
import { PaginaLogin } from './pages/PaginaLogin';
import { PaginaReportes } from './pages/PaginaReportes';
import { PaginaSinAcceso } from './pages/PaginaSinAcceso';
import { PaginaPerfil } from './pages/PaginaPerfil';
import { PaginaHistorialCitas } from './pages/PaginaHistorialCitas';
import { useAuthStore } from './store/authStore';

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const { isAuthenticated, token, usuario } = useAuthStore();

  if (!isAuthenticated || !token) return <Navigate to="/login" replace />;
  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol ?? '')) {
    return <Navigate to="/sin-acceso" replace />;
  }
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RutaProtegida />}>
        <Route path="/sin-acceso" element={<PaginaSinAcceso />} />
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/perfil" element={<PaginaPerfil />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
          <Route path="/historial" element={<PaginaHistorialCitas />} />
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route path="/reportes" element={<PaginaReportes />} />
          </Route>
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
