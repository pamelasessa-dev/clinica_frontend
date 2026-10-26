import { Navigate, Outlet, Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaNotFound } from './pages/PaginaNotFound';
import { PaginaLogin } from './pages/PaginaLogin';
import { PaginaReportes } from './pages/PaginaReportes';
import { useAuthStore } from './store/authStore';

function RutaProtegida() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  return isAuthenticated && token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
          <Route path="/reportes" element={<PaginaReportes />} />
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
