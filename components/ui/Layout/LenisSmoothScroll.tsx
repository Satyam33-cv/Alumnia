"use client";

import Lenis from "lenis";

let lenis: Lenis | null = null;

export function useLenis() {
  if (!lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1,
      infinite: false,
    });

    lenis.on("scroll", (e) => {
      // Custom scroll events can be handled here
    });
  }

  return lenis;
}

export function LenisSmoothScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.on("scroll", (e) => {
        // Trigger re-render or custom logic on scroll
      });
    }
  }, [lenis]);

  // Scroll animation loop
  useEffect(() => {
    if (lenis) {
      const tick = (time: number) => {
        lenis?.render(time);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [lenis]);

  return <div className={className}>{children}</div>;
}