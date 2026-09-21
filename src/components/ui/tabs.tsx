import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/ui";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      data-orientation={orientation}
      data-slot="tabs"
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
  {
    defaultVariants: {
      variant: "default",
    },
    variants: {
      variant: {
        default: "",
        line: "gap-2 border-b bg-transparent p-0",
      },
    },
  }
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      className={cn(tabsListVariants({ variant }), className)}
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-active:bg-background data-active:text-foreground data-active:shadow",
        className
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 text-sm outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
