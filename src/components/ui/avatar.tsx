import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { cn } from 'cn'
import type * as React from 'react'

function Avatar({
  className,
  size = 'default',
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: 'default' | 'sm' | 'lg'
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        'group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-slate-200 after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:border-slate-800 dark:after:mix-blend-lighten',
        className,
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn('aspect-square size-full rounded-full object-cover', className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        'flex size-full items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 group-data-[size=sm]/avatar:text-xs dark:bg-slate-800 dark:text-slate-400',
        className,
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        'absolute bottom-0 right-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-slate-900 text-slate-50 bg-blend-color ring-2 ring-white dark:bg-slate-50 dark:text-slate-900 dark:ring-slate-950',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        'group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-white dark:*:data-[slot=avatar]:ring-slate-950',
        className,
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        'group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 relative flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-500 ring-2 ring-white dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-950 [&>svg]:size-4',
        className,
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge }
