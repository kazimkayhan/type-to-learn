import { Switch as SwitchPrimitive } from '@base-ui/react/switch'
import { cn } from 'cn'

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
        'group/switch shadow-xs focus-visible:ring-3 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 data-checked:bg-slate-900 data-unchecked:bg-slate-200 dark:data-unchecked:bg-slate-200/80 data-disabled:cursor-not-allowed data-disabled:opacity-50 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:border-red-900/50 dark:dark:aria-invalid:ring-red-900/40 dark:data-checked:bg-slate-50 dark:data-unchecked:bg-slate-800 dark:dark:data-unchecked:bg-slate-800/80 peer relative inline-flex shrink-0 items-center rounded-full border border-slate-200 border-transparent outline-none transition-all after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-slate-950 focus-visible:ring-slate-950/50 group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 data-[size=default]:h-[18.4px] data-[size=sm]:h-[14px] data-[size=default]:w-[32px] data-[size=sm]:w-[24px] dark:border-slate-800 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-slate-50 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-slate-950 dark:dark:data-checked:bg-slate-900 dark:dark:data-unchecked:bg-slate-50 pointer-events-none block rounded-full bg-white ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 dark:bg-slate-950"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
