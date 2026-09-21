import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/utils/ui'
import type * as React from 'react'

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border border-slate-200 px-4 py-3 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4 dark:border-slate-800",
  {
    variants: {
      variant: {
        default: 'bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50',
        destructive:
          'bg-white text-red-500 *:data-[slot=alert-description]:text-red-500/90 *:[svg]:text-current dark:bg-slate-950 dark:text-red-900 dark:*:data-[slot=alert-description]:text-red-900/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        '[&_a]:underline-offset-3 font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:hover:text-slate-950 dark:[&_a]:hover:text-slate-50',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        '[&_a]:underline-offset-3 text-balance text-sm text-slate-500 dark:text-slate-400 md:text-pretty [&_a]:underline [&_a]:hover:text-slate-950 dark:[&_a]:hover:text-slate-50 [&_p:not(:last-child)]:mb-4',
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="alert-action" className={cn('absolute right-3 top-2.5', className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
