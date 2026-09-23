import { useEffect, useRef } from "react";
import IconCheckCircle from "~icons/heroicons/check-circle-solid";

export default function Chapter({
  index,
  checked,
  exerciseCount,
  onChange,
}: {
  index: number;
  checked: boolean;
  exerciseCount: number | null;
  onChange: (index: number) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (checked && ref.current !== null) {
      const button = ref.current;
      const container = button.parentElement?.parentElement?.parentElement;
      container?.scroll({
        behavior: "smooth",
        top: button.offsetTop - container.offsetTop - 300,
      });
    }
  }, [checked]);

  const isPracticed = (exerciseCount ?? 0) > 0;
  const statusLabel = isPracticed
    ? `Done · ${exerciseCount} ${exerciseCount === 1 ? "session" : "sessions"}`
    : "Not practiced";

  return (
    <button
      aria-current={checked ? "true" : undefined}
      className={`relative flex h-16 w-full cursor-pointer flex-col items-start justify-center overflow-hidden rounded-xl px-3 py-2 pr-8 text-left transition-shadow focus-visible:ring-2 focus-visible:ring-ring ${
        checked
          ? "bg-accent shadow-sm ring-2 ring-primary"
          : "bg-muted hover:bg-accent/60"
      }`}
      onClick={() => onChange(index)}
      ref={ref}
      type="button"
    >
      <span className="font-medium">Chapter {index + 1}</span>
      <span className="pt-[2px] text-muted-foreground text-xs">
        {statusLabel}
      </span>
      {isPracticed && (
        <IconCheckCircle
          aria-label="Chapter practiced"
          className="absolute top-2 right-2 h-5 w-5 text-green-500 dark:text-green-300"
        />
      )}
    </button>
  );
}
