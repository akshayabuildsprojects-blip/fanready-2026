import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import AnimatedFrictionScore from "../components/AnimatedFrictionScore.tsx";
import citiesData from "../data/cities.json";
import { geospatialRailLabel, intelligenceRef, transportBadge } from "../lib/cityGuide.ts";
import type { City, FrictionLevel, TransportOption } from "../types/city.ts";

const cities = citiesData.cities as City[];

type SectionId = "movement" | "environmental" | "security" | "bag";

const WEATHER_QUERIES: Record<string, string> = {
  dallas: "weather+in+Arlington+Texas",
  boston: "weather+in+Foxborough+Massachusetts",
  miami: "weather+in+Miami+Gardens+Florida",
  nyc: "weather+in+East+Rutherford+New+Jersey",
  kansascity: "weather+in+Kansas+City+Missouri",
  atlanta: "weather+in+Atlanta+Georgia",
  houston: "weather+in+Houston+Texas",
  losangeles: "weather+in+Inglewood+California",
  seattle: "weather+in+Seattle+Washington",
  philadelphia: "weather+in+Philadelphia+Pennsylvania",
};

function ThermometerIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" />
      <path d="M12 16v-6" strokeLinecap="round" />
    </svg>
  );
}

function heatPillClass(level: FrictionLevel): string {
  if (level === "high") return "border-stitch-danger text-stitch-danger";
  if (level === "medium") return "border-stitch-secondary text-stitch-secondary";
  return "border-stitch-tertiary text-stitch-tertiary";
}

function scamLevel(city: City): "elevated" | "standard" {
  return city.frictionIndex >= 7.5 || city.drivingRisk === "high"
    ? "elevated"
    : "standard";
}

function scamPillClass(level: "elevated" | "standard"): string {
  return level === "elevated"
    ? "border-stitch-danger text-stitch-danger"
    : "border-stitch-tertiary text-stitch-tertiary";
}

function movementStatus(option: TransportOption): {
  key: string;
  className: string;
} {
  const mode = option.mode.toLowerCase();
  if (mode.includes("driving") || mode.includes("private")) {
    return {
      key: "avoid",
      className: "bg-stitch-primary/10 text-stitch-primary/70",
    };
  }
  if (mode.includes("rideshare") || option.frictionLevel === "high") {
    return {
      key: "high_risk",
      className: "bg-stitch-secondary/30 text-stitch-primary",
    };
  }
  const badge = transportBadge(option);
  if (badge.variant === "recom") {
    return {
      key: "recom",
      className: "bg-stitch-tertiary/20 text-stitch-tertiary",
    };
  }
  return {
    key: "caution",
    className: "bg-stitch-secondary/20 text-stitch-primary",
  };
}

function railLabelKey(city: City): string {
  const label = geospatialRailLabel(city);
  if (label.includes("LIMITED")) return "limited_rail";
  if (label.includes("AVAILABLE")) return "rail_available";
  return "no_rail";
}

function weatherLink(city: City): string {
  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);
  const host = isIOS ? "maps.apple.com" : "maps.google.com";
  const query =
    WEATHER_QUERIES[city.id] ?? `weather+in+${encodeURIComponent(city.name)}`;
  return `https://${host}/?q=${query}`;
}

