"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { classNames } from "@/lib/styles/class-names";

type RevealVariant = "fade" | "rise" | "wipe";

const revealVariants: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0.84 },
    visible: { opacity: 1 },
  },
  rise: {
    hidden: { opacity: 0.84, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  wipe: {
    hidden: { clipPath: "inset(0 0 14% 0)", opacity: 0.84, y: 10 },
    visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0 },
  },
};

interface MotionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
}

const subscribeToHydration = () => () => undefined;

export function MotionReveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: MotionRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  if (!isHydrated || prefersReducedMotion) {
    return (
      <div
        className={className}
        data-motion-mode={prefersReducedMotion ? "reduced" : "static"}
        data-motion-reveal={variant}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={classNames("will-change-transform", className)}
      data-motion-mode="enhanced"
      data-motion-reveal={variant}
      initial="hidden"
      transition={{ delay, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      variants={revealVariants[variant]}
      viewport={{ amount: 0.16, once: true }}
      whileInView="visible"
    >
      {children}
    </motion.div>
  );
}
