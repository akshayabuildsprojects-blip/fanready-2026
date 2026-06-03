import type { GlobalAlert } from "../types/city.ts";
import { severityBorderColor } from "../lib/stitch.ts";

interface GlobalAlertBannerProps {
  alert: GlobalAlert;
}

export default function GlobalAlertBanner({ alert }: GlobalAlertBannerProps) {
  if (!alert.active) return null;

  return (
    <div
      className="border-b border-stitch-primary/10 bg-stitch-neutral px-4 py-3"
      style={{ borderLeft: `4px solid ${severityBorderColor(alert.severity)}` }}
      role="alert"
    >
      <p className="font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary">
        Global alert
      </p>
      <p className="mt-1 font-stitch-body text-sm text-stitch-primary">{alert.text}</p>
    </div>
  );
}
