import { useTranslation } from "react-i18next";

export default function GuidePage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="font-stitch-headline text-3xl font-bold text-stitch-primary">
        {t("guide")}
      </h1>
      <p className="mt-2 font-stitch-body text-sm text-stitch-primary/80">
        {t("guide_placeholder")}
      </p>
    </div>
  );
}
