import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

type TabId = "home" | "cities" | "brief";

const tabs: { id: TabId; to: string; labelKey: string; icon: "home" | "list" | "brief" }[] =
  [
    { id: "home", to: "/", labelKey: "home", icon: "home" },
    { id: "cities", to: "/cities", labelKey: "cities", icon: "list" },
    { id: "brief", to: "/brief", labelKey: "brief", icon: "brief" },
  ];

function TabIcon({ name }: { name: (typeof tabs)[number]["icon"] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "brief":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
  }
}

function activeTabFromPath(pathname: string): TabId | null {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/cities")) return "cities";
  if (pathname.startsWith("/brief") || pathname.startsWith("/my-brief")) {
    return "brief";
  }
  return null;
}

export default function BottomTabNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const active = activeTabFromPath(pathname);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stitch-primary/10 bg-stitch-neutral"
      aria-label={t("primary_navigation")}
    >
      <div className="mx-auto flex max-w-5xl">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              className={`flex flex-1 flex-col items-center gap-1 px-2 py-3 font-stitch-label text-[9px] font-bold uppercase tracking-wide ${
                isActive
                  ? "bg-stitch-primary/5 text-stitch-primary"
                  : "text-stitch-primary/60"
              }`}
            >
              <TabIcon name={tab.icon} />
              {t(tab.labelKey)}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
