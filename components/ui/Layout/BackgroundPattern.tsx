"use client";

import { useEffect, useState } from "react";

type BackgroundPatternProps = {
  className?: string;
  speed?: number;
  color?: string;
};

export function BackgroundPattern({
  className,
  speed = 0.5,
  color = "brass",
}: BackgroundPatternProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => prev + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    brass: "#b8863b",
    sage: "#5c7a6b",
    clay: "#b5573f",
    ink: "#12213d",
    paper: "#f7f5f0",
  };

  const primaryColor = color === "random"
    ? Object.values(colors)[Math.floor(Math.random() * Object.values(colors).length)]
    : colors[color];

  return (
    <div
      className={`min-h-[400px] relative overflow-hidden ${className}`}
      style={{
        background: `
          linear-gradient(135deg, ${primaryColor} 25%, transparent 25%),
          linear-gradient(225deg, ${primaryColor} 25%, transparent 25%),
          linear-gradient(315deg, ${primaryColor} 25%, transparent 25%),
          linear-gradient(45deg, ${primaryColor} 25%, transparent 25%)
        `,
        backgroundSize: "50px 50px",
        animation: `pattern-shift ${speed}s linear infinite`,
      }
    />
  );
}

export const patternCss = `
  @keyframes pattern-shift {
    0% { background-position: 0px 0px; }
    100% { background-position: -50px -50px; }
  }
`;