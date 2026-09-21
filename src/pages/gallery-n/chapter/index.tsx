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

  const statusLabel =
    exerciseCount && exerciseCount > 0
      ? `${exerciseCount} ${exerciseCount === 1 ? "session" : "sessions"}`
      : "Not practiced";

  return (
    <button
      aria-current={checked ? "true" : undefined}
      className="relative flex h-16 w-[calc(50%-0.375rem)] cursor-pointer flex-col items-start justify-center overflow-hidden rounded-xl bg-slate-100 px-3 py-2 pr-8 text-left focus-visible:ring-2 focus-visible:ring-indigo-400 sm:w-40 dark:bg-slate-800"
      onClick={() => onChange(index)}
      ref={ref}
      type="button"
    >
      <span className="font-medium">Chapter {index + 1}</span>
      <span className="pt-[2px] text-slate-600 text-xs dark:text-slate-400">
        {statusLabel}
      </span>
      {Boolean(checked) && (
        <IconCheckCircle className="absolute top-2 right-2 h-5 w-5 text-green-500 dark:text-green-300" />
      )}
    </button>
  );
}
