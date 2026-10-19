import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import PaginaDashboard from './pages/PaginaDashboard';
import { PaginaPacientes } from './pages/PaginaPacientes';
import { PaginaDetallePaciente } from './pages/PaginaDetallePaciente';
import { PaginaNuevaCita } from './pages/PaginaNuevaCita';
import { PaginaNotFound } from './pages/PaginaNotFound';
import { PaginaLogin } from './pages/PaginaLogin';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />

      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
