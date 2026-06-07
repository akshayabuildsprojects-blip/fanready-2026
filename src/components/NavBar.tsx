import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { APP_LANGUAGE_KEY } from "../i18n.ts";

export default function NavBar() {
  const { i18n, t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isSourcesOpen = pathname === "/sources";
  const currentLanguage = i18n.resolvedLanguage?.startsWith("es") ? "es" : "en";
  const iconClassName = isSourcesOpen
    ? "inline-flex size-9 items-center justify-center rounded-full border border-stitch-primary bg-stitch-primary text-stitch-neutral transition"
    : "inline-flex size-9 items-center justify-center rounded-full border border-stitch-primary/15 text-stitch-primary/70 transition hover:border-stitch-primary/30 hover:text-stitch-primary";

  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === "en" ? "es" : "en";
    try {
      localStorage.setItem(APP_LANGUAGE_KEY, nextLanguage);
    } catch {
      // Keep language switching available when storage is restricted.
    }
    void i18n.changeLanguage(nextLanguage);
  };

  const icon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={isSourcesOpen ? "currentColor" : "none"}
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
  );

  return (
    <header className="sticky top-0 z-50 border-b border-stitch-primary/10 bg-stitch-neutral">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <p className="font-stitch-headline text-xl font-semibold text-stitch-primary">
          FanReady 2026
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-9 items-center justify-center rounded-full border border-stitch-primary/15 px-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary/70 transition hover:border-stitch-primary/30 hover:text-stitch-primary"
            aria-label={t("language_toggle")}
          >
            {currentLanguage.toUpperCase()}
          </button>
          {isSourcesOpen ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label={t("close_sources_aria")}
              aria-pressed="true"
              className={iconClassName}
            >
              {icon}
            </button>
          ) : (
            <Link
              to="/sources"
              aria-label={t("sources_aria")}
              className={iconClassName}
            >
              {icon}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
