import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { cn } from '@/utils/ui'

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn('grid w-full gap-3', className)} {...props} />
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        'peer relative flex aspect-square size-4 shrink-0 rounded-full border border-slate-300 outline-none transition-all',
        'hover:border-slate-400 hover:ring-2 hover:ring-slate-200',
        'focus-visible:border-slate-950 focus-visible:ring-2 focus-visible:ring-slate-950/20',
        'data-checked:border-indigo-600 data-checked:bg-indigo-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-slate-600 dark:hover:border-slate-500 dark:hover:ring-slate-700',
        'dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/20',
        'dark:data-checked:border-indigo-500 dark:data-checked:bg-indigo-500',
        'aria-invalid:border-red-500 aria-invalid:ring-2 aria-invalid:ring-red-500/20',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-group-indicator" className="flex size-4 items-center justify-center">
        <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
