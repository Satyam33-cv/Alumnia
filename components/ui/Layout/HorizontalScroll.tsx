"use client";

import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type HorizontalScrollProps = {
  children: React.ReactNode;
  className?: string;
  classNameItem?: string;
  gap?: number;
  showScrollbar?: boolean;
  snapAlign?: "start" | "center" | "end";
};

export function HorizontalScroll({
  children,
  className,
  classNameItem,
  gap = 16,
  showScrollbar = false,
  snapAlign = "start",
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  const { scrollX: scrollXMotion } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollX(el.scrollLeft);
      setIsScrolling(true);
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollProgress = useTransform(
    useScroll({ target: containerRef, offset: ["start start", "end end"] }).scrollX,
    [0, 1],
    [0, 1]
  );

  const childArray = React.Children.toArray(children);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex gap-4 overflow-x-auto snap-x",
        "scroll-smooth touch-pan-x",
        "pb-4",
        showScrollbar ? "scrollbar-thin scrollbar-thumb-brass-500/30 scrollbar-track-transparent" : "scrollbar-hide",
        className
      )}
      style={{ gap: gap, scrollSnapType: "x mandatory" }}
    >
      {childArray.map((child, index) => (
        <div
          key={index}
          className={cn(
            "flex-shrink-0 snap-start",
            classNameItem,
            "scroll-snap-align-start"
          )}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement, {
                style: { ...(child.props.style || {}), scrollSnapAlign: "start" },
              })
            : child}
        </div>
      ))}
      
      {/* Scroll indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent pointer-events-none">
        <motion.div
          className="h-full bg-brass-500/50"
          style={{ width: "20%" }}
          animate={{ x: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}