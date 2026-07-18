export function SkipLink({label}: {label: string}) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cyan-primary focus:px-5 focus:py-3 focus:font-bold focus:text-bg-void focus:shadow-cyan-glow"
    >
      {label}
    </a>
  );
}
