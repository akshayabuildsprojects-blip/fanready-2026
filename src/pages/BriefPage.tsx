import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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
  { id: "dallas", label: "Dallas", progressLabel: "DALLAS" },
  { id: "boston", label: "Boston", progressLabel: "BOSTON" },
  { id: "miami", label: "Miami", progressLabel: "MIAMI" },
  { id: "nyc", label: "New York/NJ", progressLabel: "NEW YORK/NJ" },
  { id: "kansascity", label: "Kansas City", progressLabel: "KANSAS CITY" },
  { id: "atlanta", label: "Atlanta", progressLabel: "ATLANTA" },
  { id: "houston", label: "Houston", progressLabel: "HOUSTON" },
  { id: "losangeles", label: "Los Angeles", progressLabel: "LOS ANGELES" },
  { id: "seattle", label: "Seattle", progressLabel: "SEATTLE" },
  { id: "philadelphia", label: "Philadelphia", progressLabel: "PHILADELPHIA" },
] as const;

const CITY_ID_FROM_FRICTION_INDEX: Record<string, string> = {
  "new-york-nj": "nyc",
  "los-angeles": "losangeles",
  "kansas-city": "kansascity",
  nyc: "nyc",
  losangeles: "losangeles",
  dallas: "dallas",
  miami: "miami",
  atlanta: "atlanta",
  boston: "boston",
  houston: "houston",
  kansascity: "kansascity",
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
  "Public transit",
  "Rideshare",
  "Official shuttle",
  "Driving",
  "Private transfer",
  "Not sure yet",
];

const STAY_OPTION_KEYS: Record<StayLocation, string> = {
  "Near stadium": "near_stadium",
  "City center / downtown": "city_center",
  "Near airport": "near_airport",
  "Suburb / outside city": "suburb",
  "Not booked yet": "not_booked",
  "Not sure": "not_sure",
};

const STADIUM_TRANSIT_OPTION_KEYS: Record<StadiumTransit, string> = {
  "Public transit": "public_transit",
  Rideshare: "rideshare",
  "Official shuttle": "official_shuttle",
  Driving: "driving",
  "Private transfer": "private_transfer",
  "Not sure yet": "not_sure_yet",
};

const DEFAULT_CITY_DETAILS: CityLogistics = {
  stayLocation: "Not booked yet",
  stadiumTransit: "Not sure yet",
  localConfidence: "low",
};

type Step = 1 | 2 | 3;

function normalizeCityLogistics(details: CityLogistics): CityLogistics {
  const legacyTransit = details.stadiumTransit as string;
  const stadiumTransit =
    legacyTransit === "Public transit (train/bus)"
      ? "Public transit"
      : legacyTransit === "Rideshare (Uber/Lyft)"
        ? "Rideshare"
        : legacyTransit === "Driving / personal vehicle"
          ? "Driving"
          : details.stadiumTransit;

  return {
    ...details,
    stadiumTransit: stadiumTransit as StadiumTransit,
  };
}

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

function cityProgressLabel(cityId: string): string {
  return HOST_CITIES.find((city) => city.id === cityId)?.progressLabel ?? cityId;
}

