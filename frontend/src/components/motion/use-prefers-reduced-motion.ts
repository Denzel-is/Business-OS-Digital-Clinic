"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(query).matches;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
