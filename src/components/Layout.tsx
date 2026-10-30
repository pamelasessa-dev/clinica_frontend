import { useEffect, useRef, useState } from 'react';
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
  { to: '/historial', etiqueta: 'Historial de citas', icono: '🗂️' },
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
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const puedeVerReportes = ['GERENCIA', 'ADMIN'].includes(usuario?.rol ?? '');

  useEffect(() => {
    const cerrarAlHacerClickFuera = (event: MouseEvent) => {
      if (event.target instanceof Node && !menuRef.current?.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuAbierto(false);
    };

    document.addEventListener('mousedown', cerrarAlHacerClickFuera);
    document.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.removeEventListener('mousedown', cerrarAlHacerClickFuera);
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, []);

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
          {ITEMS_NAVEGACION.filter((item) => item.to !== '/reportes' || puedeVerReportes).map((item) => (
            <NavLink key={item.to} to={item.to} end={item.fin} className={claseEnlace}>
              <span aria-hidden="true">{item.icono}</span>
              {item.etiqueta}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuAbierto}
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {usuario?.foto ? (
                <img src={usuario.foto} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100" />
              ) : (
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-lg font-semibold text-teal-800 ring-2 ring-slate-100">
                  {usuario?.nombre?.trim().charAt(0).toUpperCase() ?? 'U'}
                </span>
              )}
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-40 truncate text-sm font-semibold text-slate-800">{usuario?.nombre ?? 'Mi cuenta'}</span>
                <span className="block text-xs text-slate-500">{usuario?.rol ?? 'Usuario'}</span>
              </span>
              <span aria-hidden="true" className="text-xs text-slate-500">{menuAbierto ? '▲' : '▼'}</span>
            </button>

            {menuAbierto && (
              <div role="menu" aria-label="Menú de usuario" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">{usuario?.nombre ?? 'Usuario'}</p>
                  <p className="truncate text-xs text-slate-500">{usuario?.email}</p>
                </div>
                <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Mi cuenta</p>
                <NavLink role="menuitem" to="/perfil" onClick={() => setMenuAbierto(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800">
                  Editar perfil
                </NavLink>
                <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Recursos</p>
                <NavLink role="menuitem" to="/" end onClick={() => setMenuAbierto(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800">
                  Dashboard
                </NavLink>
                <NavLink role="menuitem" to="/pacientes" onClick={() => setMenuAbierto(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800">
                  Pacientes
                </NavLink>
                <NavLink role="menuitem" to="/citas/nueva" onClick={() => setMenuAbierto(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800">
                  Nueva cita
                </NavLink>
                <NavLink role="menuitem" to="/historial" onClick={() => setMenuAbierto(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800">
                  Historial de citas
                </NavLink>
                {puedeVerReportes && (
                  <NavLink role="menuitem" to="/reportes" onClick={() => setMenuAbierto(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-800">
                    Reportes
                  </NavLink>
                )}
                <div className="mt-2 border-t border-slate-100 px-2 pt-2">
                  <button type="button" role="menuitem" onClick={cerrarSesion} className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50">
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
