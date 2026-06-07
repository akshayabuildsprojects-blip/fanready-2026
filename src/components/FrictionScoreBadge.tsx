import { useTranslation } from "react-i18next";
import AnimatedFrictionScore from "./AnimatedFrictionScore.tsx";
import { frictionScoreColor } from "../lib/stitch.ts";

interface FrictionScoreBadgeProps {
  score: number;
}

export default function FrictionScoreBadge({ score }: FrictionScoreBadgeProps) {
  const { t } = useTranslation();
  const color = frictionScoreColor(score);

  return (
    <span
      className="inline-flex items-center font-stitch-label text-sm font-bold tabular-nums"
      style={{ color }}
      aria-label={`${t("friction_index")} ${score}`}
    >
      <AnimatedFrictionScore score={score} />
    </span>
  );
}
