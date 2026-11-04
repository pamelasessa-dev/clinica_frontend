import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import { PaginaLogin } from './pages/PaginaLogin';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Spinner } from './components/ui/Spinner';

const PaginaPacientes = lazy(() => import('./pages/PaginaPacientes').then((m) => ({ default: m.PaginaPacientes })));
const PaginaDetallePaciente = lazy(() => import('./pages/PaginaDetallePaciente').then((m) => ({ default: m.PaginaDetallePaciente })));
const PaginaNuevaCita = lazy(() => import('./pages/PaginaNuevaCita').then((m) => ({ default: m.PaginaNuevaCita })));
const PaginaNotFound = lazy(() => import('./pages/PaginaNotFound').then((m) => ({ default: m.PaginaNotFound })));
const PaginaReportes = lazy(() => import('./pages/PaginaReportes').then((m) => ({ default: m.PaginaReportes })));
const PaginaSinAcceso = lazy(() => import('./pages/PaginaSinAcceso').then((m) => ({ default: m.PaginaSinAcceso })));
const PaginaPerfil = lazy(() => import('./pages/PaginaPerfil').then((m) => ({ default: m.PaginaPerfil })));
const PaginaHistorialCitas = lazy(() => import('./pages/PaginaHistorialCitas').then((m) => ({ default: m.PaginaHistorialCitas })));

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
    <Suspense fallback={<Spinner fullscreen label="Cargando página" />}>
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
          <Route path="/reportes" element={<ErrorBoundary mensaje="Error al cargar reportes"><PaginaReportes /></ErrorBoundary>} />
          </Route>
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
