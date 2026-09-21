import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from '@/utils/ui'

function Switch({
  className,
  size = 'default',
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: 'sm' | 'default'
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-checked:bg-primary data-unchecked:bg-input',
        size === 'sm' ? 'h-4 w-7' : 'h-5 w-9',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
          size === 'sm' ? 'h-3 w-3 data-checked:translate-x-3 data-unchecked:translate-x-0' : 'h-4 w-4 data-checked:translate-x-4 data-unchecked:translate-x-0',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
