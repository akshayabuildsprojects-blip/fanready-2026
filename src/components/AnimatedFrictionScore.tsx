import { useEffect, useState } from "react";

interface AnimatedFrictionScoreProps {
  score: number;
}

export default function AnimatedFrictionScore({
  score,
}: AnimatedFrictionScoreProps) {
  const [displayScore, setDisplayScore] = useState("0.0");

  useEffect(() => {
    let frameId = 0;
    let startTime: number | null = null;
    const durationMs = 1000;

    const animate = (timestamp: number) => {
      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayScore((score * easedProgress).toFixed(1));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return displayScore;
}
