import { useState } from "react";
import { CityFrictionCard } from "../components/index.ts";
import citiesData from "../data/cities.json";
import type { City } from "../types/city.ts";

const cities = citiesData.cities as City[];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sorted = [...cities].sort((a, b) => b.frictionIndex - a.frictionIndex);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-stitch-headline text-3xl font-bold text-stitch-primary">
          Host cities
        </h1>
        <p className="mt-2 max-w-2xl font-stitch-body text-sm text-stitch-primary/80">
          Friction-ranked planning for all 10 FIFA World Cup 2026 US host cities.
        </p>
      </div>
      <ul className="space-y-4">
        {sorted.map((city) => (
          <li key={city.id}>
            <CityFrictionCard
              city={city}
              showSelectButton
              showAddToBrief
              isSelected={selectedId === city.id}
              onSelect={() =>
                setSelectedId((prev) => (prev === city.id ? null : city.id))
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
