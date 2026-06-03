import { useCallback, useMemo, useState } from "react";
import CityFrictionIndexCard from "../components/CityFrictionIndexCard.tsx";
import citiesData from "../data/cities.json";
import {
  readSelectedCities,
  writeSelectedCities,
} from "../lib/selectedCities.ts";
import type { City } from "../types/city.ts";

const cities = citiesData.cities as City[];

const FILTER_CHIPS = [
  "HIGHEST FRICTION",
  "STADIUM FAR FROM DOWNTOWN",
  "HEAT RISK",
  "DRIVING HEAVY",
  "TRANSIT PLANNING",
  "MULTI-CITY CAUTION",
] as const;

export default function CitiesPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    readSelectedCities(),
  );

  const sorted = useMemo(
    () => [...cities].sort((a, b) => b.frictionIndex - a.frictionIndex),
    [],
  );

  const persistSelection = useCallback((ids: string[]) => {
    setSelectedIds(ids);
    writeSelectedCities(ids);
  }, []);

  const toggleBrief = useCallback(
    (cityId: string) => {
      const next = selectedIds.includes(cityId)
        ? selectedIds.filter((id) => id !== cityId)
        : [...selectedIds, cityId];
      persistSelection(next);
    },
    [persistSelection, selectedIds],
  );

  return (
    <div className="-mx-4 space-y-6 px-4 pb-20">
        <header>
          <h1 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
            City Friction Index
          </h1>
          <p className="mt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            Each host city has different matchday friction. Start with the
            places you&apos;re attending or considering.
          </p>
        </header>

        <div
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1"
          role="list"
          aria-label="Filter tags"
        >
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className="shrink-0 border border-stitch-primary bg-transparent px-3 py-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
              style={{ borderRadius: "var(--radius-stitch-button)" }}
            >
              {chip}
            </button>
          ))}
        </div>

        <ul className="space-y-4">
          {sorted.map((city) => (
            <li key={city.id}>
              <CityFrictionIndexCard
                city={city}
                isAdded={selectedIds.includes(city.id)}
                onToggleBrief={() => toggleBrief(city.id)}
              />
            </li>
          ))}
        </ul>
    </div>
  );
}
