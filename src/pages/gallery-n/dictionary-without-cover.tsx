import { useAtomValue } from "jotai";
import { type RefObject, useCallback, useMemo, useRef, useState } from "react";
import bookCover from "@/assets/book-cover.png";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import useIntersectionObserver from "@/hooks/use-intersection-observer";
import { currentDictIdAtom } from "@/store";
import type { Dictionary } from "@/typings";
import { calcChapterCount } from "@/utils";
import DictDetail from "./dict-detail";
import { useDictStats } from "./hooks/use-dict-stats";

interface Props {
  dictionary: Dictionary;
}

export default function DictionaryComponent({ dictionary }: Props) {
  const currentDictID = useAtomValue(currentDictIdAtom);
  const [open, setOpen] = useState(false);

  const divRef = useRef<HTMLButtonElement>(null);
  const entry = useIntersectionObserver(divRef as RefObject<Element>, {});
  const isVisible = !!entry?.isIntersecting;
  const dictStats = useDictStats(dictionary.id, isVisible);
  const chapterCount = useMemo(
    () => calcChapterCount(dictionary.length),
    [dictionary.length]
  );
  const isSelected = currentDictID === dictionary.id;
  const progress = useMemo(
    () =>
      dictStats
        ? Math.ceil((dictStats.exercisedChapterCount / chapterCount) * 100)
        : 0,
    [dictStats, chapterCount]
  );
  const showDescription = dictionary.description !== dictionary.name;
  const wordCountLabel = `${dictionary.length.toLocaleString()} words`;

  const onStartPractice = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        aria-label={`${dictionary.name}, ${wordCountLabel}`}
        className={`group relative flex h-auto min-h-[8.5rem] w-full min-w-0 cursor-pointer flex-col items-start justify-start overflow-hidden rounded-lg p-4 text-left shadow-lg focus-visible:ring-2 focus-visible:ring-ring ${
          isSelected ? "bg-primary" : "bg-card hover:bg-accent"
        }`}
        ref={divRef}
      >
        <h2
          className={`mb-1.5 pr-16 font-normal text-lg sm:text-xl ${
            isSelected
              ? "text-primary-foreground"
              : "text-foreground group-hover:text-primary"
          }`}
        >
          {dictionary.name}
        </h2>
        {showDescription ? (
          <p
            className={`mb-1 w-full min-w-0 truncate pr-16 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
            title={dictionary.description}
          >
            {dictionary.description}
          </p>
        ) : null}
        <p
          className={`mb-0.5 font-bold tabular-nums ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
        >
          {wordCountLabel}
        </p>
        <div className="flex w-full min-w-0 items-center pt-2">
          {progress > 0 && (
            <Progress
              className={`mr-4 flex w-full ${isSelected ? "border-primary-foreground/60" : "border-primary"}`}
              max={100}
              value={progress}
            >
              <ProgressTrack
                className={`h-2 rounded-full border bg-card ${isSelected ? "border-primary-foreground/60" : "border-primary"}`}
              >
                <ProgressIndicator
                  className={`h-full rounded-full ${isSelected ? "bg-primary-foreground/60" : "bg-primary"}`}
                  style={{ width: `calc(${progress}% )` }}
                />
              </ProgressTrack>
            </Progress>
          )}
          <img
            alt=""
            className={`absolute top-3 right-3 w-14 sm:w-16 ${isSelected ? "opacity-50" : "opacity-20"}`}
            height={64}
            src={bookCover}
            width={64}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto p-6 sm:max-w-7xl">
        <DictDetail dictionary={dictionary} onStartPractice={onStartPractice} />
      </DialogContent>
    </Dialog>
  );
}
