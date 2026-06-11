import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import citiesData from "../data/cities.json";
import { readSelectedCities, writeSelectedCities } from "../lib/selectedCities.ts";
import {
  readSelectedMatches,
  writeSelectedMatches,
} from "../lib/selectedMatches.ts";

type Step = 1 | 2;
type Match = (typeof citiesData.cities)[number]["matches"][number];

const HOST_CITIES = citiesData.cities;

function ProgressHeader({ step }: { step: Step }) {
  return (
    <div className="space-y-3">
      <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
        STEP {step} OF 2
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-stitch-primary/10">
        <div
          className="h-full rounded-full bg-stitch-primary transition-all duration-300 ease-out"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>
    </div>
  );
}

function formatMatchDate(date: string): string {
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

function selectedCityLabel(cityId: string): string {
  return HOST_CITIES.find((city) => city.id === cityId)?.name ?? cityId;
}

function MatchCard({
  match,
  selected,
  onToggle,
}: {
  match: Match;
  selected: boolean;
  onToggle: () => void;
}) {
  const isConfirmed = match.confirmed;
  const stageLabel = match.stage.toUpperCase();
  const teams = `${match.home} ${isConfirmed ? "vs" : "v"} ${match.away}`;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={[
        "w-full border p-4 text-left transition-colors duration-150",
        selected
          ? "border-stitch-primary bg-stitch-primary text-stitch-neutral"
          : isConfirmed
            ? "border-stitch-primary/10 bg-stitch-neutral text-stitch-primary"
            : "border-stitch-primary/10 bg-stitch-primary/[0.03] text-stitch-primary/75",
      ].join(" ")}
      style={{ borderRadius: "var(--radius-stitch-card)" }}
    >
      <p
        className={[
          "font-stitch-label text-[10px] font-bold uppercase tracking-wide",
          selected ? "text-stitch-neutral/70" : "text-stitch-secondary",
        ].join(" ")}
      >
        {stageLabel}
      </p>
      <p className="mt-2 font-stitch-headline text-xl font-semibold">
        {formatMatchDate(match.date)}
      </p>
      {isConfirmed && (
        <p
          className={[
            "mt-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide",
            selected ? "text-stitch-neutral/70" : "text-stitch-primary/60",
          ].join(" ")}
        >
          {match.time} {match.timezone}
        </p>
      )}
      <p className="mt-3 font-stitch-body text-sm font-semibold">{teams}</p>
      {!isConfirmed && (
        <p
          className={[
            "mt-2 font-stitch-body text-xs leading-relaxed",
            selected ? "text-stitch-neutral/70" : "text-stitch-primary/55",
          ].join(" ")}
        >
          Teams confirmed as tournament progresses
        </p>
      )}
    </button>
  );
}

