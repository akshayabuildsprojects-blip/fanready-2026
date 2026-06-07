import { useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PerCityFrictionBriefCard from "../components/PerCityFrictionBriefCard.tsx";
import {
  checklistCities,
  formatCityList,
  getPrimaryRisks,
  getTripComplexity,
  resolveBriefCities,
} from "../lib/briefPersonalization.ts";
import { readSelectedCities } from "../lib/selectedCities.ts";
import { readTripAnswers } from "../lib/tripAnswers.ts";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <div className="h-px bg-stitch-primary/10" />
      <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
        {label}
      </p>
    </div>
  );
}

function WarningTriangle() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="text-stitch-danger"
      aria-hidden
    >
      <path d="M10.3 4.9 2.6 18.2A2 2 0 0 0 4.3 21h15.4a2 2 0 0 0 1.7-2.8L13.7 4.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

function WarningCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4 border border-stitch-primary/10 bg-stitch-neutral p-5">
      <div className="shrink-0 text-stitch-secondary">{icon}</div>
      <div>
        <p className="font-stitch-headline text-lg font-semibold text-stitch-primary">
          {title}
        </p>
        <p className="mt-2 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
          {body}
        </p>
      </div>
    </div>
  );
}

function RouteIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path d="M2 12h6l2-7 4 14 2-7h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PassportIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <circle cx="12" cy="11" r="3" />
      <path d="M8 17h8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4z" strokeLinejoin="round" />
      <path d="M12 8v5M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

function SearchGlobeIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <circle cx="10" cy="10" r="6" />
      <path d="M4 10h12M10 4a9 9 0 0 1 0 12M10 4a9 9 0 0 0 0 12M15 15l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldAtIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4z" strokeLinejoin="round" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">
        @
      </text>
    </svg>
  );
}

const DO_NOT_ASSUME_KEYS = [
  "assumption_stadium_center",
  "assumption_transit",
  "assumption_rideshare",
] as const;

const RISK_KEYS: Record<string, string> = {
  "STADIUM DISTANCE": "risk_stadium_distance",
  "HUMID HEAT INDEX": "risk_humid_heat_index",
  "POST-MATCH EGRESS": "risk_post_match_egress",
  "CROSS-BORDER TRANSIT": "risk_cross_border_transit",
  "PARKING & TRAFFIC": "risk_parking_traffic",
  "LOCAL NAVIGATION": "risk_local_navigation",
  "TIME ZONE DRIFT": "risk_time_zone_drift",
  "MATCHDAY CROWDING": "risk_matchday_crowding",
};

