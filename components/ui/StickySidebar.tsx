"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type StickySidebarProps = {
  children: React.ReactNode;
  className?: string;
  offsetTop?: number;
  offsetBottom?: number;
};

export function StickySidebar({
  children,
  className,
  offsetTop = 100,
  offsetBottom = 100,
}: StickySidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: window });
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start start", "end end"] 
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 0]);

  return (
    <div className={cn("relative", className)} ref={(el) => { if (el) { /* parent ref */ } }}>
      <motion.div
        style={{ position: "sticky", top: offsetTop, bottom: offsetBottom }}
        className="max-h-[calc(100vh-200px)] overflow-y-auto"
      >
        {children}
      </motion.div>
    </div>
  );
}