export default function BriefPage() {
  const navigate = useNavigate();
  const savedCityIds = useMemo(() => readSelectedCities(), []);
  const savedMatchIds = useMemo(() => readSelectedMatches(), []);
  const isEditing = savedCityIds.length > 0 || savedMatchIds.length > 0;
  const [step, setStep] = useState<Step>(1);
  const [selectedCities, setSelectedCities] = useState<string[]>(() => {
    const availableIds = new Set(HOST_CITIES.map((city) => city.id));

    return [...new Set(savedCityIds)].filter((id) => availableIds.has(id));
  });
  const [selectedMatches, setSelectedMatches] = useState<string[]>(() => {
    const availableMatchIds = new Set(
      HOST_CITIES.flatMap((city) => city.matches.map((match) => match.id)),
    );

    return [...new Set(savedMatchIds)].filter((id) => availableMatchIds.has(id));
  });
  const [cityError, setCityError] = useState(false);
  const [matchError, setMatchError] = useState(false);

  const selectedCitySet = useMemo(
    () => new Set(selectedCities),
    [selectedCities],
  );
  const selectedMatchSet = useMemo(
    () => new Set(selectedMatches),
    [selectedMatches],
  );
  const visibleCities = useMemo(
    () => HOST_CITIES.filter((city) => selectedCitySet.has(city.id)),
    [selectedCitySet],
  );

  const toggleCity = (cityId: string) => {
    setCityError(false);
    setSelectedCities((current) => {
      if (!current.includes(cityId)) return [...current, cityId];

      const cityMatches =
        HOST_CITIES.find((city) => city.id === cityId)?.matches.map(
          (match) => match.id,
        ) ?? [];
      const cityMatchSet = new Set(cityMatches);
      setSelectedMatches((matches) =>
        matches.filter((matchId) => !cityMatchSet.has(matchId)),
      );
      return current.filter((id) => id !== cityId);
    });
  };

  const removeCity = (cityId: string) => {
    setCityError(false);
    setSelectedCities((current) => current.filter((id) => id !== cityId));
    const cityMatchIds =
      HOST_CITIES.find((city) => city.id === cityId)?.matches.map(
        (match) => match.id,
      ) ?? [];
    const cityMatchSet = new Set(cityMatchIds);
    setSelectedMatches((matches) =>
      matches.filter((matchId) => !cityMatchSet.has(matchId)),
    );
  };

  const toggleMatch = (matchId: string) => {
    setMatchError(false);
    setSelectedMatches((current) =>
      current.includes(matchId)
        ? current.filter((id) => id !== matchId)
        : [...current, matchId],
    );
  };

  const goBack = () => {
    if (step === 1) return;
    setStep((current) => (current - 1) as Step);
  };

  const goNext = () => {
    if (step === 1) {
      if (selectedCities.length === 0) {
        setCityError(true);
        return;
      }
      setCityError(false);
      setStep(2);
    }
  };

  const handleGenerate = () => {
    if (selectedMatches.length === 0) {
      setMatchError(true);
      setStep(2);
      return;
    }

    writeSelectedCities(selectedCities);
    writeSelectedMatches(selectedMatches);
    localStorage.removeItem("tripAnswers");
    navigate("/my-brief");
  };

  return (
    <>
      <div className="-mx-4 flex max-h-[calc(100vh-9rem)] flex-col px-4 pb-36">
        <div className="shrink-0">
          <ProgressHeader step={step} />
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-4">
          <div
            key={step}
            className="space-y-6 animate-[briefStepFade_220ms_ease-out]"
          >
            {step === 1 && (
              <section className="space-y-5">
                <div>
                  <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
                    Which cities are you attending?
                  </h1>
                  <p className="mt-2 font-stitch-body text-sm text-stitch-primary/70">
                    Select all that apply.
                  </p>
                </div>

                {selectedCities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCities.map((cityId) => (
                      <button
                        key={cityId}
                        type="button"
                        onClick={() => removeCity(cityId)}
                        className="inline-flex items-center gap-2 bg-stitch-primary px-3 py-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                        style={{ borderRadius: "var(--radius-stitch-button)" }}
                        aria-label={`Remove ${selectedCityLabel(cityId)}`}
                      >
                        <span>{selectedCityLabel(cityId)}</span>
                        <span aria-hidden>x</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {HOST_CITIES.map((city) => {
                    const selected = selectedCitySet.has(city.id);

                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => toggleCity(city.id)}
                        className={
                          selected
                            ? "border border-stitch-primary bg-stitch-primary px-2 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                            : "border border-stitch-primary/10 bg-stitch-neutral px-2 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
                        }
                        style={{ borderRadius: "var(--radius-stitch-button)" }}
                        aria-pressed={selected}
                      >
                        {city.name}
                      </button>
                    );
                  })}
                </div>

                {cityError && (
                  <p className="font-stitch-body text-sm leading-relaxed text-stitch-danger">
                    Select at least one city to continue.
                  </p>
                )}
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6">
                <div>
                  <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
                    Which matches are you attending?
                  </h1>
                  <p className="mt-2 font-stitch-body text-sm leading-relaxed text-stitch-primary/70">
                    Select all matches you have tickets for or are considering.
                  </p>
                </div>

                <div className="space-y-6">
                  {visibleCities.map((city) => (
                    <div key={city.id} className="space-y-3">
                      <h2 className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
                        {city.name}
                      </h2>
                      <div className="space-y-3">
                        {city.matches.map((match) => (
                          <MatchCard
                            key={match.id}
                            match={match}
                            selected={selectedMatchSet.has(match.id)}
                            onToggle={() => toggleMatch(match.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {matchError && (
                  <p className="font-stitch-body text-sm leading-relaxed text-stitch-danger">
                    Select at least one match to continue.
                  </p>
                )}
              </section>
            )}

          </div>
        </div>
      </div>

      <div
        className="fixed inset-x-0 z-40 border-t border-stitch-primary/10 bg-stitch-neutral px-4 py-3"
        style={{ bottom: "calc(4.25rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-5xl space-y-3">
          {step === 2 ? (
            <>
              <button
                type="button"
                onClick={goBack}
                className="w-full border border-stitch-primary bg-transparent px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full bg-stitch-primary px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                {isEditing
                  ? "UPDATE MY READINESS BRIEF"
                  : "GENERATE MY READINESS BRIEF"}
              </button>
              <p className="text-center font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
                ANALYSIS ENGINE V4.0.0 READY FOR DEPLOYMENT
              </p>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="border border-stitch-primary bg-transparent px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary disabled:opacity-40"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                BACK
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-stitch-primary px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                Continue →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>
        {`@keyframes briefStepFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }`}
      </style>
    </>
  );
}
