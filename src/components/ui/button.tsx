import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/ui";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-md font-medium text-sm outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 gap-1.5 px-4 py-2",
        icon: "size-9",
        "icon-lg": "size-10",
        "icon-sm": "size-8",
        "icon-xs": "size-7",
        lg: "h-10 gap-1.5 px-6",
        sm: "h-8 gap-1 px-3 text-xs",
        xs: "h-7 gap-1 px-2.5 text-xs",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      },
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
