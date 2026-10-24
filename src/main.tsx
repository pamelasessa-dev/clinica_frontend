import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { Layout } from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaNotFound } from './pages/PaginaNotFound';
import { PaginaLogin } from './pages/PaginaLogin';
import { PaginaReportes } from './pages/PaginaReportes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />

        <Route element={<Layout />}>
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
          <Route path="/reportes" element={<PaginaReportes />} />
          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento raíz #root');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
