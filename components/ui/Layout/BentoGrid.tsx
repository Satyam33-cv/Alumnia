"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type BentoItem = {
  id: string;
  i: string;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  move?: boolean;
  children: React.ReactNode;
};

type BentoGridProps = {
  items: BentoItem[];
  className?: string;
  gutter?: number;
};

const gridSettings: Record<string, { w: number; h: number }> = {
  stats: { w: 2, h: 1 },
  cards: { w: 3, h: 2 },
  chart: { w: 4, h: 3 },
  avatar: { w: 1, h: 1 },
  empty: { w: 1, h: 1 },
};

export function BentoGrid({ items, className, gutter = 12 }: BentoGridProps) {
  const [layout, setLayout] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    // Initialize layout
    const initial: Record<string, { x: number; y: number }> = {};
    items.forEach((item) => {
      initial[item.id] = { x: 0, y: 0 };
    });
    setLayout(initial);
  }, [items]);

  return (
    <div
      className={cn(`grid gap-${gutter}px`, className)}
      style={{ gridTemplateColumns: `repeat(auto-fill, minmax(280px, 1fr))` }}
    >
      {items.map((item) => {
        const style = layout[item.id];
        const setting = gridSettings[item.i] || { w: 2, h: 1 };

        return (
          <motion.div
            key={item.id}
            className="bento-item"
            style={{ gridArea: item.i }}
            style={{
              ...style,
              width: `${setting.w * 100}%`,
              height: `${setting.h * 100}%`,
            }}
            drag
            onDragStart={(e: DragEvent) => {
              e.dataTransfer?.setData("text/plain", item.id);
            }}
            whileHover={motion.whileHover}
            variants={{
              visible: {
                transition: { type: "spring", stiffness: 300, damping: 30 },
              },
            }}
          >
            <div
              className="p-4 rounded-lg border bg-background hover:bg-background/80 transition-colors cursor-grab"
              onDragStart={(e: DragEvent) => e.dataTransfer?.setData("text/plain", item.id)}
            >
              {item.children}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}