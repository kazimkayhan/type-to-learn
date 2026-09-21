import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/utils/ui";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      data-slot="slider"
      defaultValue={defaultValue}
      max={max}
      min={min}
      thumbAlignment="edge"
      value={value}
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none select-none items-center">
        <SliderPrimitive.Track
          className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary"
          data-slot="slider-track"
        >
          <SliderPrimitive.Indicator
            className="absolute h-full bg-primary"
            data-slot="slider-range"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            className="block h-4 w-4 rounded-full border border-primary bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            data-slot="slider-thumb"
            key={index}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
