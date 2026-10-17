import { Link } from 'react-router';

export function PaginaNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8 text-center">
      <p aria-hidden="true" className="text-7xl">
        
      </p>

      <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
        404
      </h1>

      <p className="mt-3 max-w-md text-slate-600">
        La página que buscas no existe o fue movida.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
