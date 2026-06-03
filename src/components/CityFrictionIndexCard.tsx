import { Link } from "react-router-dom";
import AnimatedFrictionScore from "./AnimatedFrictionScore.tsx";
import type { City } from "../types/city.ts";
import { frictionScoreColor } from "../lib/stitch.ts";

interface CityFrictionIndexCardProps {
  city: City;
  isAdded: boolean;
  onToggleBrief: () => void;
}

const MAX_DISTANCE_MILES = 30;

function frictionLevelLabel(score: number): string {
  if (score >= 8.5) return "SEVERE";
  if (score >= 7.5) return "HIGH";
  if (score >= 6.5) return "ELEVATED";
  return "MODERATE";
}

function displayCityName(name: string): string {
  const slash = name.indexOf(" / ");
  return slash === -1 ? name : name.slice(0, slash);
}

export default function CityFrictionIndexCard({
  city,
  isAdded,
  onToggleBrief,
}: CityFrictionIndexCardProps) {
  const badgeColor = frictionScoreColor(city.frictionIndex);
  const barWidth = Math.min(
    100,
    Math.round((city.distanceMiles / MAX_DISTANCE_MILES) * 100),
  );

  return (
    <article className="border border-stitch-primary/10 bg-stitch-neutral">
      <div className="relative">
        <img
          src="/cityscape.jpg"
          alt=""
          className="h-44 w-full object-cover"
          style={{ filter: "grayscale(100%)" }}
        />
        <span
          className="absolute right-3 top-3 px-2 py-1 font-stitch-label text-xs font-bold text-stitch-neutral"
          style={{ backgroundColor: badgeColor }}
          aria-label={`Friction index ${city.frictionIndex}`}
        >
          <AnimatedFrictionScore score={city.frictionIndex} />
        </span>
      </div>

      <div className="p-5">
        <p className="font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/50">
          HOST CITY
        </p>
        <h2 className="mt-1 font-stitch-headline text-2xl font-semibold uppercase text-stitch-primary">
          {displayCityName(city.name)}
        </h2>
        <p className="mt-1 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
          FRICTION: {frictionLevelLabel(city.frictionIndex)}
        </p>

        <div className="mt-3 h-px bg-stitch-primary/10" />

        <div className="mt-3 flex items-baseline justify-between gap-4 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary">
          <span>Downtown to Stadium</span>
          <span>{city.distanceMiles} miles</span>
        </div>

        <div
          className="mt-2 h-2 bg-stitch-primary"
          style={{ width: `${barWidth}%` }}
          role="presentation"
        />

        <p className="mt-2 font-stitch-label text-[9px] uppercase leading-relaxed tracking-wide text-stitch-primary/70">
          {city.infographicCaption}
        </p>

        <div className="mt-3 h-px bg-stitch-primary/10" />

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onToggleBrief}
            className={
              isAdded
                ? "flex-1 border border-stitch-tertiary bg-stitch-tertiary px-3 py-2.5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral"
                : "flex-1 border border-stitch-primary bg-transparent px-3 py-2.5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            }
            style={{ borderRadius: "var(--radius-stitch-button)" }}
            aria-pressed={isAdded}
          >
            {isAdded ? "ADDED ✓" : "ADD TO BRIEF"}
          </button>
          <Link
            to={`/cities/${city.id}`}
            className="flex flex-1 items-center justify-center border border-stitch-primary bg-transparent px-3 py-2.5 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary"
            style={{ borderRadius: "var(--radius-stitch-button)" }}
          >
            VIEW GUIDE
          </Link>
        </div>
      </div>
    </article>
  );
}
