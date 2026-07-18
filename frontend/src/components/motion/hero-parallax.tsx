"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

interface HeroParallaxProps {
  children: ReactNode;
}

export function HeroParallax({ children }: HeroParallaxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end start"],
    target: rootRef,
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 54]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.975]);

  return (
    <motion.div
      {...(prefersReducedMotion ? {} : { style: { scale, y } })}
      data-motion-mode={prefersReducedMotion ? "reduced" : "enhanced"}
      data-motion-parallax="hero-media"
      ref={rootRef}
    >
      {children}
    </motion.div>
  );
}
