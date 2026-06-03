import type { AlertSeverity, FrictionLevel } from "../types/city.ts";

/** Score tier colors from Stitch Editorial Intel palette */
export function frictionScoreColor(score: number): string {
  if (score >= 8.5) return "var(--stitch-danger)";
  if (score >= 7.5) return "var(--stitch-secondary)";
  return "var(--stitch-tertiary)";
}

export function frictionLevelColor(level: FrictionLevel): string {
  switch (level) {
    case "high":
      return "var(--stitch-danger)";
    case "medium":
      return "var(--stitch-secondary)";
    case "low":
      return "var(--stitch-tertiary)";
  }
}

export function severityBorderColor(severity: AlertSeverity): string {
  switch (severity) {
    case "high":
      return "var(--stitch-primary)";
    case "medium":
      return "var(--stitch-secondary)";
    case "low":
      return "var(--stitch-tertiary)";
  }
}
