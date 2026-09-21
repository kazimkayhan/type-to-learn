"use client";

import type * as React from "react";
import { cn } from "@/utils/ui";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  decorative?: boolean;
  orientation?: "horizontal" | "vertical";
}

const Separator = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ref,
  ...props
}: SeparatorProps & { ref?: React.RefObject<HTMLDivElement | null> }) => (
  <div
    aria-orientation={decorative ? undefined : orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    ref={ref}
    role={decorative ? "none" : "separator"}
    {...props}
  />
);
Separator.displayName = "Separator";

export { Separator };
