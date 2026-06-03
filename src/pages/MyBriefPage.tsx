import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import PerCityFrictionBriefCard from "../components/PerCityFrictionBriefCard.tsx";
import {
  checklistCities,
  formatCityList,
  getComplexitySummary,
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

const DO_NOT_ASSUME = [
  "Stadium ≠ City Center. Major venues are located in outlying suburbs with distinct transport networks.",
  "Transit availability. Unlike European hubs, public transit is not the primary mode for several host venues.",
  "Post-match rideshare. Pricing surges and wait times can exceed 3 hours in Miami and Dallas zones.",
] as const;

export default function MyBriefPage() {
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
            CONFIDENTIAL INTELLIGENCE REPORT
          </p>
          <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
            Your Matchday Readiness Brief
          </h1>
          <p className="font-stitch-body text-sm text-stitch-primary/80">
            No brief found. Complete the readiness checker first.
          </p>
          <Link
            to="/brief"
            className="inline-flex font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary underline-offset-2 hover:underline"
          >
            ← Build your brief
          </Link>
        </div>
      </>
    );
  }

  const complexity = getTripComplexity(tripAnswers, resolved.length);
  const complexityLabel = complexity.toUpperCase();
  const complexityColor =
    complexity === "high"
      ? "text-stitch-danger"
      : complexity === "medium"
        ? "text-stitch-secondary"
        : "text-stitch-tertiary";

  const checklistItems = [
    `Confirm ground transport from airport to ${primaryCity} accommodation.`,
    'Review stadium bag policy (Clear bag only, max size 12"x6"x12").',
    `Verify visa status for US/Canada border crossing for ${borderCity} leg.`,
    `Download offline maps for ${mapCity} sector (Spotty cellular data).`,
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
            CONFIDENTIAL INTELLIGENCE REPORT
          </p>
          <h1 className="mt-2 font-stitch-headline text-3xl font-semibold text-stitch-primary">
            Your Matchday Readiness Brief
          </h1>
          <Link
            to="/brief"
            className="mt-4 inline-flex items-center justify-center border border-stitch-primary bg-transparent px-4 py-2.5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            EDIT BRIEF
          </Link>
        </header>

        {/* Section 1: Trip summary */}
        <section className="border border-stitch-primary/10 bg-stitch-primary/[0.03] p-5">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Trip complexity
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
            {getComplexitySummary(complexity)}
          </p>

          <p className="mt-5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Cities identified
          </p>
          <p className="mt-1 font-stitch-headline text-xl font-semibold text-stitch-primary">
            {resolved.length > 0
              ? formatCityList(resolved)
              : "No host cities selected"}
          </p>

          <p className="mt-5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Primary risks
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {getPrimaryRisks(tripAnswers, resolved).map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </section>

        <SectionDivider label="01. OVERALL TRIP WARNINGS" />

        <section className="space-y-3">
          {resolved.length >= 2 && (
            <WarningCard
              icon={<RouteIcon />}
              title="Multi-City Logistics"
              body="Crossing multiple time zones (CST/EST). Recommended minimum 48hr buffer between matchdays for recovery."
            />
          )}
          {tripAnswers.visitingFromAbroad && (
            <WarningCard
              icon={<PassportIcon />}
              title="Entry Requirements"
              body="Domestic flights still require valid government ID. Check passport validity for internal North American travel."
            />
          )}
          <WarningCard
            icon={<ShieldIcon />}
            title="Market Fraud Alert"
            body="High volume of phishing in Dallas/Miami sectors. Only use the official FIFA ticketing mobile applications."
          />
        </section>

        <SectionDivider label="02. PER-CITY FRICTION INDEX" />

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
              Select host cities in the City Friction Index to populate
              per-city analysis.
            </p>
          )}
        </section>

        <SectionDivider label="03. BEFORE MATCHDAY CHECKLIST" />

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

        <SectionDivider label="04. DO NOT ASSUME" />

        <section className="space-y-3">
          {DO_NOT_ASSUME.map((text, index) => (
            <div
              key={text}
              className="flex gap-4 border border-stitch-primary/10 bg-stitch-neutral p-4"
            >
              <span className="font-stitch-label text-[10px] font-bold text-stitch-primary/50">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
                {text}
              </p>
            </div>
          ))}
        </section>

        <SectionDivider label="05. VERIFY BEFORE DEPARTURE" />

        <section className="space-y-3">
          <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            All friction guidance is based on publicly available information.
            Always verify transport, ticketing, and entry requirements through
            official sources before matchday.
          </p>
          <a
            href="https://www.fifa.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 bg-stitch-primary px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>OFFICIAL FIFA INFO</span>
            <span aria-hidden>→</span>
          </a>
          <a
            href={officialCityLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-3 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>HOST CITY SITE</span>
            <SearchGlobeIcon />
          </a>
          <a
            href={stadiumLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-3 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>STADIUM POLICY</span>
            <ShieldAtIcon />
          </a>
        </section>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
          <button type="button" className="hover:text-stitch-primary">
            LEGAL DISCLAIMER
          </button>
          <span aria-hidden>|</span>
          <button type="button" className="hover:text-stitch-primary">
            SOURCE CREDITS
          </button>
        </div>
      </div>

    </>
  );
}
