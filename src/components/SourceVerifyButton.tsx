interface SourceVerifyButtonProps {
  label: string;
  url: string;
}

export default function SourceVerifyButton({
  label,
  url,
}: SourceVerifyButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block border border-stitch-primary bg-stitch-primary px-4 py-2 font-stitch-label text-xs font-bold uppercase tracking-wide text-stitch-neutral transition-opacity hover:opacity-90"
      style={{ borderRadius: "var(--radius-stitch-button)" }}
    >
      {label}
    </a>
  );
}
