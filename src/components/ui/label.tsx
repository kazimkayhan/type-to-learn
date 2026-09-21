import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/utils/ui";

const labelVariants = cva(
  "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <label className={cn(labelVariants(), className)} ref={ref} {...props} />
));
Label.displayName = "Label";

export { Label };
