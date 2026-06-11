import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReportIssueLink from "../components/ReportIssueLink.tsx";
import citiesData from "../data/cities.json";
import { readSelectedCities } from "../lib/selectedCities.ts";
import { readSelectedMatches } from "../lib/selectedMatches.ts";
import type { City, FrictionLevel, Match, TransportOption } from "../types/city.ts";

type BriefTab = "pre" | "during" | "post";

interface SelectedMatchEntry {
  city: City;
  match: Match;
}

const TAB_LABELS: { id: BriefTab; label: string }[] = [
  { id: "pre", label: "PRE-MATCH" },
  { id: "during", label: "DURING" },
  { id: "post", label: "POST-MATCH" },
];

const FRICTION_ORDER: Record<FrictionLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const PREFIX_TO_CITY_ID: Record<string, string> = {
  dal: "dallas",
  bos: "boston",
  mia: "miami",
  nyc: "nyc",
  kc: "kansascity",
  atl: "atlanta",
  hou: "houston",
  lax: "losangeles",
  sea: "seattle",
  phi: "philadelphia",
  tor: "toronto",
  van: "vancouver",
  mex: "mexicocity",
  gdl: "guadalajara",
  mty: "monterrey",
};

const CITIES = citiesData.cities as City[];

function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMatchDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(parsedDate)
    .replace(",", "");
}

function resolveSelectedMatches(matchIds: string[]): SelectedMatchEntry[] {
  return matchIds
    .map((matchId) => {
      const prefix = matchId.split("-")[0];
      const cityId = PREFIX_TO_CITY_ID[prefix];
      const city = CITIES.find((candidate) => candidate.id === cityId);
      const match = city?.matches.find((candidate) => candidate.id === matchId);

      if (!city || !match) return null;
      return { city, match };
    })
    .filter((entry): entry is SelectedMatchEntry => entry !== null)
    .sort((a, b) => a.match.date.localeCompare(b.match.date));
}

function frictionBadgeClasses(score: number) {
  if (score >= 8.5) {
    return "border-stitch-danger/30 bg-stitch-danger/10 text-stitch-danger";
  }
  if (score >= 7.5) {
    return "border-stitch-secondary/40 bg-stitch-secondary/15 text-stitch-secondary";
  }
  return "border-stitch-tertiary/30 bg-stitch-tertiary/10 text-stitch-tertiary";
}

function transportBadge(option: TransportOption) {
  const combinedText = `${option.mode} ${option.warning} ${option.action}`.toLowerCase();
  if (combinedText.includes("avoid")) return "AVOID";
  if (option.frictionLevel === "low") return "RECOM.";
  if (option.frictionLevel === "high") return "HIGH RISK";
  return "MODERATE";
}

function transportBadgeClasses(label: string) {
  if (label === "RECOM.") return "bg-stitch-tertiary/10 text-stitch-tertiary";
  if (label === "HIGH RISK" || label === "AVOID") {
    return "bg-stitch-danger/10 text-stitch-danger";
  }
  return "bg-stitch-secondary/15 text-stitch-secondary";
}

