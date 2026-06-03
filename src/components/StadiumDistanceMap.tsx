import type { City } from "../types/city.ts";

interface StadiumDistanceMapProps {
  city: City;
}

export default function StadiumDistanceMap({ city }: StadiumDistanceMapProps) {
  const distanceCaption = `${city.distanceMiles} mi`;
  const riskCaption = city.infographicCaption;

  return (
    <svg
      viewBox="0 0 320 72"
      className="h-auto w-full max-w-sm"
      role="img"
      aria-label={`Distance map from ${city.downtownCode} to ${city.stadiumCode}, ${distanceCaption}`}
    >
      <text
        x="160"
        y="12"
        textAnchor="middle"
        className="fill-stitch-primary"
        style={{ fontFamily: "var(--font-stitch-label)", fontSize: 10 }}
      >
        {distanceCaption}
      </text>
      <line
        x1="48"
        y1="36"
        x2="272"
        y2="36"
        stroke="var(--stitch-primary)"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.35"
      />
      <circle cx="48" cy="36" r="6" fill="var(--stitch-primary)" />
      <circle cx="272" cy="36" r="6" fill="var(--stitch-secondary)" />
      <text
        x="48"
        y="58"
        textAnchor="middle"
        className="fill-stitch-primary"
        style={{ fontFamily: "var(--font-stitch-label)", fontSize: 11, fontWeight: 700 }}
      >
        {city.downtownCode}
      </text>
      <text
        x="272"
        y="58"
        textAnchor="middle"
        className="fill-stitch-primary"
        style={{ fontFamily: "var(--font-stitch-label)", fontSize: 11, fontWeight: 700 }}
      >
        {city.stadiumCode}
      </text>
      <text
        x="160"
        y="70"
        textAnchor="middle"
        className="fill-stitch-primary"
        style={{ fontFamily: "var(--font-stitch-body)", fontSize: 9 }}
        opacity="0.75"
      >
        {riskCaption}
      </text>
    </svg>
  );
}
