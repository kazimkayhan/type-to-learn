import { useEffect, useRef } from "react";
import useIntersectionObserver from "@/hooks/use-intersection-observer";
import IconCheckCircle from "~icons/heroicons/check-circle-solid";
import { useChapterStats } from "../hooks/use-chapter-stats";

export default function Chapter({
  index,
  checked,
  dictID,
  onChange,
}: {
  index: number;
  checked: boolean;
  dictID: string;
  onChange: (index: number) => void;
}) {
  const ref = useRef<HTMLTableRowElement>(null);

  const entry = useIntersectionObserver(ref, {});
  const isVisible = !!entry?.isIntersecting;
  const chapterStatus = useChapterStats(index, dictID, isVisible);

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

  return (
    <div
      className="relative flex h-16 w-[calc(50%-0.375rem)] cursor-pointer flex-col items-start justify-center overflow-hidden rounded-xl bg-slate-100 px-3 py-2 sm:w-40 dark:bg-slate-800"
      onClick={() => onChange(index)}
      ref={ref}
    >
      <h1>Chapter {index + 1}</h1>
      <p className="pt-[2px] text-slate-600 text-xs">
        {chapterStatus
          ? chapterStatus.exerciseCount > 0
            ? `${chapterStatus.exerciseCount} sessions`
            : "Not practiced"
          : "Loading..."}
      </p>
      {Boolean(checked) && (
        <IconCheckCircle className="absolute -right-4 -bottom-4 h-18 w-18 text-6xl text-green-500 opacity-40 dark:text-green-300" />
      )}
    </div>
  );
}