function CompactGeoStrip({ city }: { city: City }) {
  const { t } = useTranslation();

  return (
    <section
      className="border border-stitch-primary/10 bg-stitch-primary/[0.03] px-4 py-3"
      aria-label={`Distance from ${city.downtownCode} to ${city.stadiumCode}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
          {city.downtownCode}
        </span>
        <svg
          viewBox="0 0 220 28"
          className="h-7 min-w-0 flex-1"
          role="presentation"
        >
          <line
            x1="12"
            y1="14"
            x2="208"
            y2="14"
            stroke="var(--stitch-primary)"
            strokeWidth="1"
            strokeDasharray="6 6"
            opacity="0.3"
          />
          <circle cx="12" cy="14" r="5" fill="var(--stitch-primary)" />
          <circle cx="208" cy="14" r="5" fill="var(--stitch-secondary)" />
        </svg>
        <span className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
          {city.stadiumCode}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3 font-stitch-label text-[9px] uppercase tracking-wide">
        <span className="font-bold text-stitch-primary">
          {city.distanceMiles} {t("miles")}
        </span>
        <span className="text-stitch-danger">{t(railLabelKey(city))}</span>
      </div>
      <p className="mt-1 text-center font-stitch-body text-xs text-stitch-primary/70">
        {city.infographicCaption}
      </p>
    </section>
  );
}

function WarningPill({ text, className }: { text: string; className: string }) {
  return (
    <div
      className={`flex min-h-16 flex-1 items-center justify-center border px-2 text-center font-stitch-label text-[10px] font-bold uppercase tracking-wide ${className}`}
    >
      {text}
    </div>
  );
}

function AccordionSection({
  id,
  title,
  summary,
  expanded,
  onToggle,
  children,
}: {
  id: SectionId;
  title: string;
  summary: ReactNode;
  expanded: boolean;
  onToggle: (id: SectionId) => void;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden border border-stitch-primary/10 bg-stitch-neutral">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1 space-y-3">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            {title}
          </p>
          <div>{summary}</div>
        </div>
        <span
          className={`mt-0.5 font-stitch-headline text-2xl leading-none text-stitch-primary transition-transform duration-200 ${
            expanded ? "rotate-90" : ""
          }`}
          aria-hidden
        >
          ›
        </span>
      </button>
      <div
        className={`grid transition-all duration-200 ease-out ${
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 border-t border-stitch-primary/10 px-4 pb-4 pt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CityPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const city = cities.find((c) => c.id === id);
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(null);

  if (!city) {
    return (
      <>
        <div className="-mx-4 space-y-4 px-4 pb-28">
          <p className="font-stitch-body text-sm text-stitch-primary/80">
            {t("city_not_found")}
          </p>
          <Link
            to="/cities"
            className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary underline-offset-2 hover:underline"
          >
            {t("back_to_city_friction_index")}
          </Link>
        </div>
      </>
    );
  }

  const scam = scamLevel(city);
  const bagPolicy =
    city.dynamicFields.bagPolicy ??
    t("bag_policy_fallback");
  const shuttleLink = city.dynamicFields.shuttleLink ?? "#";
  const toggleSection = (section: SectionId) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  return (
    <>
      <div className="-mx-4 space-y-5 px-4 pb-28">
        <header className="relative border-b-4 border-stitch-primary pb-5 pr-24">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-[0.2em] text-stitch-primary">
            {t("intelligence_report")}
          </p>
          <p className="mt-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary/60">
            REF: {intelligenceRef(city)}
          </p>
          <h1 className="mt-4 font-stitch-headline text-3xl font-semibold uppercase text-stitch-primary">
            {city.name}
          </h1>
          <p className="mt-1 font-stitch-label text-[10px] font-bold uppercase tracking-[0.16em] text-stitch-primary/75">
            {city.stadium}
          </p>
          <div className="absolute right-0 top-0 border-2 border-stitch-danger px-4 py-2 text-center text-stitch-danger">
            <p className="font-stitch-headline text-4xl font-semibold leading-none">
              <AnimatedFrictionScore score={city.frictionIndex} />
            </p>
            <p className="mt-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide">
              {t("friction")}
            </p>
          </div>
          <div className="mt-5 space-y-1">
            <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
              {t("primary_friction")}
            </p>
            <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
              <strong className="text-stitch-primary">
                {city.primaryFriction}.
              </strong>{" "}
              {city.advisory}
            </p>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-2">
          <WarningPill
            text={t(`heat_${city.heatRisk}`)}
            className={heatPillClass(city.heatRisk)}
          />
          <WarningPill
            text={t(`scam_${scam}`)}
            className={scamPillClass(scam)}
          />
          <WarningPill
            text={t("bags_check")}
            className="border-stitch-primary/20 text-stitch-primary/70"
          />
        </section>

        <CompactGeoStrip city={city} />

        <div className="space-y-3">
          <AccordionSection
            id="movement"
            title={t("movement")}
            expanded={expandedSection === "movement"}
            onToggle={toggleSection}
            summary={
              <div className="space-y-2">
                {city.transportOptions.map((option) => {
                  const status = movementStatus(option);
                  return (
                    <div
                      key={option.mode}
                      className="flex items-center justify-between gap-3"
                    >
                      <span className="font-stitch-label text-[10px] font-bold uppercase tracking-[0.14em] text-stitch-primary">
                        {option.mode}
                      </span>
                      <span className="min-w-14 flex-1 border-t border-stitch-primary/15" />
                      <span
                        className={`shrink-0 px-2 py-1 font-stitch-label text-[9px] font-bold uppercase tracking-wide ${status.className}`}
                      >
                        {t(status.key)}
                      </span>
                    </div>
                  );
                })}
              </div>
            }
          >
            {city.transportOptions.map((option) => (
              <div
                key={option.mode}
                className="border-t border-stitch-primary/10 pt-3 first:border-t-0 first:pt-0"
              >
                <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
                  {option.mode}
                </p>
                <p className="mt-1">{option.warning}</p>
                <p className="mt-1 text-stitch-primary">
                  <strong>{t("action")}:</strong> {option.action}
                </p>
              </div>
            ))}
          </AccordionSection>

          <AccordionSection
            id="environmental"
            title={t("environmental")}
            expanded={expandedSection === "environmental"}
            onToggle={toggleSection}
            summary={
              <p className="font-stitch-body text-sm text-stitch-primary/75">
                <span className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
                  {t(`heat_${city.heatRisk}`)}
                </span>{" "}
                — {city.heatCopy}
              </p>
            }
          >
            <p>{city.heatCopy}</p>
            <a
              href={weatherLink(city)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-3 border border-stitch-primary bg-transparent px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
              style={{ borderRadius: "var(--radius-stitch-button)" }}
            >
              <span className="flex items-center gap-2">
                <ThermometerIcon />
                {t("check_weather")}
              </span>
              <span aria-hidden>→</span>
            </a>
          </AccordionSection>

          <AccordionSection
            id="security"
            title={t("security")}
            expanded={expandedSection === "security"}
            onToggle={toggleSection}
            summary={
              <p className="font-stitch-body text-sm text-stitch-primary/75">
                <span className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-danger">
                  {t("scam_alert")}: {t(`scam_${scam}`)}
                </span>{" "}
                — {t("security_summary")}
              </p>
            }
          >
            <p>{t("security_advisory")}</p>
          </AccordionSection>

          <AccordionSection
            id="bag"
            title={t("bag_policy")}
            expanded={expandedSection === "bag"}
            onToggle={toggleSection}
            summary={
              <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary/75">
                {t("bag_policy_check")}
              </p>
            }
          >
            <p>{bagPolicy}</p>
          </AccordionSection>
        </div>

        <section className="space-y-3">
          <a
            href={shuttleLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between gap-2 bg-stitch-primary px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>{t("verify_shuttle")}</span>
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-2 border border-stitch-primary bg-transparent px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            <span>{t("download_maps")}</span>
            <span aria-hidden>→</span>
          </button>
        </section>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
          <button type="button" className="hover:text-stitch-primary">
            {t("legal")}
          </button>
          <span aria-hidden>|</span>
          <button type="button" className="hover:text-stitch-primary">
            {t("source")}
          </button>
          <span aria-hidden>|</span>
          <button type="button" className="hover:text-stitch-primary">
            {t("methodology")}
          </button>
        </div>
      </div>
    </>
  );
}
