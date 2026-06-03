const dataSources = [
  "FIFA official matchday information",
  "Host city transport and shuttle pages",
  "Stadium bag and entry policies",
  "US/Canada/Mexico government travel advisories",
  "Local transit authority matchday schedules",
];

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="font-stitch-label text-[10px] font-bold uppercase tracking-[0.24em] text-stitch-secondary">
          Sources
        </p>
        <h1 className="mt-2 font-stitch-headline text-3xl font-bold text-stitch-primary">
          Sources & Methodology
        </h1>
        <p className="mt-4 font-stitch-body text-sm leading-6 text-stitch-primary/80">
          FanReady 2026 is built from publicly available official information.
          All guidance should be verified through official sources before
          matchday.
        </p>
      </header>

      <section className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          Data Sources
        </h2>
        <ul className="mt-4 space-y-3 font-stitch-body text-sm text-stitch-primary/80">
          {dataSources.map((source) => (
            <li key={source} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-stitch-secondary" />
              <span>{source}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          Methodology
        </h2>
        <p className="mt-4 font-stitch-body text-sm leading-6 text-stitch-primary/80">
          The friction index scores each host city using a weighted factor
          methodology across matchday transit complexity, stadium access,
          lodging distance, policy restrictions, local disruption risk, and
          traveler readiness. Higher scores indicate more planning friction and
          a greater need to verify details before matchday.
        </p>
      </section>

      <section className="rounded-stitch-card border border-stitch-primary/10 bg-white/35 p-5">
        <h2 className="font-stitch-label text-xs font-bold uppercase tracking-[0.2em] text-stitch-primary">
          Disclaimer
        </h2>
        <p className="mt-4 font-stitch-body text-sm leading-6 text-stitch-primary/80">
          This is an unofficial tool. Not affiliated with FIFA, host cities,
          stadiums, or transit agencies. Always verify matchday information
          through official sources.
        </p>
      </section>

      <div className="border-t border-stitch-primary/10 pt-5">
        <p className="font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary/60">
          Last reviewed: June 2026
        </p>
      </div>
    </div>
  );
}
