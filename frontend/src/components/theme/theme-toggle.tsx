"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const themeEvent = "business-os-theme-change";

type Theme = "dark" | "light";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  const nextTheme = theme === "dark" ? "light" : "dark";
  const label = nextTheme === "light" ? "Включить светлую тему" : "Включить тёмную тему";

  function toggleTheme() {
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("business-os-theme", nextTheme);
    window.dispatchEvent(new Event(themeEvent));
  }

  return (
    <button
      aria-label={label}
      className="grid size-10 shrink-0 place-items-center rounded-control border border-line bg-surface-raised text-ink-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/60 hover:text-ink"
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
