<<<<<<< HEAD
import { cn } from '@/utils/ui'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import * as React from 'react'
=======
'use client'
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from 'cn'

<<<<<<< HEAD
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground', className)}
=======
function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('group/tabs data-horizontal:flex-col flex gap-2', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-slate-500 group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none dark:text-slate-400',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 dark:bg-slate-800',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsList({ className, variant = 'default', ...props }: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), className)} {...props} />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:outline-ring has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 border-transparent px-2 py-1 text-sm font-medium text-slate-950/60 transition-all hover:text-slate-950 focus-visible:border-slate-950 focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-slate-950/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:border-slate-800 dark:dark:text-slate-400 dark:text-slate-50/60 dark:text-slate-500 dark:dark:hover:text-slate-50 dark:hover:text-slate-50 dark:hover:text-slate-950 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        'group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent group-data-[variant=line]/tabs-list:bg-transparent',
        'data-active:bg-white data-active:text-slate-950 dark:data-active:border-slate-200 dark:data-active:bg-slate-200/30 dark:data-active:text-slate-950 dark:data-active:bg-slate-950 dark:data-active:text-slate-50 dark:dark:data-active:border-slate-800 dark:dark:data-active:bg-slate-800/30 dark:dark:data-active:text-slate-50',
        'group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100 after:absolute after:bg-slate-950 after:opacity-0 after:transition-opacity dark:after:bg-slate-50',
        className,
      )}
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
      {...props}
    />
  )
}

<<<<<<< HEAD
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
=======
function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn('flex-1 text-sm outline-none', className)} {...props} />
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
