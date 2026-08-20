"use client";

type BackgroundPatternProps = {
  className?: string;
  speed?: number;
  color?: string;
  children?: React.ReactNode;
};

const colorMap: Record<string, string> = {
  brass: "#b8863b",
  sage: "#5c7a6b",
  clay: "#b5573f",
  ink: "#12213d",
  paper: "#f7f5f0",
};

export function BackgroundPattern({
  className,
  speed = 0.5,
  color = "brass",
  children,
}: BackgroundPatternProps) {
  const primaryColor = colorMap[color] || colorMap.brass;

  return (
    <div
      className={className || "min-h-[400px] relative overflow-hidden"}
      style={{
        background: `linear-gradient(135deg, ${primaryColor} 25%, transparent 25%), linear-gradient(225deg, ${primaryColor} 25%, transparent 25%), linear-gradient(315deg, ${primaryColor} 25%, transparent 25%), linear-gradient(45deg, ${primaryColor} 25%, transparent 25%)`,
        backgroundSize: "50px 50px",
        animation: `pattern-shift ${speed}s linear infinite`,
      }}
    >
      {children}
    </div>
  );
}
