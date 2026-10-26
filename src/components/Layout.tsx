import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';


interface ItemNavegacion {
  to: string;
  etiqueta: string;
  icono: string;
  fin?: boolean;
}

const ITEMS_NAVEGACION: ItemNavegacion[] = [
  { to: '/', etiqueta: 'Dashboard', icono: '📊', fin: true },
  { to: '/pacientes', etiqueta: 'Pacientes', icono: '👥' },
  { to: '/citas/nueva', etiqueta: 'Nueva cita', icono: '📅' },
  { to: '/reportes', etiqueta: 'Reportes', icono: '📈' },
];

interface EstadoEnlace {
  isActive: boolean;
}

const claseEnlace = ({ isActive }: EstadoEnlace) =>
  `flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function Layout() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);

  const cerrarSesion = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="border-b border-slate-200 bg-white md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-r md:border-b-0">
        <div className="px-5 py-4 md:py-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
            Clínica
          </p>
          <p className="text-lg font-bold text-slate-900">Salud Integral</p>
        </div>

        <nav
          aria-label="Navegación principal"
          className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0"
        >
          {ITEMS_NAVEGACION.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.fin}
              className={claseEnlace}
            >
              <span aria-hidden="true">{item.icono}</span>
              {item.etiqueta}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-3 px-5 pb-4 md:mt-6 md:items-start md:flex-col">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {usuario?.nombre ?? 'Sesión activa'}
            </p>
            {usuario?.rol && (
              <p className="text-xs text-slate-500">{usuario.rol}</p>
            )}
          </div>
          <button
            type="button"
            onClick={cerrarSesion}
            className="shrink-0 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
