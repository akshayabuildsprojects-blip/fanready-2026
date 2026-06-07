import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomTabNav from "./BottomTabNav.tsx";
import NavBar from "./NavBar.tsx";
import ReportIssueLink from "./ReportIssueLink.tsx";

export default function Layout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-stitch-neutral text-stitch-primary">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer
        className="border-t border-stitch-primary/10 px-4 py-6"
        style={{ paddingBottom: "calc(8rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-5xl">
          <p className="overflow-visible break-words font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary/60">
            {t("unofficial_tool")}
          </p>
          <div className="mt-2" />
          <ReportIssueLink />
        </div>
      </footer>
      <BottomTabNav />
    </div>
  );
}
