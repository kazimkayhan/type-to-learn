import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { cn } from 'cn'

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn('data-horizontal:w-full data-vertical:h-full', className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col relative flex w-full touch-none select-none items-center">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5 relative grow select-none overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="data-horizontal:h-full data-vertical:w-full select-none bg-slate-900 dark:bg-slate-50"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="focus-visible:outline-hidden block size-4 shrink-0 select-none rounded-full border border-slate-200 border-slate-900 bg-white shadow-sm ring-slate-950/50 transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-50 dark:border-slate-800 dark:ring-slate-300/50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
