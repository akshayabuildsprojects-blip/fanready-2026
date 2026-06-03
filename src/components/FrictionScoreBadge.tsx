import AnimatedFrictionScore from "./AnimatedFrictionScore.tsx";
import { frictionScoreColor } from "../lib/stitch.ts";

interface FrictionScoreBadgeProps {
  score: number;
}

export default function FrictionScoreBadge({ score }: FrictionScoreBadgeProps) {
  const color = frictionScoreColor(score);

  return (
    <span
      className="inline-flex items-center font-stitch-label text-sm font-bold tabular-nums"
      style={{ color }}
      aria-label={`Friction index ${score}`}
    >
      <AnimatedFrictionScore score={score} />
    </span>
  );
}
