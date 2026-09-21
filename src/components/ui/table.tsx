import type * as React from "react";
import { cn } from "@/utils/ui";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      className="relative w-full overflow-x-auto"
      data-slot="table-container"
    >
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "border-t bg-slate-100/50 font-medium dark:bg-slate-800/50 [&>tr]:last:border-b-0",
        className
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-slate-100/50 has-aria-expanded:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800 dark:has-aria-expanded:bg-slate-800/50 dark:hover:bg-slate-800/50",
        className
      )}
      data-slot="table-row"
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-slate-950 dark:text-slate-50 [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      className={cn(
        "mt-4 text-slate-500 text-sm dark:text-slate-400",
        className
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
