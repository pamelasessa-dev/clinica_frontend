import { Link } from 'react-router';

export function PaginaSinAcceso() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8 text-center">
      <p aria-hidden="true" className="text-7xl">🔒</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
        Sin acceso
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        No tenés permisos para acceder a esta sección.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
