import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { readTripAnswers } from "../lib/tripAnswers.ts";

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

export default function Landing() {
  const { t } = useTranslation();
  const [hasTripAnswers] = useState(() => {
    const answers = readTripAnswers();
    return Boolean(answers && Object.keys(answers).length > 0);
  });

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
            {t("hero_label")}
          </p>
          <h1 className="font-stitch-headline text-4xl font-semibold leading-tight">
            {t("hero_title")}
          </h1>
          <p className="max-w-2xl font-stitch-body text-base leading-relaxed text-stitch-neutral/80">
            {t("hero_subtitle")}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to={hasTripAnswers ? "/my-brief" : "/brief"}
            className="inline-flex items-center justify-center rounded-stitch-button bg-stitch-neutral px-6 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-primary"
          >
            {hasTripAnswers ? t("view_brief") : t("cta_build")}
          </Link>
          <Link
            to="/cities"
            className="inline-flex items-center justify-center rounded-stitch-button border border-stitch-neutral/30 bg-transparent px-6 py-3 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral"
          >
            {t("cta_cities")}
          </Link>
        </div>

        <p className="mt-4 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/70">
          {t("trust_note")}
        </p>

        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-neutral">
            {t("countdown_label")}
          </p>
          <h2 className="mt-3 font-stitch-headline text-2xl font-semibold text-stitch-neutral">
            {t("countdown_title")}
          </h2>
          <p className="mt-2 font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-secondary">
            {t("countdown_match")}
          </p>

          <div className="mt-8 flex items-stretch justify-center">
            <div className="flex-1 px-2">
              <div className="font-stitch-headline text-4xl font-semibold text-stitch-neutral">
                {days}
              </div>
              <div className="mt-1 font-stitch-label text-[10px] uppercase tracking-wide text-stitch-neutral/60">
                {t("days")}
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
                {t("hours")}
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
                {t("mins")}
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
                {t("secs")}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

