import { Outlet } from "react-router-dom";
import BottomTabNav from "./BottomTabNav.tsx";
import NavBar from "./NavBar.tsx";
import ReportIssueLink from "./ReportIssueLink.tsx";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-stitch-neutral text-stitch-primary">
      <NavBar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-stitch-primary/10 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <p className="font-stitch-label text-[10px] uppercase tracking-wide text-stitch-primary/60">
            Disclaimer: This guidance is informational and may change. Always
            confirm official host city and stadium policies close to match day.
          </p>
          <div className="mt-2" />
          <ReportIssueLink />
        </div>
      </footer>
      <BottomTabNav />
    </div>
  );
}
