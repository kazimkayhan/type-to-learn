import { useAtomValue } from "jotai";
import { useMemo, useRef } from "react";
import bookCover from "@/assets/book-cover.png";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { currentDictIdAtom } from "@/store";
import type { Dictionary } from "@/typings";
import { calcChapterCount } from "@/utils";
import DictDetail from "./DictDetail";
import { useDictStats } from "./hooks/useDictStats";

interface Props {
  dictionary: Dictionary;
}

export default function DictionaryComponent({ dictionary }: Props) {
  const currentDictID = useAtomValue(currentDictIdAtom);

  const divRef = useRef<HTMLDivElement>(null);
  const entry = useIntersectionObserver(divRef, {});
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

  return (
    <Dialog>
      <div
        className={`group flex h-auto min-h-[8.5rem] w-full min-w-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg p-4 text-left shadow-lg focus:outline-none ${
          isSelected
            ? "bg-indigo-400"
            : "bg-zinc-50 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700"
        }`}
        ref={divRef}
        role="button"
      >
        <DialogTrigger className="relative mt-1 flex h-full w-full min-w-0 flex-col items-start justify-start">
          <h1
            className={`mb-1.5 pr-16 font-normal text-lg sm:text-xl ${
              isSelected
                ? "text-white"
                : "text-gray-800 group-hover:text-indigo-400 dark:text-gray-200"
            }`}
          >
            {dictionary.name}
          </h1>
          <TooltipProvider>
            <Tooltip delayDuration={400}>
              <TooltipTrigger>
                <p
                  className={`mb-1 w-full min-w-0 truncate pr-16 ${isSelected ? "text-white" : "text-gray-600 dark:text-gray-200"}`}
                >
                  {dictionary.description}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${dictionary.description}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <p
            className={`mb-0.5 font-bold ${isSelected ? "text-white" : "text-gray-600 dark:text-gray-200"}`}
          >
            {dictionary.length} words
          </p>
          <div className="flex w-full min-w-0 items-center pt-2">
            {progress > 0 && (
              <Progress
                className={`mr-4 flex w-full ${isSelected ? "border-indigo-600" : "border-indigo-400"}`}
                max={100}
                value={progress}
              >
                <ProgressTrack
                  className={`h-2 rounded-full border bg-white ${isSelected ? "border-indigo-600" : "border-indigo-400"}`}
                >
                  <ProgressIndicator
                    className={`h-full rounded-full ${isSelected ? "bg-indigo-600" : "bg-indigo-400"}`}
                    style={{ width: `calc(${progress}% )` }}
                  />
                </ProgressTrack>
              </Progress>
            )}
            <img
              alt=""
              className={`absolute top-3 right-3 w-14 sm:w-16 ${isSelected ? "opacity-50" : "opacity-20"}`}
              src={bookCover}
            />
          </div>
        </DialogTrigger>
      </div>
      <DialogContent className="!rounded-2xl sm:!rounded-[20px] max-h-[90dvh] w-[min(60rem,calc(100vw-1.25rem))] max-w-none overflow-y-auto p-3 sm:p-6">
        <DictDetail dictionary={dictionary} />
      </DialogContent>
    </Dialog>
  );
}
