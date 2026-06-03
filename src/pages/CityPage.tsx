import { type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import AnimatedFrictionScore from "../components/AnimatedFrictionScore.tsx";
import citiesData from "../data/cities.json";
import {
  displayCityArea,
  displayCityShort,
  frictionIndexTier,
  geospatialRailLabel,
  intelligenceRef,
  primaryFrictionBody,
  securityAlertBody,
  transportBadge,
  venueLogisticsBody,
} from "../lib/cityGuide.ts";
import type { City } from "../types/city.ts";

const cities = citiesData.cities as City[];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
      {children}
    </p>
  );
}

function NumberedSection({
  number,
  name,
  title,
  children,
  alert,
}: {
  number: string;
  name: string;
  title: string;
  children: ReactNode;
  alert?: boolean;
}) {
  return (
    <section className="space-y-3">
      <p
        className={`font-stitch-label text-[10px] font-bold uppercase tracking-wide ${
          alert ? "text-stitch-danger" : "text-stitch-primary"
        }`}
      >
        {number} // {name}
      </p>
      <div className="h-px bg-stitch-primary/10" />
      <h2 className="font-stitch-headline text-xl font-semibold text-stitch-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

function WarningTriangle({ className = "text-stitch-neutral" }: { className?: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden
    >
      <path d="M10.3 4.9 2.6 18.2A2 2 0 0 0 4.3 21h15.4a2 2 0 0 0 1.7-2.8L13.7 4.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v5M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="4" y="14" width="3" height="6" />
      <rect x="10" y="10" width="3" height="10" />
      <rect x="16" y="6" width="3" height="14" />
    </svg>
  );
}

function StadiumIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path d="M4 10h16M6 10V8a6 6 0 0 1 12 0v2M5 10v8h14v-8" strokeLinejoin="round" />
      <path d="M8 18v2M16 18v2" strokeLinecap="round" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="text-stitch-secondary"
      aria-hidden
    >
      <path
        d="M12 3c2 4 1 6-2 8 2 0 4 2 4 6a4 4 0 0 1-8 0c0-3 2-5 4-6-3-2-4-4-2-8 2 0 4-1 6-2 8z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="text-stitch-danger"
      aria-hidden
    >
      <path d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4z" strokeLinejoin="round" />
    </svg>
  );
}

function SearchGlobeIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <circle cx="10" cy="10" r="6" />
      <path d="M4 10h12M10 4a9 9 0 0 1 0 12M10 4a9 9 0 0 0 0 12M15 15l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldAtIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M12 3 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-4z" strokeLinejoin="round" />
      <text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor" stroke="none">
        @
      </text>
    </svg>
  );
}

