import Link from "next/link";

export function Header() {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-flago-dark text-white">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading font-extrabold text-lg tracking-tight">
            FLAGO <span className="text-flago-red">PULSE</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/sources" className="hover:text-white transition-colors">
              Sources
            </Link>
          </nav>
        </div>
        <span className="text-sm text-white/60">{today}</span>
      </div>
    </header>
  );
}
