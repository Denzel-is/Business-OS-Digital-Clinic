"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { classNames } from "@/lib/styles/class-names";

interface SpotlightTextProps {
  className?: string;
  radius?: number;
  text: string;
}

export function SpotlightText({ className, radius = 180, text }: SpotlightTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pointer, setPointer] = useState({ active: false, x: 0, y: 0 });

  return (
    <span
      className={classNames("relative block cursor-default select-none", className)}
      onMouseEnter={() => setPointer((current) => ({ ...current, active: true }))}
      onMouseLeave={() => setPointer((current) => ({ ...current, active: false }))}
      onMouseMove={(event) => {
        const bounds = containerRef.current?.getBoundingClientRect();
        if (!bounds) return;
        setPointer({
          active: true,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        });
      }}
      ref={containerRef}
    >
      <span>{text}</span>
      {!prefersReducedMotion ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-accent"
          style={{
            clipPath: pointer.active
              ? `circle(${radius}px at ${pointer.x}px ${pointer.y}px)`
              : "circle(0px at 50% 50%)",
            textShadow: "0 0 36px color-mix(in srgb, var(--ds-color-accent) 45%, transparent)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
        >
          {text}
        </motion.span>
      ) : null}
    </span>
  );
}