export default function CityPage() {
  const { id } = useParams<{ id: string }>();
  const city = cities.find((c) => c.id === id);

  if (!city) {
    return (
      <>
        <div className="-mx-4 space-y-4 px-4 pb-28">
          <p className="font-stitch-body text-sm text-stitch-primary/80">
            City not found.
          </p>
          <Link
            to="/cities"
            className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary underline-offset-2 hover:underline"
          >
            ← City friction index
          </Link>
        </div>
      </>
    );
  }

  const tier = frictionIndexTier(city.frictionIndex);
  const km = Math.round(city.distanceMiles * 1.609);
  const downtownLabel = `DOWNTOWN ${displayCityShort(city.name).toUpperCase()}`;
  const stadiumArea = displayCityArea(city.name);
  const officialCityLink =
    city.dynamicFields.officialCityLink ?? "https://www.fifa.com/";
  const stadiumLink =
    city.dynamicFields.bagPolicyLink ??
    city.dynamicFields.transportLink ??
    "https://www.fifa.com/";
  const showHeat =
    city.heatRisk === "high" || city.heatRisk === "medium";

  return (
    <>
      <div className="-mx-4 space-y-8 px-4 pb-28">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-stitch-headline text-xl font-semibold text-stitch-primary">
              FanReady 2026
            </p>
            <p className="font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/60 sm:text-right">
              Unofficial travel readiness tool
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-stitch-primary px-2 py-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral">
              Intelligence report
            </span>
            <span className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
              REF: {intelligenceRef(city)}
            </span>
          </div>

          <div>
            <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
              {city.name} Matchday Guide
            </h1>
            <p className="mt-2 font-stitch-headline text-lg text-stitch-primary/90">
              {city.stadium} friction overview for World Cup travelers
            </p>
          </div>
        </header>

        {/* Friction index */}
        <section className="border border-stitch-danger bg-stitch-neutral px-6 py-8 text-center">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Friction index
          </p>
          <p className="mt-3 font-stitch-headline text-5xl font-semibold text-stitch-danger">
            <AnimatedFrictionScore score={city.frictionIndex} />
          </p>
          <p className="mt-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-danger">
            {tier}
          </p>
        </section>

        <section className="space-y-3">
          <SectionLabel>Primary friction</SectionLabel>
          <h2 className="font-stitch-headline text-xl font-semibold text-stitch-primary">
            {city.primaryFriction}
          </h2>
          <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {primaryFrictionBody(city)}
          </p>
          <div className="flex gap-3 bg-stitch-primary p-4 text-stitch-neutral">
            <WarningTriangle />
            <p className="font-stitch-body text-sm leading-relaxed">
              {city.advisory}
            </p>
          </div>
        </section>

        {/* Geospatial */}
        <section className="space-y-3">
          <SectionLabel>
            {`Geospatial reality: ${city.distanceMiles}-mile transit void`}
          </SectionLabel>
          <div className="border border-stitch-primary/10 bg-stitch-primary/[0.03] p-4">
            <div className="flex items-stretch justify-between gap-2">
              <div className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-stitch-primary bg-stitch-neutral text-stitch-primary">
                  <BarChartIcon />
                </div>
                <p className="mt-2 font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary">
                  {downtownLabel}
                </p>
                <p className="font-stitch-label text-[8px] uppercase tracking-wide text-stitch-primary/60">
                  Primary hotel hub
                </p>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center px-1">
                <div className="w-full border-t border-stitch-primary/30" />
                <p className="mt-2 text-center font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary">
                  {city.distanceMiles} miles ({km} km)
                </p>
                <p className="font-stitch-label text-[8px] font-bold uppercase tracking-wide text-stitch-danger">
                  {geospatialRailLabel(city)}
                </p>
                <div className="mt-2 w-full border-t border-stitch-primary/30" />
              </div>

              <div className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-stitch-secondary/40 bg-stitch-secondary/20 text-stitch-primary">
                  <StadiumIcon />
                </div>
                <p className="mt-2 font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary">
                  {city.stadium.toUpperCase()}
                </p>
                <p className="font-stitch-label text-[8px] uppercase tracking-wide text-stitch-primary/60">
                  {stadiumArea}
                </p>
              </div>
            </div>
          </div>
        </section>

        <NumberedSection number="01" name="VENUE LOGISTICS" title="Stadium Reality Check">
          <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {venueLogisticsBody(city)}
          </p>
        </NumberedSection>

        <NumberedSection number="02" name="STRATEGIC LODGING" title="Lodging Vectors">
          <ul className="space-y-2 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {city.hotelZones.map((zone) => (
              <li key={zone.zone}>
                • <strong>{zone.zone}</strong>: {zone.pros || zone.action}
              </li>
            ))}
          </ul>
        </NumberedSection>

        <NumberedSection number="03" name="MOVEMENT" title="Transport Hierarchy">
          <div className="divide-y divide-stitch-primary/10 border border-stitch-primary/10">
            {city.transportOptions.map((option) => {
              const badge = transportBadge(option);
              return (
                <div
                  key={option.mode}
                  className="flex items-center justify-between gap-4 bg-stitch-neutral px-4 py-3"
                >
                  <span className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
                    {option.mode}
                  </span>
                  <span
                    className={
                      badge.variant === "recom"
                        ? "bg-stitch-tertiary px-2 py-0.5 font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-neutral"
                        : badge.variant === "risk"
                          ? "font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-danger"
                          : "font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/70"
                    }
                  >
                    {badge.text}
                  </span>
                </div>
              );
            })}
          </div>
        </NumberedSection>

        {showHeat && (
          <NumberedSection number="04" name="ENVIRONMENTAL" title="Heat Advisory">
            <div className="flex gap-2">
              <FlameIcon />
              <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
                {city.heatCopy}
              </p>
            </div>
          </NumberedSection>
        )}

        <NumberedSection
          number="05"
          name="SECURITY ALERT"
          title="Anti-Fraud Protocols"
          alert
        >
          <div className="flex gap-2">
            <ShieldIcon />
            <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
              {securityAlertBody(city)}
            </p>
          </div>
        </NumberedSection>

        <section className="space-y-3">
          <div className="space-y-2">
            <div className="h-px bg-stitch-primary/10" />
            <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
              05. VERIFY BEFORE DEPARTURE
            </p>
          </div>
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
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>HOST CITY SITE</span>
            <SearchGlobeIcon />
          </a>
          <a
            href={stadiumLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>STADIUM POLICY</span>
            <ShieldAtIcon />
          </a>
        </section>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
          <button type="button" className="hover:text-stitch-primary">
            Legal
          </button>
          <button type="button" className="hover:text-stitch-primary">
            Source
          </button>
          <button type="button" className="hover:text-stitch-primary">
            Methodology
          </button>
        </div>
      </div>

    </>
  );
}
