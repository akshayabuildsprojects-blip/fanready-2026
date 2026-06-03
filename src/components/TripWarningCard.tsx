import type { AlertSeverity } from "../types/city.ts";
import { severityBorderColor } from "../lib/stitch.ts";

interface TripWarningCardProps {
  severity: AlertSeverity;
  title: string;
  text: string;
}

export default function TripWarningCard({
  severity,
  title,
  text,
}: TripWarningCardProps) {
  const borderColor = severityBorderColor(severity);
  const borderWidth = severity === "high" ? 4 : severity === "medium" ? 3 : 2;

  return (
    <article
      className="rounded-stitch-card bg-stitch-neutral p-4"
      style={{
        borderLeft: `${borderWidth}px solid ${borderColor}`,
      }}
    >
      <h3 className="font-stitch-headline text-lg font-semibold text-stitch-primary">
        {title}
      </h3>
      <p className="mt-2 font-stitch-body text-sm leading-relaxed text-stitch-primary/90">
        {text}
      </p>
    </article>
  );
}
