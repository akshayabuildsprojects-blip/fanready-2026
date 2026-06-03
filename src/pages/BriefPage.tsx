import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  readSelectedCities,
  writeSelectedCities,
} from "../lib/selectedCities.ts";
import { readTripAnswers, writeTripAnswers } from "../lib/tripAnswers.ts";
import type {
  CityLogistics,
  StadiumTransit,
  StayLocation,
  TripAnswers,
} from "../types/tripAnswers.ts";

const HOST_CITIES = [
  { id: "new-york-nj", label: "NEW YORK/NJ" },
  { id: "mexico-city", label: "MEXICO CITY" },
  { id: "toronto", label: "TORONTO" },
  { id: "los-angeles", label: "LOS ANGELES" },
  { id: "dallas", label: "DALLAS" },
  { id: "miami", label: "MIAMI" },
  { id: "vancouver", label: "VANCOUVER" },
  { id: "atlanta", label: "ATLANTA" },
  { id: "boston", label: "BOSTON" },
  { id: "houston", label: "HOUSTON" },
  { id: "kansas-city", label: "KANSAS CITY" },
  { id: "seattle", label: "SEATTLE" },
  { id: "philadelphia", label: "PHILADELPHIA" },
] as const;

const CITY_ID_FROM_FRICTION_INDEX: Record<string, string> = {
  nyc: "new-york-nj",
  losangeles: "los-angeles",
  dallas: "dallas",
  miami: "miami",
  atlanta: "atlanta",
  boston: "boston",
  houston: "houston",
  kansascity: "kansas-city",
  seattle: "seattle",
  philadelphia: "philadelphia",
};

const STAY_OPTIONS: StayLocation[] = [
  "Near stadium",
  "City center / downtown",
  "Near airport",
  "Suburb / outside city",
  "Not booked yet",
  "Not sure",
];

const STADIUM_TRANSIT_OPTIONS: StadiumTransit[] = [
  "Public transit (train/bus)",
  "Rideshare (Uber/Lyft)",
  "Official shuttle",
  "Driving / personal vehicle",
  "Private transfer",
  "Not sure yet",
];

const DEFAULT_CITY_DETAILS: CityLogistics = {
  stayLocation: "Not booked yet",
  stadiumTransit: "Not sure yet",
  localConfidence: "low",
};

function mapFrictionIndexIds(ids: string[]): string[] {
  const mapped = ids
    .map((id) =>
      HOST_CITIES.some((city) => city.id === id)
        ? id
        : CITY_ID_FROM_FRICTION_INDEX[id],
    )
    .filter((id): id is string => Boolean(id));
  return [...new Set(mapped)];
}

function cityLabel(cityId: string): string {
  return HOST_CITIES.find((city) => city.id === cityId)?.label ?? cityId;
}

function createInitialCityDetails(
  savedAnswers: TripAnswers | null,
): Record<string, CityLogistics> {
  const details: Record<string, CityLogistics> = {};

  for (const cityId of HOST_CITIES.map((city) => city.id)) {
    details[cityId] = {
      ...DEFAULT_CITY_DETAILS,
      ...savedAnswers?.cityDetails?.[cityId],
    };
  }

  return details;
}

function StepBadge({ step }: { step: string }) {
  return (
    <span className="inline-block bg-stitch-primary px-2 py-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral">
      {step}
    </span>
  );
}

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none border border-stitch-primary/10 bg-stitch-neutral px-4 py-3 pr-10 font-stitch-body text-sm text-stitch-primary"
          style={{ borderRadius: "var(--radius-stitch-button)" }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-stitch-body text-stitch-primary/50"
          aria-hidden
        >
          ▾
        </span>
      </div>
    </div>
  );
}

