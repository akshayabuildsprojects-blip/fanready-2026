import type { CityAlert } from "../types/city.ts";
import { severityBorderColor } from "../lib/stitch.ts";

interface CityAlertBannerProps {
  alert: CityAlert;
}

export default function CityAlertBanner({ alert }: CityAlertBannerProps) {
  if (!alert.active) return null;

  return (
    <div
      className="rounded-stitch-card border border-stitch-primary/10 bg-stitch-neutral p-4"
      style={{ borderLeft: `4px solid ${severityBorderColor(alert.severity)}` }}
      role="alert"
    >
      <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
        {alert.alertType}
      </p>
      <p className="mt-1 font-stitch-body text-sm text-stitch-primary">{alert.text}</p>
    </div>
  );
}
