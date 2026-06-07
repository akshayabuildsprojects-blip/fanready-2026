import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const dataSources = [
  "data_source_fifa",
  "data_source_transport",
  "data_source_stadium",
  "data_source_government",
  "data_source_transit",
];

const operationalRealityCards = [
  {
    label: "stadium_reality_varies",
    text: "stadium_reality_varies_text",
  },
  {
    label: "transit_assumptions_break",
    text: "transit_assumptions_break_text",
  },
  {
    label: "heat_queues_compound",
    text: "heat_queues_compound_text",
  },
  {
    label: "post_match_trap",
    text: "post_match_trap_text",
  },
];

export default function SourcesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="font-stitch-label text-[10px] font-bold uppercase tracking-[0.24em] text-stitch-secondary">
          {t("sources")}
        </p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h1 className="font-stitch-headline text-3xl font-bold text-stitch-primary">
            {t("sources_title")}
          </h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex shrink-0 items-center gap-1.5 pt-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary/70 hover:text-stitch-primary"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("back")}
          </button>
        </div>
        <p className="mt-4 font-stitch-body text-sm leading-6 text-stitch-primary/80">
          {t("sources_intro")}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          {t("operational_reality")}
        </h2>
        <div className="space-y-3">
          {operationalRealityCards.map((card) => (
            <article
              key={card.label}
              className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5"
            >
              <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
                {t(card.label)}
              </p>
              <p className="mt-3 font-stitch-body text-sm leading-6 text-stitch-primary/80">
                {t(card.text)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          {t("data_sources")}
        </h2>
        <ul className="mt-4 space-y-3 font-stitch-body text-sm text-stitch-primary/80">
          {dataSources.map((source) => (
            <li key={source} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-stitch-secondary" />
              <span>{t(source)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          {t("methodology")}
        </h2>
        <p className="mt-4 font-stitch-body text-sm leading-6 text-stitch-primary/80">
          {t("methodology_body")}
        </p>
      </section>

      <section className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          {t("disclaimer")}
        </h2>
        <p className="mt-4 font-stitch-body text-sm leading-6 text-stitch-primary/80">
          {t("unofficial_tool")}
        </p>
      </section>

      <div className="border-t border-stitch-primary/10 pt-5">
        <p className="font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary/60">
          {t("last_reviewed")}
        </p>
      </div>
    </div>
  );
}
