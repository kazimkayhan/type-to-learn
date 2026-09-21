import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/utils/ui";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 has-data-[slot=alert-action]:pr-18 dark:border-slate-800 *:[svg:not([class*='size-'])]:size-4 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50",
        destructive:
          "bg-white text-red-500 *:data-[slot=alert-description]:text-red-500/90 dark:bg-slate-950 dark:text-red-900 dark:*:data-[slot=alert-description]:text-red-900/90 *:[svg]:text-current",
      },
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      role="alert"
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-slate-950 dark:[&_a]:hover:text-slate-50",
        className
      )}
      data-slot="alert-title"
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-balance text-slate-500 text-sm md:text-pretty dark:text-slate-400 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-slate-950 dark:[&_a]:hover:text-slate-50 [&_p:not(:last-child)]:mb-4",
        className
      )}
      data-slot="alert-description"
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("absolute top-2.5 right-3", className)}
      data-slot="alert-action"
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
