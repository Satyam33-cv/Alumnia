"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number; // 0-1, higher = more parallax
  classNameImage?: string;
};

export function Parallax({
  children,
  className,
  speed = 0.3,
  classNameImage,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollY, [0, 1], [`${speed * 100}%`, `${-speed * 100}%`]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{ y }}
        className={cn("absolute inset-0 -z-10 will-change-transform", classNameImage)}
      >
        {children}
      </motion.div>
    </div>
  );
}

import { cn } from "@/lib/utils";