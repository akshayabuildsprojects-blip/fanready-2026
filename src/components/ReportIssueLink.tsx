import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const REPORT_ISSUE_URL = "https://tally.so/r/VLNb1a";

export default function ReportIssueLink() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="font-stitch-label text-xs text-stitch-primary/70 underline-offset-2 hover:underline"
      >
        {t("report_issue_guidance")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
            aria-label={t("close_report_issue")}
          />

          <div className="fixed inset-0 z-[71] flex flex-col bg-stitch-neutral text-stitch-primary">
            <div className="flex items-center justify-end border-b border-stitch-primary/10 px-4 py-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-stitch-primary/15 text-stitch-primary/70 transition hover:border-stitch-primary/30 hover:text-stitch-primary"
                aria-label={t("close_report_issue")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <iframe
              src={REPORT_ISSUE_URL}
              title={t("report_issue")}
              className="min-h-0 flex-1 border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
