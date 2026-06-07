import { useTranslation } from "react-i18next";
import type { FrictionLevel } from "../types/city.ts";
import { frictionLevelColor } from "../lib/stitch.ts";

interface TransportOptionCardProps {
  mode: string;
  frictionLevel: FrictionLevel;
  warning: string;
  action: string;
}

export default function TransportOptionCard({
  mode,
  frictionLevel,
  warning,
  action,
}: TransportOptionCardProps) {
  const { t } = useTranslation();
  const accent = frictionLevelColor(frictionLevel);

  return (
    <article
      className="rounded-stitch-card bg-stitch-neutral p-4"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-stitch-label text-sm font-bold uppercase tracking-wide text-stitch-primary">
          {mode}
        </h3>
        <span
          className="font-stitch-label text-[10px] font-bold uppercase"
          style={{ color: accent }}
        >
          {t(frictionLevel)}
        </span>
      </div>
      <p className="mt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/90">
        {warning}
      </p>
      <p className="mt-2 font-stitch-label text-xs text-stitch-primary/80">
        {action}
      </p>
    </article>
  );
}
