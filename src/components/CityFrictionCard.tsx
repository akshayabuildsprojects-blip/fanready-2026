import { Link } from "react-router-dom";
import AnimatedFrictionScore from "./AnimatedFrictionScore.tsx";
import type { City } from "../types/city.ts";
import { frictionScoreColor } from "../lib/stitch.ts";

interface CityFrictionCardProps {
  city: City;
  showSelectButton?: boolean;
  showAddToBrief?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const MAX_DISTANCE_MILES = 35;

function frictionLevelLabel(score: number): string {
  if (score >= 8.5) return "SEVERE";
  if (score >= 7.5) return "HIGH";
  if (score >= 6.5) return "MODERATE";
  return "LOW";
}

function displayCityName(name: string): string {
  const slash = name.indexOf(" / ");
  return slash === -1 ? name : name.slice(0, slash);
}

export default function CityFrictionCard({
  city,
  showSelectButton = false,
  showAddToBrief = false,
  isSelected = false,
  onSelect,
}: CityFrictionCardProps) {
  const badgeColor = frictionScoreColor(city.frictionIndex);
  const barWidth = Math.min(
    100,
    Math.round((city.distanceMiles / MAX_DISTANCE_MILES) * 100),
  );

  return (
    <article className="border border-stitch-primary/10 bg-stitch-neutral">
      <Link to={`/cities/${city.id}`} className="block hover:opacity-95">
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
          <h2 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
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
        </div>
      </Link>

      {(showSelectButton || showAddToBrief) && (
        <div className="flex flex-wrap gap-2 border-t border-stitch-primary/10 p-5">
          {showSelectButton && (
            <button
              type="button"
              onClick={onSelect}
              className={
                isSelected
                  ? "border border-stitch-primary bg-stitch-primary px-4 py-2 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
                  : "border border-stitch-primary bg-transparent px-4 py-2 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
              }
              style={{ borderRadius: "var(--radius-stitch-button)" }}
              aria-pressed={isSelected}
            >
              {isSelected ? "Selected" : "Select city"}
            </button>
          )}
          {showAddToBrief && (
            <button
              type="button"
              className="border border-stitch-primary/20 bg-stitch-neutral px-4 py-2 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
              style={{ borderRadius: "var(--radius-stitch-button)" }}
            >
              Add to brief
            </button>
          )}
        </div>
      )}
    </article>
  );
}