function createInitialCityDetails(
  savedAnswers: TripAnswers | null,
): Record<string, CityLogistics> {
  const details: Record<string, CityLogistics> = {};

  for (const cityId of HOST_CITIES.map((city) => city.id)) {
    const legacyId =
      Object.entries(CITY_ID_FROM_FRICTION_INDEX).find(
        ([sourceId, mappedId]) => sourceId !== mappedId && mappedId === cityId,
      )?.[0] ?? cityId;
    details[cityId] = normalizeCityLogistics({
      ...DEFAULT_CITY_DETAILS,
      ...savedAnswers?.cityDetails?.[cityId],
      ...savedAnswers?.cityDetails?.[legacyId],
    });
  }

  return details;
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
  options: { value: string; label: string }[];
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
            <option key={option.value} value={option.value}>
              {option.label}
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

function ProgressHeader({ step }: { step: Step }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
        {t("step")} {step} {t("of")} 3
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-stitch-primary/10">
        <div
          className="h-full rounded-full bg-stitch-primary transition-all duration-200 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}

function CheckboxRow({
  question,
  subtext,
  checked,
  onChange,
}: {
  question: string;
  subtext: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between gap-4 border border-stitch-primary/10 bg-stitch-neutral p-5">
      <div>
        <p className="font-stitch-headline text-lg font-semibold text-stitch-primary">
          {question}
        </p>
        <p className="mt-1 font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
          {subtext}
        </p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 shrink-0 accent-stitch-primary"
      />
    </label>
  );
}

export default function BriefPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const savedAnswers = useMemo(() => readTripAnswers(), []);
  const isEditing = Boolean(savedAnswers);
  const [step, setStep] = useState<Step>(1);
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

  const goBack = () => {
    if (step === 1) return;
    if (step === 2) {
      if (activeCityIndex > 0) {
        setActiveCityIndex((index) => index - 1);
        return;
      }
      setStep(1);
      return;
    }
    setStep(2);
    setActiveCityIndex(Math.max(hostCities.length - 1, 0));
  };

  const goNext = () => {
    if (step === 1) {
      if (hostCities.length === 0) {
        setHasCitySelectionError(true);
        return;
      }
      setHasCitySelectionError(false);
      setActiveCityIndex(0);
      setStep(2);
      return;
    }

    if (step === 2) {
      if (activeCityIndex < hostCities.length - 1) {
        setActiveCityIndex((index) => index + 1);
        return;
      }
      setStep(3);
    }
  };

  const handleGenerate = () => {
    if (hostCities.length === 0) {
      setHasCitySelectionError(true);
      setStep(1);
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

  const nextButtonLabel =
    step === 2 && activeCityIndex < hostCities.length - 1
      ? t("next_city")
      : t("continue");
  const stayOptions = STAY_OPTIONS.map((option) => ({
    value: option,
    label: t(STAY_OPTION_KEYS[option]),
  }));
  const stadiumTransitOptions = STADIUM_TRANSIT_OPTIONS.map((option) => ({
    value: option,
    label: t(STADIUM_TRANSIT_OPTION_KEYS[option]),
  }));
  const activeStepKey = `${step}-${activeCityId ?? "cities"}-${activeCityIndex}`;

  return (
    <>
      <div className="-mx-4 flex max-h-[calc(100vh-9rem)] flex-col px-4 pb-36">
        <header>
          <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
            {t("brief_title")}
          </h1>
          <p className="mt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {t("brief_subtitle")}
          </p>
        </header>

        <div className="mt-8 shrink-0">
          <ProgressHeader step={step} />
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto pb-4">
          <div
            key={activeStepKey}
            className="space-y-5 transition-all duration-200 ease-out animate-[briefStepIn_180ms_ease-out]"
          >
            {step === 1 && (
              <section className="space-y-5">
                <div>
                  <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
                    {t("step1_title")}
                  </h2>
                  <p className="mt-2 font-stitch-body text-sm text-stitch-primary/70">
                    {t("step1_subtitle")}
                  </p>
                </div>
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
                {hasCitySelectionError && (
                  <p className="font-stitch-body text-sm leading-relaxed text-stitch-danger">
                    {t("select_at_least_one")}
                  </p>
                )}
              </section>
            )}

            {step === 2 && activeCityId && (
              <section className="space-y-5">
                <div>
                  <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
                    {t("step2_title")}
                  </h2>
                  {hostCities.length > 1 && (
                    <p className="mt-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
                      {cityProgressLabel(activeCityId)} —{" "}
                      {t("city_progress", {
                        current: activeCityIndex + 1,
                        total: hostCities.length,
                      })}
                    </p>
                  )}
                </div>

                <div className="space-y-5 border border-stitch-primary/10 bg-stitch-neutral p-5">
                  <h3 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
                    {cityLabel(activeCityId)}
                  </h3>

                  <SelectField
                    id={`stay-${activeCityId}`}
                    label={t("where_staying")}
                    value={activeCityDetails.stayLocation}
                    options={stayOptions}
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
                    label={t("how_getting")}
                    value={activeCityDetails.stadiumTransit}
                    options={stadiumTransitOptions}
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
                      {t("how_confident")}
                    </p>
                    <div className="flex">
                      {(["low", "med", "high"] as const).map((level) => {
                        const active =
                          activeCityDetails.localConfidence === level;
                        return (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              updateCityDetail(
                                activeCityId,
                                "localConfidence",
                                level,
                              )
                            }
                            className={
                              active
                                ? "flex-1 border border-stitch-primary bg-stitch-primary py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                                : "flex-1 border border-stitch-primary/10 bg-stitch-neutral py-3 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
                            }
                            aria-pressed={active}
                          >
                            {t(level)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="space-y-5">
                <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
                  {t("step3_title")}
                </h2>
                <div className="space-y-3">
                  <CheckboxRow
                    question={t("visiting_another_country")}
                    subtext={t("visa_customs")}
                    checked={visitingFromAbroad}
                    onChange={setVisitingFromAbroad}
                  />
                  <CheckboxRow
                    question={t("crossing_borders")}
                    subtext={t("us_canada_mexico")}
                    checked={crossingBorders}
                    onChange={setCrossingBorders}
                  />
                  <CheckboxRow
                    question={t("driving_vehicle")}
                    subtext={t("parking_traffic")}
                    checked={drivingVehicle}
                    onChange={setDrivingVehicle}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 z-40 border-t border-stitch-primary/10 bg-stitch-neutral px-4 py-3" style={{ bottom: "calc(4.25rem + env(safe-area-inset-bottom))" }}>
        <div className="mx-auto max-w-5xl space-y-3">
          {step === 3 ? (
            <>
              <button
                type="button"
                onClick={goBack}
                className="w-full border border-stitch-primary bg-transparent px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                {t("back")}
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full bg-stitch-primary px-4 py-4 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                {isEditing
                  ? t("update_brief")
                  : t("generate_brief")}
              </button>
              <p className="text-center font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/60">
                {t("analysis_engine")}
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
                {t("back")}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="bg-stitch-primary px-4 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
              >
                {nextButtonLabel}
              </button>
            </div>
          )}
        </div>
      </div>

      <style>
        {`@keyframes briefStepIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }`}
      </style>
    </>
  );
}
