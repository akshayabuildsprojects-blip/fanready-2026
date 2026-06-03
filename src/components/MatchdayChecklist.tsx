import { useState } from "react";

interface MatchdayChecklistProps {
  items: string[];
}

export default function MatchdayChecklist({ items }: MatchdayChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    items.map(() => false),
  );

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <ul className="space-y-3" role="list">
      {items.map((item, index) => {
        const isChecked = checked[index];
        return (
          <li key={item}>
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full cursor-pointer items-start gap-3 text-left"
              aria-pressed={isChecked}
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-stitch-primary"
                style={{ borderRadius: "var(--radius-stitch-button)" }}
                aria-hidden
              >
                {isChecked ? (
                  <span className="block h-2 w-2 bg-stitch-primary" />
                ) : null}
              </span>
              <span
                className={`font-stitch-body text-sm leading-relaxed ${
                  isChecked
                    ? "text-stitch-primary/50 line-through"
                    : "text-stitch-primary"
                }`}
              >
                {item}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
