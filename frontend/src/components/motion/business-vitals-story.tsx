"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { businessVitals } from "@/content/home";

export function BusinessVitalsStory() {
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!root) {
      return;
    }

    let cancelled = false;
    let setupVersion = 0;
    let teardown: () => void = () => undefined;

    async function setupScrollStory(storyRoot: HTMLOListElement) {
      const currentVersion = ++setupVersion;
      teardown();
      teardown = () => undefined;

      if (reducedMotionQuery.matches) {
        storyRoot.setAttribute("data-motion-mode", "reduced");
        return;
      }

      storyRoot.setAttribute("data-motion-mode", "loading");
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled || currentVersion !== setupVersion || reducedMotionQuery.matches) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-vital-row]", storyRoot);

        for (const row of rows) {
          const before = row.querySelector<HTMLElement>("[data-vital-before]");
          const after = row.querySelector<HTMLElement>("[data-vital-after]");
          const progress = row.querySelector<HTMLElement>("[data-vital-progress]");

          gsap.set(after, { opacity: 0.36, x: 12 });
          gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

          gsap
            .timeline({
              scrollTrigger: {
                end: "bottom 46%",
                scrub: 0.55,
                start: "top 82%",
                trigger: row,
              },
            })
            .to(before, { opacity: 0.38, x: -10 }, 0)
            .to(after, { opacity: 1, x: 0 }, 0)
            .to(progress, { scaleX: 1 }, 0)
            .to(row, { backgroundColor: "rgba(103, 232, 194, 0.035)" }, 0);
        }
      }, storyRoot);

      storyRoot.setAttribute("data-motion-mode", "enhanced");
      teardown = () => context.revert();
    }

    const handlePreferenceChange = () => void setupScrollStory(root);
    reducedMotionQuery.addEventListener("change", handlePreferenceChange);
    void setupScrollStory(root);

    return () => {
      cancelled = true;
      setupVersion += 1;
      reducedMotionQuery.removeEventListener("change", handlePreferenceChange);
      teardown();
    };
  }, []);

  return (
    <ol data-motion-mode="loading" data-vitals-motion ref={rootRef}>
      {businessVitals.map((vital, index) => (
        <li
          className="relative grid gap-5 overflow-hidden border-b border-line px-2 py-7 sm:grid-cols-[2.3rem_1fr_auto_1fr] sm:items-center"
          data-vital-row
          key={vital.label}
        >
          <span className="font-mono text-xs text-ink-faint">0{index + 1}</span>
          <div data-vital-before>
            <p className="text-sm text-ink-faint">{vital.label}</p>
            <p className="mt-2 font-medium text-ink-muted">{vital.before}</p>
          </div>
          <ArrowRight aria-hidden="true" className="hidden size-4 text-accent sm:block" />
          <div className="border-l border-accent/35 pl-4" data-vital-after>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-accent sm:hidden">
              Target state
            </p>
            <p className="mt-2 font-semibold text-ink sm:mt-0">{vital.after}</p>
          </div>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-accent"
            data-vital-progress
          />
        </li>
      ))}
    </ol>
  );
}
