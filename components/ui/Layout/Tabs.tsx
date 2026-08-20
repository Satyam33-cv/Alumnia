"use client";

import * as React from "react";
import { useTabs } from "@radix-ui/react-tabs";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Tabs({ className }: { className?: string }) {
  const { TabList, Tab, TabContent, TabListIndicators } = useTabs();

  return (
    <div className={cn("border-b", className)}>
      <TabList className="grid w-full grid-cols-2 border-b border-border select-none">
        <TabListIndicators />
        <Tab
          value="1"
          className="border-b-2 border-b-transparent text-sm font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* Label passed via children */}
        </Tab>
        <Tab
          value="2"
          className="border-b-2 border-b-transparent text-sm font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* Label passed via children */}
        </Tab>
      </TabList>

      <TabContent className="pt-4">
        <div>{/* Content passed via children */}</div>
      </TabContent>
    </div>
  );
}