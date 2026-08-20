"use client";

import * as React from "react";
import { useTooltip } from "@radix-ui/react-tooltip";
import { User, Info } from "lucide-react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  placement?: TooltipPlacement;
  children: React.ReactNode;
  title: string;
  className?: string;
};

export function Tooltip({ placement = "top", children, title, className }: TooltipProps) {
  const { Component: TooltipComponent, trigger: TooltipTrigger } = useTooltip({
    placement,
  });

  return (
    <TooltipComponent>
      <TooltipTrigger asChild>
        <button className="relative inline-flex items-center">{children}</button>
      </TooltipTrigger>
      <div className="flex max-w-xs flex-col items-start rounded-md bg-background p-2 text-sm text-foreground shadow-sm">
        <span className="sr-only">{title}</span>
        <span className="focus:not-[focus-visible]:hidden focus-visible:block absolute right-2 top-1/2 -translate-y-1/2">
          {title}
        </span>
      </div>
    </TooltipComponent>
  );
}