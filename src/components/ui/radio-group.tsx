import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { cn } from 'cn'

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn('grid w-full gap-3', className)} {...props} />
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        'group/radio-group-item group-has-[:focus-visible]/field-label:not-data-checked:border-slate-200 focus-visible:ring-3 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 aria-invalid:aria-checked:border-slate-900 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-500/40 data-checked:border-slate-900 data-checked:bg-slate-900 data-checked:text-slate-50 group-has-[:focus-visible]/field-label:data-checked:border-slate-900 dark:data-checked:bg-slate-900 dark:group-has-[:focus-visible]/field-label:not-data-checked:border-slate-800 dark:aria-invalid:border-red-900 dark:aria-invalid:ring-red-900/20 dark:aria-invalid:aria-checked:border-slate-50 dark:dark:aria-invalid:border-red-900/50 dark:dark:aria-invalid:ring-red-900/40 dark:data-checked:border-slate-50 dark:data-checked:bg-slate-50 dark:data-checked:text-slate-900 dark:group-has-[:focus-visible]/field-label:data-checked:border-slate-50 dark:dark:data-checked:bg-slate-50 peer relative flex aspect-square size-4 shrink-0 rounded-full border border-slate-200 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-slate-950 focus-visible:ring-slate-950/50 disabled:cursor-not-allowed disabled:opacity-50 group-has-[:focus-visible]/field-label:ring-0 dark:border-slate-800 dark:bg-slate-200/30 dark:dark:bg-slate-800/30 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-group-indicator" className="flex size-4 items-center justify-center">
        <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-50 dark:bg-slate-900" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
