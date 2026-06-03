import AnimatedFrictionScore from "./AnimatedFrictionScore.tsx";
import { frictionScoreColor } from "../lib/stitch.ts";
import {
  getDistanceLabel,
  getFrictionBars,
  type ResolvedCity,
} from "../lib/briefPersonalization.ts";

interface PerCityFrictionBriefCardProps {
  resolved: ResolvedCity;
  figureNumber: number;
}

function FrictionBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between font-stitch-label text-[8px] uppercase tracking-wide text-stitch-primary/70">
        <span>{label}</span>
      </div>
      <div className="h-1.5 bg-stitch-primary/10">
        <div
          className="h-full bg-stitch-danger"
          style={{ width: `${percent}%` }}
          role="presentation"
        />
      </div>
    </div>
  );
}

export default function PerCityFrictionBriefCard({
  resolved,
  figureNumber,
}: PerCityFrictionBriefCardProps) {
  const { city, hostRegion, downtownArea, downtownVsBody } = resolved;
  const bars = getFrictionBars(city);
  const scoreColor = frictionScoreColor(city.frictionIndex);
  const figLabel = `FIG ${String(figureNumber).padStart(2, "0")} — LOGISTICAL DISCONNECT MAP`;

  return (
    <article className="space-y-5 border border-stitch-primary/10 bg-stitch-neutral p-5">
      <div>
        <h3 className="font-stitch-headline text-2xl font-semibold text-stitch-primary">
          {city.name}
        </h3>
        <p className="mt-1 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary/60">
          Host Region: {hostRegion}
        </p>
      </div>

      <div>
        <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
          Friction score
        </p>
        <div
          className="mt-2 inline-block border border-stitch-primary/10 px-4 py-3"
          style={{ backgroundColor: scoreColor }}
        >
          <span className="font-stitch-headline text-3xl font-semibold text-stitch-neutral">
            <AnimatedFrictionScore score={city.frictionIndex} />
          </span>
        </div>
      </div>

      <div className="border border-stitch-primary/10 bg-stitch-primary/[0.03] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="border border-stitch-primary bg-stitch-primary px-3 py-2 font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-neutral">
            Downtown
          </div>
          <div className="flex-1 text-center font-stitch-label text-[9px] uppercase tracking-wide text-stitch-primary/70">
            {getDistanceLabel(city)}
          </div>
          <div className="border border-stitch-primary bg-stitch-neutral px-3 py-2 font-stitch-label text-[9px] font-bold uppercase tracking-wide text-stitch-primary">
            Stadium
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <FrictionBar label="Walkability" percent={bars.walkability} />
          <FrictionBar label="Public transit" percent={bars.publicTransit} />
          <FrictionBar label="Rideshare" percent={bars.rideshare} />
          <FrictionBar label="Wait" percent={bars.wait} />
        </div>

        <p className="mt-3 font-stitch-label text-[8px] uppercase tracking-wide text-stitch-primary/50">
          {figLabel}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Stadium access friction
          </p>
          <p className="mt-2 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {city.stadiumReality}
          </p>
        </div>
        <div>
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Downtown vs {downtownArea}
          </p>
          <p className="mt-2 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
            {downtownVsBody}
          </p>
        </div>
      </div>
    </article>
  );
}
