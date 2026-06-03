import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import citiesData from "../data/cities.json";
import CityFrictionCard from "../components/CityFrictionCard.tsx";

const TARGET_CST_UTC_MINUS_6 = "2026-06-12T02:00:00.000Z"; // 2026-06-11 20:00 CST

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getCountdownParts(nowMs) {
  const targetMs = Date.parse(TARGET_CST_UTC_MINUS_6);
  const diffMs = Math.max(0, targetMs - nowMs);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function SmallGoldIcon({ name }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "car":
      return (
        <svg {...common}>
          <path d="M3 16l1-6a3 3 0 0 1 3-2h10a3 3 0 0 1 3 2l1 6" />
          <path d="M5 16v3" />
          <path d="M19 16v3" />
          <circle cx="7.5" cy="16" r="1.5" />
          <circle cx="16.5" cy="16" r="1.5" />
        </svg>
      );
    case "thermo":
      return (
        <svg {...common}>
          <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" />
          <path d="M12 16v-6" />
        </svg>
      );
    case "warn":
      return (
        <svg {...common}>
          <path d="M10.3 4.9 2.6 18.2A2 2 0 0 0 4.3 21h15.4a2 2 0 0 0 1.7-2.8L13.7 4.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v5" />
          <path d="M12 17h.01" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Landing() {
  const cities = useMemo(() => {
    const byId = new Map(citiesData.cities.map((c) => [c.id, c]));
    return ["dallas", "boston", "miami"].map((id) => byId.get(id)).filter(Boolean);
  }, []);

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const { days, hours, minutes, seconds } = getCountdownParts(now);

  return (
    <div className="space-y-14">
      {/* 2. Hero (dark) */}
      <section className="rounded-stitch-card bg-stitch-primary p-6 text-stitch-neutral sm:p-8">
        <div className="space-y-4">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
            INTELLIGENCE BRIEFING
          </p>
          <h1 className="font-stitch-headline text-4xl font-semibold leading-tight">
            Know the friction before matchday
          </h1>
          <p className="max-w-2xl font-stitch-body text-base leading-relaxed text-stitch-neutral/80">
            Host cities are not equal. Plan lodging, transport, and exit timing
            based on venue reality—not assumptions.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/brief"
            className="inline-flex items-center justify-center rounded-stitch-button bg-stitch-neutral px-6 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
          >
            Build my readiness brief
          </Link>
          <Link
            to="/cities"
            className="inline-flex items-center justify-center rounded-stitch-button border border-stitch-neutral/30 bg-transparent px-6 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
          >
            View city friction index
          </Link>
        </div>

        <p className="mt-4 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/70">
          Static intel, offline-ready. Verify sources when booking.
        </p>

        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral">
            DEPLOYMENT CLOCK
          </p>
          <h2 className="mt-3 font-stitch-headline text-2xl font-semibold text-stitch-neutral">
            World Cup 2026 starts soon
          </h2>
          <p className="mt-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
            Opening match: June 11, 2026
          </p>

          <div className="mt-8 flex items-stretch justify-center">
            <div className="flex-1 px-2">
              <div className="font-stitch-headline text-4xl font-semibold text-stitch-neutral">
                {days}
              </div>
              <div className="mt-1 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/60">
                Days
              </div>
            </div>
            <div
              className="w-px shrink-0 bg-stitch-neutral/20"
              role="presentation"
            />
            <div className="flex-1 px-2">
              <div className="font-stitch-headline text-4xl font-semibold text-stitch-neutral">
                {pad2(hours)}
              </div>
              <div className="mt-1 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/60">
                Hrs
              </div>
            </div>
            <div
              className="w-px shrink-0 bg-stitch-neutral/20"
              role="presentation"
            />
            <div className="flex-1 px-2">
              <div className="font-stitch-headline text-4xl font-semibold text-stitch-neutral">
                {pad2(minutes)}
              </div>
              <div className="mt-1 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/60">
                Mins
              </div>
            </div>
            <div
              className="w-px shrink-0 bg-stitch-neutral/20"
              role="presentation"
            />
            <div className="flex-1 px-2">
              <div className="font-stitch-headline text-4xl font-semibold text-stitch-neutral">
                {pad2(seconds)}
              </div>
              <div className="mt-1 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/60">
                Secs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why section */}
      <section className="space-y-6">
        <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
          OPERATIONAL REALITY
        </p>
        <h2 className="font-stitch-headline text-3xl font-semibold text-stitch-primary">
          North America 2026 is different.
        </h2>

        <div className="space-y-3">
          {[
            {
              icon: "pin",
              title: "Stadium ≠ city center",
              body:
                "Many venues are located in remote suburbs up to 30 miles from the official host city hotels.",
            },
            {
              icon: "car",
              title: "Transport varies by city",
              body:
                "High-speed rail is non-existent. Transit infrastructure ranges from efficient subways to car-only arteries.",
            },
            {
              icon: "thermo",
              title: "Heat changes the plan",
              body:
                "June temperatures in southern venues frequently exceed 95°F (35°C) with oppressive humidity.",
            },
            {
              icon: "warn",
              title: "Scams and confusion",
              body:
                "Surge pricing for unlicensed transport and counterfeit matchday parking permits are expected to surge.",
            },
          ].map((c) => (
            <div key={c.title} className="border border-stitch-primary/10 p-5">
              <div className="text-stitch-secondary">
                <SmallGoldIcon name={c.icon} />
              </div>
              <p className="mt-3 font-stitch-headline text-xl font-semibold text-stitch-primary">
                {c.title}
              </p>
              <div className="mt-3 h-px bg-stitch-primary/10" />
              <p className="mt-3 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. City preview */}
      <section className="space-y-4">
        <div className="flex justify-end">
          <Link
            to="/cities"
            className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary underline-offset-2 hover:underline"
          >
            Full Index
          </Link>
        </div>

        <div className="space-y-4">
          {cities.map((city) => (
            <CityFrictionCard key={city.id} city={city} />
          ))}
        </div>
      </section>

      {/* 6. How it works */}
      <section className="space-y-6">
        <ol className="space-y-3">
          {[
            {
              title: "Pick your host city",
              text: "Start with friction ranking to understand matchday movement risk.",
            },
            {
              title: "Check the transfer reality",
              text: "Review transport options and the distance map before booking hotels.",
            },
            {
              title: "Build your readiness brief",
              text: "Save key guidance and keep it accessible on match week.",
            },
          ].map((s, idx) => (
            <li
              key={s.title}
              className="rounded-stitch-card border border-stitch-primary/10 bg-stitch-neutral p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-stitch-label text-[10px] uppercase tracking-wide text-stitch-secondary">
                    Step {idx + 1}
                  </p>
                  <p className="font-stitch-headline text-xl font-semibold text-stitch-primary">
                    {s.title}
                  </p>
                  <p className="mt-1 font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
                    {s.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="pt-2">
          <Link
            to="/brief"
            className="inline-flex items-center justify-center rounded-stitch-button bg-stitch-primary px-6 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
          >
            Build my brief
          </Link>
        </div>
      </section>

      {/* 7. Sources and trust */}
      <section className="space-y-4">
        <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
          SOURCES AND TRUST
        </p>
        <p className="font-stitch-body text-sm leading-relaxed text-stitch-primary/80">
          We point you back to official host-city, stadium, ticketing, transit,
          and government sources so you can verify before matchday.
        </p>
        <p className="font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary/70">
          Last-updated timestamps appear on city guides and readiness briefs.
        </p>
      </section>
    </div>
  );
}

