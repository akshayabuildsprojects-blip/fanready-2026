import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CityFrictionCard } from "../components/index.ts";
import citiesData from "../data/cities.json";
import type { City } from "../types/city.ts";

const cities = citiesData.cities as City[];

export default function Home() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sorted = [...cities].sort((a, b) => b.frictionIndex - a.frictionIndex);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-stitch-headline text-3xl font-bold text-stitch-primary">
          {t("host_cities")}
        </h1>
        <p className="mt-2 max-w-2xl font-stitch-body text-sm text-stitch-primary/80">
          {t("home_intro")}
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
