"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

function getLenis(): Lenis {
  if (!lenisInstance) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
      infinite: false,
    });
  }
  return lenisInstance;
}

export function useLenis() {
  const lenis = getLenis();

  useEffect(() => {
    const tick = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => lenis.destroy();
  }, []);

  return lenis;
}

export function LenisSmoothScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  useLenis();
  return <div className={className}>{children}</div>;
}