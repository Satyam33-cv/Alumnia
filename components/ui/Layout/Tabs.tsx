"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ className, defaultValue, value, onValueChange, children, ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col", className)}
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <TabsPrimitive.List className="flex w-full border-b border-border select-none">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === TabsTrigger) {
            return React.cloneElement(child);
          }
          return child;
        })}
      </TabsPrimitive.List>
      <TabsPrimitive.Content value={value || defaultValue || ""} className={cn("pt-4")}>
        {children}
      </TabsPrimitive.Content>
    </TabsPrimitive.Root>
  );
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 items-center justify-center border-b-2 border-transparent text-sm font-medium",
        "hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-[state=active]:border-primary data-[state=active]:text-primary",
        props.className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;