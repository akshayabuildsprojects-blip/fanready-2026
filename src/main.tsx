import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./i18n.ts";
import "./index.css";

const CURRENT_APP_VERSION = "1.0.0";
const APP_VERSION_KEY = "app_version";
const RESET_STORAGE_KEYS = ["tripAnswers", "selectedCities", "selectedMatches"];
const UPDATE_BANNER_ID = "pwa-update-banner";

function resetVersionedLocalStorage() {
  try {
    if (localStorage.getItem(APP_VERSION_KEY) === CURRENT_APP_VERSION) return;

    for (const key of RESET_STORAGE_KEYS) {
      localStorage.removeItem(key);
    }
    localStorage.setItem(APP_VERSION_KEY, CURRENT_APP_VERSION);
  } catch {
    // Ignore storage errors so app boot is not blocked in restricted contexts.
  }
}

function showUpdateBanner(onRefresh: () => void) {
  if (document.getElementById(UPDATE_BANNER_ID)) return;

  const banner = document.createElement("div");
  banner.id = UPDATE_BANNER_ID;
  banner.className =
    "fixed inset-x-0 z-[60] border-y-2 border-stitch-secondary bg-stitch-primary px-4 py-4 font-stitch-body text-stitch-neutral animate-pulse";
  banner.style.bottom = "calc(4.75rem + env(safe-area-inset-bottom))";
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("role", "status");

  const inner = document.createElement("div");
  inner.className =
    "mx-auto flex max-w-5xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between";

  const text = document.createElement("p");
  text.className = "font-stitch-label text-[13px] font-bold uppercase tracking-wide";
  text.textContent =
    "New update available — tap to refresh for the latest matchday information";

  const button = document.createElement("button");
  button.type = "button";
  button.className =
    "w-full shrink-0 rounded-stitch-button bg-stitch-neutral px-5 py-3 font-stitch-label text-[13px] font-bold uppercase tracking-wide text-stitch-primary sm:w-auto";
  button.textContent = "REFRESH NOW";
  button.addEventListener("click", onRefresh, { once: true });

  inner.append(text, button);
  banner.appendChild(inner);

  document.body.appendChild(banner);
}

resetVersionedLocalStorage();

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    showUpdateBanner(() => {
      void updateSW(true);
    });
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
