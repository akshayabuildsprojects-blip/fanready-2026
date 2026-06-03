import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import "./index.css";

const CURRENT_APP_VERSION = "1.0.0";
const APP_VERSION_KEY = "app_version";
const RESET_STORAGE_KEYS = ["tripAnswers", "selectedCities"];
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

  const banner = document.createElement("button");
  banner.id = UPDATE_BANNER_ID;
  banner.type = "button";
  banner.textContent = "Update available — tap to refresh";
  banner.setAttribute("aria-live", "polite");
  banner.style.position = "fixed";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.bottom = "0";
  banner.style.zIndex = "2147483647";
  banner.addEventListener("click", onRefresh, { once: true });

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
