import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stitch-primary/10 bg-stitch-neutral">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <p className="font-stitch-headline text-xl font-semibold text-stitch-primary">
          FanReady 2026
        </p>
        <Link
          to="/sources"
          aria-label="Sources and methodology"
          className="inline-flex size-9 items-center justify-center rounded-full border border-stitch-primary/15 text-stitch-primary/70 transition hover:border-stitch-primary/30 hover:text-stitch-primary"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M9 13h6" />
            <path d="M9 17h6" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
