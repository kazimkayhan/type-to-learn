import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'

const buttonVariants = cva(
<<<<<<< HEAD
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
=======
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-slate-200 border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-slate-950 focus-visible:ring-3 focus-visible:ring-slate-950/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 dark:border-slate-800 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:border-red-900/50 dark:dark:aria-invalid:ring-red-900/40",
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        outline:
          'border-slate-200 bg-white shadow-xs hover:bg-slate-100 hover:text-slate-950 aria-expanded:bg-slate-100 aria-expanded:text-slate-950 dark:border-slate-200 dark:bg-slate-200/30 dark:hover:bg-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:aria-expanded:bg-slate-800 dark:aria-expanded:text-slate-50 dark:dark:border-slate-800 dark:dark:bg-slate-800/30 dark:dark:hover:bg-slate-800/50',
        secondary:
          'bg-slate-100 text-slate-900 hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-slate-100 aria-expanded:text-slate-900 dark:bg-slate-800 dark:text-slate-50 dark:aria-expanded:bg-slate-800 dark:aria-expanded:text-slate-50',
        ghost:
          'hover:bg-slate-100 hover:text-slate-950 aria-expanded:bg-slate-100 aria-expanded:text-slate-950 dark:hover:bg-slate-100/50 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:aria-expanded:bg-slate-800 dark:aria-expanded:text-slate-50 dark:dark:hover:bg-slate-800/50',
        destructive:
          'bg-red-500/10 text-red-500 hover:bg-red-500/20 focus-visible:border-red-500/40 focus-visible:ring-red-500/20 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:focus-visible:ring-red-500/40 dark:bg-red-900/10 dark:text-red-900 dark:hover:bg-red-900/20 dark:focus-visible:border-red-900/40 dark:focus-visible:ring-red-900/20 dark:dark:bg-red-900/20 dark:dark:hover:bg-red-900/30 dark:dark:focus-visible:ring-red-900/40',
        link: 'text-slate-900 underline-offset-4 hover:underline dark:text-slate-50',
      },
      size: {
        default:
          'h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
        lg: 'h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md',
        'icon-lg': 'size-10',
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
