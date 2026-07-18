"use client";

import { useEffect, useState, type ComponentType } from "react";

type MotionMode = "compact" | "enhanced" | "loading" | "reduced" | "static";

function supportsWebGl() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
}

function StaticDefenseLayers() {
  return (
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="absolute size-52 rotate-6 border border-accent/15" />
      <div className="absolute size-40 -rotate-6 border border-accent/25" />
      <div className="absolute size-28 rotate-12 border border-accent/40" />
      <div className="size-7 rotate-45 border border-accent bg-accent/10" />
    </div>
  );
}

export function SecurityDefenseVisual() {
  const [CanvasScene, setCanvasScene] = useState<ComponentType | null>(null);
  const [mode, setMode] = useState<MotionMode>("loading");

  useEffect(() => {
    let active = true;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewportQuery = window.matchMedia("(max-width: 767px)");

    async function selectExperience() {
      if (reducedMotionQuery.matches) {
        setCanvasScene(null);
        setMode("reduced");
        return;
      }

      if (compactViewportQuery.matches) {
        setCanvasScene(null);
        setMode("compact");
        return;
      }

      if (!supportsWebGl()) {
        setCanvasScene(null);
        setMode("static");
        return;
      }

      setMode("loading");
      const canvasModule = await import("@/components/motion/security-defense-canvas");

      if (active && !reducedMotionQuery.matches && !compactViewportQuery.matches) {
        setCanvasScene(() => canvasModule.SecurityDefenseCanvas);
        setMode("enhanced");
      }
    }

    const handlePreferenceChange = () => void selectExperience();
    reducedMotionQuery.addEventListener("change", handlePreferenceChange);
    compactViewportQuery.addEventListener("change", handlePreferenceChange);
    void selectExperience();

    return () => {
      active = false;
      reducedMotionQuery.removeEventListener("change", handlePreferenceChange);
      compactViewportQuery.removeEventListener("change", handlePreferenceChange);
    };
  }, []);

  return (
    <div
      aria-label="Трёхмерная схема многоуровневой защиты"
      className="relative h-64 overflow-hidden border-b border-line bg-surface-inset"
      data-motion-mode={mode}
      data-security-visual
      role="img"
    >
      {CanvasScene ? <CanvasScene /> : <StaticDefenseLayers />}
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-faint">
        <span>Layer topology</span>
        <span>{mode === "enhanced" ? "Live model" : "Static model"}</span>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 flex justify-between gap-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-ink-faint">
        <span>Edge</span>
        <span>Application</span>
        <span>Data</span>
      </div>
    </div>
  );
}
