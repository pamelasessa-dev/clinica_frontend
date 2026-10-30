interface SpinnerProps {
  fullscreen?: boolean;
  label?: string;
}

export function Spinner({ fullscreen = false, label = "Cargando" }: SpinnerProps) {
  const spinner = (
    <span
      aria-label={label}
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );

  if (fullscreen) {
    return (
      <div role="status" className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80">
        {spinner}
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return <span role="status" className="inline-flex h-5 w-5 items-center justify-center">{spinner}</span>;
}
