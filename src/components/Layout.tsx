import { NavLink, Outlet } from 'react-router';


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
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}