function rankedTransportOptions(city: City) {
  return [...city.transportOptions].sort(
    (a, b) => FRICTION_ORDER[a.frictionLevel] - FRICTION_ORDER[b.frictionLevel],
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/55">
        {label}
      </p>
      <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/85">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-stitch-primary/10 pt-4">
      <h3 className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-inside list-disc space-y-1 font-stitch-body text-sm leading-relaxed text-stitch-primary/85">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function TransportList({
  city,
  label,
}: {
  city: City;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <p className="font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/55">
        {label}
      </p>
      <div className="space-y-2">
        {rankedTransportOptions(city).map((option) => {
          const badge = transportBadge(option);

          return (
            <div
              key={`${option.mode}-${option.frictionLevel}`}
              className="flex items-center justify-between gap-3 border border-stitch-primary/10 bg-stitch-neutral/70 px-3 py-3"
            >
              <span className="font-stitch-body text-sm text-stitch-primary/85">
                {option.mode}
              </span>
              <span
                className={`shrink-0 px-2 py-1 font-stitch-label text-[8px] font-bold uppercase tracking-wide ${transportBadgeClasses(
                  badge,
                )}`}
              >
                {badge}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DrivingDisclosure({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="border border-stitch-primary/10 bg-stitch-primary/[0.02] p-4">
      <summary className="cursor-pointer font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
        {title}
      </summary>
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  );
}

function WarningBanner({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "danger" | "heat";
}) {
  const classes =
    variant === "danger"
      ? "border-stitch-danger/20 bg-stitch-danger/10 text-stitch-danger"
      : "border-stitch-secondary/25 bg-stitch-secondary/15 text-stitch-primary";

  return (
    <div
      className={`border px-4 py-3 font-stitch-body text-sm leading-relaxed ${classes}`}
    >
      {children}
    </div>
  );
}

function PreMatchContent({ city }: { city: City }) {
  const drivingOption = city.transportOptions.find((option) =>
    option.mode.toLowerCase().includes("driving"),
  );
  const paymentValue = city.stadiumRules.cashless
    ? "Cashless stadium"
    : city.stadiumFood.paymentMethods.join(", ");

  return (
    <div className="space-y-5">
      <Section title="ARRIVAL PLANNING">
        <div className="grid gap-4 sm:grid-cols-3">
          <FieldRow
            label="RECOMMENDED ARRIVAL"
            value={city.queueTimes.recommendedArrival}
          />
          <FieldRow label="GATES OPEN" value={city.queueTimes.gateOpenTime} />
          <FieldRow
            label="ESTIMATED QUEUE WAIT"
            value={city.queueTimes.estimatedQueueWait}
          />
        </div>
        <p className="font-stitch-body text-xs leading-relaxed text-stitch-primary/55">
          {city.queueTimes.source}
        </p>
      </Section>

      <Section title="TRANSPORT">
        <TransportList city={city} label="TRANSPORT OPTIONS" />
      </Section>

      <Section title="DRIVING">
        <DrivingDisclosure title="DRIVING OPTION">
          <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {drivingOption
              ? `${drivingOption.warning} ${drivingOption.action}`
              : city.postMatchInfo.drivingExitAdvice}
          </p>
        </DrivingDisclosure>
      </Section>

      <Section title="STADIUM ENTRY">
        <div className="space-y-4">
          <FieldRow label="BAG POLICY" value={city.stadiumRules.bagPolicy} />
          <div className="space-y-2">
            <p className="font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/55">
              PROHIBITED ITEMS
            </p>
            <BulletList items={city.stadiumRules.prohibitedItems} />
          </div>
          <FieldRow label="ID REQUIRED" value={city.stadiumRules.idRequired} />
          <FieldRow label="PAYMENT" value={paymentValue} />
        </div>
      </Section>
    </div>
  );
}

function DuringContent({ city }: { city: City }) {
  return (
    <div className="space-y-5">
      <Section title="FOOD AND DRINKS">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/55">
              AVAILABLE OPTIONS
            </p>
            <BulletList items={city.stadiumFood.options} />
          </div>
          <div className="space-y-2">
            <p className="font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/55">
              PAYMENT ACCEPTED
            </p>
            <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/85">
              {city.stadiumFood.paymentMethods.join(", ")}
            </p>
          </div>
          {city.stadiumRules.cashless && (
            <WarningBanner variant="danger">
              CASHLESS STADIUM — No cash accepted at any vendor inside.
            </WarningBanner>
          )}
          <FieldRow label="NOTES" value={city.stadiumFood.notes} />
        </div>
      </Section>

      <Section title="STADIUM RULES">
        <div className="space-y-4">
          <FieldRow
            label="ALCOHOL POLICY"
            value={city.stadiumRules.alcoholPolicy}
          />
          <FieldRow label="OUTSIDE FOOD" value={city.stadiumRules.foodPolicy} />
        </div>
      </Section>
    </div>
  );
}

function PostMatchContent({ city }: { city: City }) {
  const showHeatReminder = city.heatRisk === "high" || city.heatRisk === "medium";

  return (
    <div className="space-y-5">
      <Section title="EXITING">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow
            label="ESTIMATED EXIT TIME"
            value={city.postMatchInfo.estimatedExitTime}
          />
          <FieldRow
            label="TRANSPORT WAIT"
            value={city.postMatchInfo.transportWaitEstimate}
          />
        </div>
      </Section>

      <Section title="TRANSPORT">
        <TransportList city={city} label="TRANSPORT OPTIONS POST-MATCH" />
      </Section>

      <Section title="DRIVING">
        <FieldRow
          label="DRIVING EXIT"
          value={city.postMatchInfo.drivingExitAdvice}
        />
      </Section>

      {showHeatReminder && (
        <WarningBanner variant="heat">{city.heatCopy}</WarningBanner>
      )}
    </div>
  );
}

function MatchCard({
  entry,
  isPast,
  isExpanded,
  activeTab,
  onToggleExpanded,
  onTabChange,
}: {
  entry: SelectedMatchEntry;
  isPast: boolean;
  isExpanded: boolean;
  activeTab: BriefTab;
  onToggleExpanded: () => void;
  onTabChange: (tab: BriefTab) => void;
}) {
  const { city, match } = entry;
  const teams = match.confirmed
    ? `${match.home} vs ${match.away}`
    : `${match.home} v ${match.away} — Teams confirmed as tournament progresses`;

  return (
    <article
      className={[
        "relative overflow-hidden border border-stitch-primary/10 transition-colors duration-150",
        isExpanded ? "bg-stitch-primary/[0.04]" : "bg-stitch-neutral",
      ].join(" ")}
      style={{ borderRadius: "var(--radius-stitch-card)" }}
    >
      <div className={isPast ? "opacity-40" : undefined}>
        <button
          type="button"
          onClick={onToggleExpanded}
          className="flex w-full items-start justify-between gap-4 p-5 text-left"
          aria-expanded={isExpanded}
        >
          <div className="min-w-0 flex-1">
            <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
              {match.stage.toUpperCase()}
            </p>
            <p className="mt-2 font-stitch-headline text-2xl font-semibold text-stitch-primary">
              {formatMatchDate(match.date)}
            </p>
            <p className="mt-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary/60">
              {match.time} {match.timezone}
            </p>
            <p className="mt-3 font-stitch-body text-sm font-semibold leading-relaxed text-stitch-primary">
              {teams}
            </p>
            <p className="mt-2 font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary/55">
              {city.name} / {city.stadium}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <span
              className={`border px-2 py-1 font-stitch-label text-[9px] font-bold uppercase tracking-wide ${frictionBadgeClasses(
                city.frictionIndex,
              )}`}
            >
              {city.frictionIndex.toFixed(1)}
            </span>
            <span
              className={`font-stitch-body text-2xl leading-none transition-transform duration-150 ${
                isExpanded ? "rotate-90" : ""
              }`}
              aria-hidden
            >
              ›
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-stitch-primary/10 px-5 pb-5">
            <div className="flex gap-2 overflow-x-auto py-4">
              {TAB_LABELS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className={[
                    "shrink-0 border-b-2 px-2 pb-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide",
                    activeTab === tab.id
                      ? "border-stitch-primary text-stitch-primary"
                      : "border-transparent text-stitch-primary/50",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "pre" && <PreMatchContent city={city} />}
            {activeTab === "during" && <DuringContent city={city} />}
            {activeTab === "post" && <PostMatchContent city={city} />}

            <footer className="mt-5 space-y-1 border-t border-stitch-primary/10 pt-4">
              <p className="font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/55">
                Data last reviewed: {city.dynamicFields.lastUpdated}
              </p>
              <p className="font-stitch-body text-xs leading-relaxed text-stitch-primary/60">
                Always verify through official sources before matchday.
              </p>
            </footer>
          </div>
        )}
      </div>

      {isPast && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-stitch-neutral/35" />
          <div className="pointer-events-none absolute right-4 top-4 border border-stitch-primary/15 bg-stitch-neutral/95 px-2 py-1 font-stitch-label text-[8px] font-bold uppercase tracking-wide text-stitch-primary/70">
            MATCH PASSED
          </div>
        </>
      )}
    </article>
  );
}

export default function MyBriefPage() {
  const selectedCityIds = useMemo(() => readSelectedCities(), []);
  const selectedMatchIds = useMemo(() => readSelectedMatches(), []);
  const selectedMatches = useMemo(
    () => resolveSelectedMatches(selectedMatchIds),
    [selectedMatchIds],
  );
  const [expandedMatches, setExpandedMatches] = useState<Set<string>>(new Set());
  const [activeTabs, setActiveTabs] = useState<Record<string, BriefTab>>({});
  const matchRefs = useRef<Record<string, HTMLElement | null>>({});
  const today = useMemo(() => getTodayString(), []);
  const firstUpcomingMatchId = useMemo(
    () => selectedMatches.find((entry) => entry.match.date >= today)?.match.id,
    [selectedMatches, today],
  );
  const cityCount = useMemo(() => {
    const selectedIds = selectedCityIds.filter((cityId) =>
      selectedMatches.some((entry) => entry.city.id === cityId),
    );
    const matchCityIds = selectedMatches.map((entry) => entry.city.id);

    return new Set([...selectedIds, ...matchCityIds]).size;
  }, [selectedCityIds, selectedMatches]);

  useEffect(() => {
    if (!firstUpcomingMatchId) return;

    window.setTimeout(() => {
      matchRefs.current[firstUpcomingMatchId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  }, [firstUpcomingMatchId]);

  const toggleExpanded = (matchId: string) => {
    setExpandedMatches((current) => {
      const next = new Set(current);
      if (next.has(matchId)) {
        next.delete(matchId);
      } else {
        next.add(matchId);
      }
      return next;
    });
    setActiveTabs((current) => ({ ...current, [matchId]: current[matchId] ?? "pre" }));
  };

  const setActiveTab = (matchId: string, tab: BriefTab) => {
    setActiveTabs((current) => ({ ...current, [matchId]: tab }));
  };

  if (selectedMatchIds.length === 0 || selectedMatches.length === 0) {
    return (
      <div className="-mx-4 space-y-5 px-4 pb-28">
        <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
          No brief found. Complete the readiness checker first.
        </p>
        <Link
          to="/brief"
          className="inline-flex items-center justify-center bg-stitch-primary px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
          style={{ borderRadius: "var(--radius-stitch-button)" }}
        >
          ← BUILD YOUR BRIEF
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 space-y-8 px-4 pb-28">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            CONFIDENTIAL INTELLIGENCE REPORT
          </p>
          <h1 className="mt-2 font-stitch-headline text-3xl font-semibold text-stitch-primary">
            Your Matchday Readiness Brief
          </h1>
          <p className="mt-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary/60">
            {selectedMatches.length} matches across {cityCount} cities
          </p>
        </div>
        <Link
          to="/brief"
          className="shrink-0 border border-stitch-primary bg-transparent px-3 py-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
          style={{ borderRadius: "var(--radius-stitch-button)" }}
        >
          EDIT BRIEF
        </Link>
      </header>

      <section className="space-y-4">
        {selectedMatches.map((entry) => (
          <div
            key={entry.match.id}
            ref={(element) => {
              matchRefs.current[entry.match.id] = element;
            }}
          >
            <MatchCard
              entry={entry}
              isPast={entry.match.date < today}
              isExpanded={expandedMatches.has(entry.match.id)}
              activeTab={activeTabs[entry.match.id] ?? "pre"}
              onToggleExpanded={() => toggleExpanded(entry.match.id)}
              onTabChange={(tab) => setActiveTab(entry.match.id, tab)}
            />
          </div>
        ))}
      </section>

      <footer className="space-y-4 border-t border-stitch-primary/10 pt-6">
        <Link
          to="/brief"
          className="inline-flex w-full items-center justify-center border border-stitch-primary bg-transparent px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
          style={{ borderRadius: "var(--radius-stitch-button)" }}
        >
          EDIT BRIEF
        </Link>
        <p className="font-stitch-body text-xs leading-relaxed text-stitch-primary/60">
          This unofficial readiness brief is for planning support only. Matchday
          operations, stadium policies, transport service, and entry requirements
          can change. Always verify details through official sources before travel.
        </p>
        <ReportIssueLink />
      </footer>
    </div>
  );
}
