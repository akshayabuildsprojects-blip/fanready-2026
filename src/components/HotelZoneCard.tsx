interface HotelZoneCardProps {
  zone: string;
  pros: string;
  risks: string;
  action: string;
}

export default function HotelZoneCard({
  zone,
  pros,
  risks,
  action,
}: HotelZoneCardProps) {
  return (
    <article className="rounded-stitch-card border border-stitch-primary/10 bg-stitch-neutral p-4">
      <h3 className="font-stitch-headline text-lg font-semibold text-stitch-primary">
        {zone}
      </h3>
      <dl className="mt-3 space-y-3">
        <div>
          <dt className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-tertiary">
            Pros
          </dt>
          <dd className="mt-1 font-stitch-body text-sm text-stitch-primary/90">
            {pros}
          </dd>
        </div>
        <div>
          <dt className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-danger">
            Risks
          </dt>
          <dd className="mt-1 font-stitch-body text-sm text-stitch-primary/90">
            {risks}
          </dd>
        </div>
        <div>
          <dt className="font-stitch-label text-[10px] font-bold uppercase tracking-wide text-stitch-primary">
            Action
          </dt>
          <dd className="mt-1 font-stitch-label text-xs text-stitch-primary/80">
            {action}
          </dd>
        </div>
      </dl>
    </article>
  );
}