export default function BriefPage() {
  const navigate = useNavigate();
  const savedAnswers = useMemo(() => readTripAnswers(), []);
  const isEditing = Boolean(savedAnswers);
  const [hostCities, setHostCities] = useState<string[]>(() =>
    savedAnswers?.hostCities?.length
      ? mapFrictionIndexIds(savedAnswers.hostCities)
      : mapFrictionIndexIds(readSelectedCities()),
  );
  const [cityDetails, setCityDetails] = useState<Record<string, CityLogistics>>(
    () => createInitialCityDetails(savedAnswers),
  );
  const [activeCityIndex, setActiveCityIndex] = useState(0);
  const [visitingFromAbroad, setVisitingFromAbroad] = useState(
    () => savedAnswers?.visitingFromAbroad ?? false,
  );
  const [crossingBorders, setCrossingBorders] = useState(
    () => savedAnswers?.crossingBorders ?? false,
  );
  const [drivingVehicle, setDrivingVehicle] = useState(
    () => savedAnswers?.drivingVehicle ?? false,
  );
  const [hasCitySelectionError, setHasCitySelectionError] = useState(false);

  useEffect(() => {
    if (activeCityIndex > Math.max(hostCities.length - 1, 0)) {
      setActiveCityIndex(Math.max(hostCities.length - 1, 0));
    }
  }, [activeCityIndex, hostCities.length]);

  const activeCityId = hostCities[activeCityIndex];
  const activeCityDetails = activeCityId
    ? cityDetails[activeCityId] ?? DEFAULT_CITY_DETAILS
    : DEFAULT_CITY_DETAILS;

  const toggleHostCity = (cityId: string) => {
    setHasCitySelectionError(false);
    setHostCities((prev) => {
      if (prev.includes(cityId)) {
        return prev.filter((id) => id !== cityId);
      }
      setCityDetails((details) => ({
        ...details,
        [cityId]: details[cityId] ?? DEFAULT_CITY_DETAILS,
      }));
      return [...prev, cityId];
    });
  };

  const removeHostCity = (cityId: string) => {
    setHostCities((prev) => prev.filter((id) => id !== cityId));
  };

  const updateCityDetail = <Key extends keyof CityLogistics>(
    cityId: string,
    key: Key,
    value: CityLogistics[Key],
  ) => {
    setCityDetails((details) => ({
      ...details,
      [cityId]: {
        ...(details[cityId] ?? DEFAULT_CITY_DETAILS),
        [key]: value,
      },
    }));
  };

  const handleGenerate = () => {
    if (hostCities.length === 0) {
      setHasCitySelectionError(true);
      return;
    }

    const selectedCityDetails = hostCities.reduce<Record<string, CityLogistics>>(
      (details, cityId) => {
        details[cityId] = cityDetails[cityId] ?? DEFAULT_CITY_DETAILS;
        return details;
      },
      {},
    );

    const answers: TripAnswers = {
      hostCities,
      cityDetails: selectedCityDetails,
      visitingFromAbroad,
      crossingBorders,
      drivingVehicle,
      generatedAt: new Date().toISOString(),
    };
    writeTripAnswers(answers);
    writeSelectedCities(hostCities);
    navigate("/my-brief");
  };

  return (
    <>
      <div className="-mx-4 space-y-10 px-4 pb-28">
        <header>
          <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
            Build your readiness brief
          </h1>
          <p className="mt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            Tell us the parts of your trip that affect matchday friction.
          </p>
        </header>

        {/* Step 01 */}
        <section
          className={
            hasCitySelectionError
              ? "space-y-4 border border-stitch-danger p-4"
              : "space-y-4"
          }
        >
          <StepBadge step="STEP 01" />
          <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
            Select your host cities
          </h2>
          {hostCities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hostCities.map((cityId) => (
                <button
                  key={cityId}
                  type="button"
                  onClick={() => removeHostCity(cityId)}
                  className="border border-stitch-primary bg-stitch-primary px-3 py-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                  style={{ borderRadius: "var(--radius-stitch-button)" }}
                  aria-label={`Remove ${cityLabel(cityId)}`}
                >
                  {cityLabel(cityId)} ×
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {HOST_CITIES.map((city) => {
              const selected = hostCities.includes(city.id);
              return (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => toggleHostCity(city.id)}
                  className={
                    selected
                      ? "border border-stitch-primary bg-stitch-primary px-2 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                      : "border border-stitch-primary/10 bg-stitch-neutral px-2 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
                  }
                  style={{ borderRadius: "var(--radius-stitch-button)" }}
                  aria-pressed={selected}
                >
                  {city.label}
                </button>
              );
            })}
          </div>
        </section>
        {hasCitySelectionError && (
          <p className="-mt-8 font-stitch-body text-sm leading-relaxed text-stitch-danger">
            Select at least one host city before generating your brief.
          </p>
        )}

        {/* Step 02 */}
        <section className="space-y-4">
          <StepBadge step="STEP 02" />
          <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
            Logistical Detail
          </h2>

          {activeCityId ? (
            <div className="space-y-4 border border-stitch-primary/10 bg-stitch-neutral p-5">
              <div className="space-y-1">
                <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
                  CITY {activeCityIndex + 1} OF {hostCities.length} —{" "}
                  {cityLabel(activeCityId)}
                </p>
                <h3 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
                  {cityLabel(activeCityId)}
                </h3>
              </div>

              <SelectField
                id={`stay-${activeCityId}`}
                label="Where are you staying?"
                value={activeCityDetails.stayLocation}
                options={STAY_OPTIONS}
                onChange={(value) =>
                  updateCityDetail(
                    activeCityId,
                    "stayLocation",
                    value as StayLocation,
                  )
                }
              />

              <SelectField
                id={`transit-${activeCityId}`}
                label="How are you getting to the stadium?"
                value={activeCityDetails.stadiumTransit}
                options={STADIUM_TRANSIT_OPTIONS}
                onChange={(value) =>
                  updateCityDetail(
                    activeCityId,
                    "stadiumTransit",
                    value as StadiumTransit,
                  )
                }
              />

              <div className="space-y-2">
                <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
                  How confident is your plan?
                </p>
                <div className="flex">
                  {(["low", "med", "high"] as const).map((level) => {
                    const active = activeCityDetails.localConfidence === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          updateCityDetail(activeCityId, "localConfidence", level)
                        }
                        className={
                          active
                            ? level === "low"
                              ? "flex-1 border border-stitch-danger bg-stitch-danger py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                              : "flex-1 border border-stitch-primary bg-stitch-primary py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                            : "flex-1 border border-stitch-primary/10 bg-stitch-neutral py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
                        }
                        aria-pressed={active}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {hostCities.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveCityIndex((index) => Math.max(index - 1, 0))
                    }
                    disabled={activeCityIndex === 0}
                    className="border border-stitch-primary bg-transparent px-3 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary disabled:opacity-40"
                    style={{ borderRadius: "var(--radius-stitch-button)" }}
                  >
                    Previous city
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveCityIndex((index) =>
                        Math.min(index + 1, hostCities.length - 1),
                      )
                    }
                    disabled={activeCityIndex === hostCities.length - 1}
                    className="border border-stitch-primary bg-transparent px-3 py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary disabled:opacity-40"
                    style={{ borderRadius: "var(--radius-stitch-button)" }}
                  >
                    Next city
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/70">
              Select a host city in Step 01 to add logistical details.
            </p>
          )}
        </section>

        {/* Step 03 */}
        <section className="space-y-4">
          <StepBadge step="STEP 03" />
          <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
            Global Friction Factors
          </h2>
          <div className="divide-y divide-stitch-primary/10 border border-stitch-primary/10">
            {[
              {
                id: "abroad",
                question: "Visiting from another country?",
                subtext: "VISA & CUSTOMS IMPLICATIONS",
                checked: visitingFromAbroad,
                onChange: setVisitingFromAbroad,
              },
              {
                id: "borders",
                question: "Crossing borders during the tournament?",
                subtext: "US / CANADA / MEXICO TRANSIT",
                checked: crossingBorders,
                onChange: setCrossingBorders,
              },
              {
                id: "driving",
                question: "Will you be driving a personal/rental vehicle?",
                subtext: "PARKING & TRAFFIC CONGESTION",
                checked: drivingVehicle,
                onChange: setDrivingVehicle,
              },
            ].map((row) => (
              <label
                key={row.id}
                className="flex cursor-pointer items-center justify-between gap-4 bg-stitch-neutral p-5"
              >
                <div>
                  <p className="font-stitch-headline text-lg font-semibold text-stitch-primary">
                    {row.question}
                  </p>
                  <p className="mt-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
                    {row.subtext}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={row.checked}
                  onChange={(e) => row.onChange(e.target.checked)}
                  className="h-5 w-5 shrink-0 accent-stitch-primary"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="space-y-3">
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
        </div>

        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
          <button type="button" className="hover:text-stitch-primary">
            LEGAL DISCLAIMER
          </button>
          <span aria-hidden>|</span>
          <button type="button" className="hover:text-stitch-primary">
            SOURCE CREDITS
          </button>
          <span aria-hidden>|</span>
          <button type="button" className="hover:text-stitch-primary">
            METHODOLOGY
          </button>
        </div>
      </div>

    </>
  );
}
