"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCollapsible } from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";

export function Accordion({ className }: { className?: string }) {
  const { Collapsible, CollapsibleTrigger, CollapsibleContent } = useCollapsible();

  return (
    <div className={cn("space-y-2", className)}>
      <Collapsible>
        <CollapsibleTrigger>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&>svg]:shrink-0"
          >
            <span>{/* Trigger label would be passed via children */}</span>
            <svg
              className="flex h-4 w-5 shrink-0 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path d="M5 3a2 2 0 0 1 2-2h2L19 12l-7 9-7-9H7a2 2 0 0 1-2-2Z" />
              <path d="m9 9 6 6 6-6" />
            </svg>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 text-sm text-foreground overflow-hidden">
          <p>{/* Content would be passed via children */}</p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}