export default function MyBriefPage() {
  const { t } = useTranslation();
  const tripAnswers = readTripAnswers();
  const selectedIds = readSelectedCities();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const resolved = useMemo(
    () => resolveBriefCities(selectedIds, tripAnswers),
    [selectedIds, tripAnswers],
  );

  const cityLabels = useMemo(() => checklistCities(resolved), [resolved]);
  const primaryCity = cityLabels[0] ?? "your host city";
  const borderCity = cityLabels[1] ?? cityLabels[0] ?? "your host city";
  const mapCity =
    resolved[0]?.downtownArea ??
    resolved[0]?.city.name.split(" / ").pop() ??
    "host";

  if (!tripAnswers) {
    return (
      <>
        <div className="-mx-4 space-y-4 px-4 pb-28">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {t("confidential")}
          </p>
          <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
            {t("your_brief")}
          </h1>
          <p className="font-stitch-body text-sm text-stitch-primary/80">
            {t("no_brief_found")}
          </p>
          <Link
            to="/brief"
            className="inline-flex font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary underline-offset-2 hover:underline"
          >
            {t("build_your_brief")}
          </Link>
        </div>
      </>
    );
  }

  const complexity = getTripComplexity(tripAnswers, resolved.length);
  const complexityLabel = t(`${complexity}_complexity`);
  const complexityColor =
    complexity === "high"
      ? "text-stitch-danger"
      : complexity === "medium"
        ? "text-stitch-secondary"
        : "text-stitch-tertiary";

  const checklistItems = [
    t("checklist_airport_transport", { city: primaryCity }),
    t("checklist_bag_policy"),
    t("checklist_visa_status", { city: borderCity }),
    t("checklist_offline_maps", { city: mapCity }),
  ];

  const firstCity = resolved[0]?.city;
  const officialCityLink =
    firstCity?.dynamicFields.officialCityLink ?? "https://www.fifa.com/";
  const stadiumLink =
    firstCity?.dynamicFields.bagPolicyLink ??
    firstCity?.dynamicFields.transportLink ??
    "https://www.fifa.com/";

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      <div className="-mx-4 space-y-8 px-4 pb-28">
        <header>
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {t("confidential")}
          </p>
          <h1 className="mt-2 font-stitch-headline text-3xl font-semibold text-stitch-primary">
            {t("your_brief")}
          </h1>
          <Link
            to="/brief"
            className="mt-4 inline-flex items-center justify-center border border-stitch-primary bg-transparent px-4 py-2.5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            {t("edit_brief")}
          </Link>
        </header>

        {/* Section 1: Trip summary */}
        <section className="border border-stitch-primary/10 bg-stitch-primary/[0.03] p-5">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {t("trip_complexity")}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`font-stitch-headline text-4xl font-semibold ${complexityColor}`}
            >
              {complexityLabel}
            </span>
            {complexity === "high" && <WarningTriangle />}
          </div>
          <p className="mt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {t(`complexity_summary_${complexity}`)}
          </p>

          <p className="mt-5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {t("cities_identified")}
          </p>
          <p className="mt-1 font-stitch-headline text-xl font-semibold text-stitch-primary">
            {resolved.length > 0
              ? formatCityList(resolved)
              : t("no_host_cities")}
          </p>

          <p className="mt-5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {t("primary_risks")}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {getPrimaryRisks(tripAnswers, resolved).map((risk) => (
              <li key={risk}>{t(RISK_KEYS[risk] ?? risk)}</li>
            ))}
          </ul>
        </section>

        <SectionDivider label={`01. ${t("overall_warnings")}`} />

        <section className="space-y-3">
          {resolved.length >= 2 && (
            <WarningCard
              icon={<RouteIcon />}
              title={t("multi_city_logistics")}
              body={t("multi_city_logistics_body")}
            />
          )}
          {tripAnswers.visitingFromAbroad && (
            <WarningCard
              icon={<PassportIcon />}
              title={t("entry_requirements")}
              body={t("entry_requirements_body")}
            />
          )}
          <WarningCard
            icon={<ShieldIcon />}
            title={t("market_fraud_alert")}
            body={t("market_fraud_alert_body")}
          />
        </section>

        <SectionDivider label={`02. ${t("per_city_friction")}`} />

        <section className="space-y-4">
          {resolved.length > 0 ? (
            resolved.map((entry, index) => (
              <PerCityFrictionBriefCard
                key={entry.city.id}
                resolved={entry}
                figureNumber={index + 1}
              />
            ))
          ) : (
            <p className="font-stitch-body text-sm text-stitch-primary/80">
              {t("select_cities_for_analysis")}
            </p>
          )}
        </section>

        <SectionDivider label={`03. ${t("before_matchday")}`} />

        <section className="border border-stitch-primary/10 bg-stitch-neutral">
          {checklistItems.map((item, index) => (
            <label
              key={item}
              className="flex cursor-pointer items-start gap-3 border-b border-stitch-primary/10 p-4 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={Boolean(checkedItems[index])}
                onChange={() => toggleCheck(index)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-stitch-primary"
              />
              <span className="font-stitch-body text-sm leading-relaxed text-stitch-primary/90">
                {item}
              </span>
            </label>
          ))}
        </section>

        <SectionDivider label={`04. ${t("do_not_assume")}`} />

        <section className="space-y-3">
          {DO_NOT_ASSUME_KEYS.map((key, index) => (
            <div
              key={key}
              className="flex gap-4 border border-stitch-primary/10 bg-stitch-neutral p-4"
            >
              <span className="font-stitch-label text-[10px] font-bold text-stitch-primary/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
                {t(key)}
              </p>
            </div>
          ))}
        </section>

        <SectionDivider label={`05. ${t("verify_departure")}`} />

        <section className="space-y-3">
          <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {t("verify_departure_body")}
          </p>
          <a
            href="https://www.fifa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 bg-stitch-primary px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>{t("official_fifa")}</span>
            <span aria-hidden>→</span>
          </a>
          <a
            href={officialCityLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-3 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>{t("host_city_site")}</span>
            <SearchGlobeIcon />
          </a>
          <a
            href={stadiumLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-3 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>{t("stadium_policy")}</span>
            <ShieldAtIcon />
          </a>
        </section>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
          <button type="button" className="hover:text-stitch-primary">
            {t("legal_disclaimer")}
          </button>
          <span aria-hidden>|</span>
          <button type="button" className="hover:text-stitch-primary">
            {t("source_credits")}
          </button>
        </div>
      </div>

    </>
  );
}
