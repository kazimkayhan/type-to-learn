import { useAtom, useAtomValue } from "jotai";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Tooltip from "@/components/tooltip";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChapterExerciseCounts } from "@/pages/gallery-n/hooks/use-chapter-stats";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
} from "@/store";
import range from "@/utils/range";
import IconCheckCircle from "~icons/heroicons/check-circle-solid";

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const { chapterCount, id: dictId } = currentDictInfo;
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const chapterExerciseCounts = useChapterExerciseCounts(dictId);
  const currentButtonRef = useRef<HTMLButtonElement>(null);

  const chapters = useMemo(() => range(0, chapterCount, 1), [chapterCount]);
  const filteredChapters = useMemo(() => {
    const trimmed = filter.trim();
    if (!trimmed) {
      return chapters;
    }
    return chapters.filter((index) => `${index + 1}`.includes(trimmed));
  }, [chapters, filter]);

  const jumpToChapter = useCallback(
    (index: number) => {
      if (index < 0 || index >= chapterCount) {
        return;
      }
      setCurrentChapter(index);
      setIsOpen(false);
      setFilter("");
    },
    [chapterCount, setCurrentChapter]
  );

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setFilter("");
    }
  }, []);

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") {
        return;
      }
      const parsed = Number.parseInt(filter, 10);
      if (!Number.isNaN(parsed)) {
        jumpToChapter(parsed - 1);
      }
    },
    [filter, jumpToChapter]
  );

  useEffect(() => {
    if (isOpen) {
      currentButtonRef.current?.scrollIntoView({ block: "center" });
    }
  }, [isOpen]);

  return (
    <>
      <Tooltip content="Switch dictionary">
        <NavLink
          className="block max-w-[9.5rem] truncate rounded-lg px-2 py-2 text-base transition-colors duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground focus:outline-none sm:max-w-[16rem] sm:px-3 sm:text-lg"
          to="/gallery"
        >
          {currentDictInfo.name} {isReviewMode && "Error Review"}
        </NavLink>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content="Switch chapter">
          <Popover onOpenChange={onOpenChange} open={isOpen}>
            <PopoverTrigger
              aria-label={`Switch chapter, currently chapter ${currentChapter + 1} of ${chapterCount}`}
              className="min-h-10 rounded-lg px-2 py-2 text-base transition-colors duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground focus:outline-none sm:px-3 sm:text-lg"
              type="button"
            >
              Chapter {currentChapter + 1}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <Input
                autoFocus
                inputMode="numeric"
                onChange={(event) => setFilter(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={`Jump to chapter (1-${chapterCount})`}
                value={filter}
              />
              <ScrollArea className="mt-2 h-64">
                <div className="flex flex-col gap-0.5 pr-2">
                  {filteredChapters.map((index) => {
                    const isCurrent = index === currentChapter;
                    const isPracticed =
                      (chapterExerciseCounts?.[index] ?? 0) > 0;
                    return (
                      <button
                        aria-current={isCurrent ? "true" : undefined}
                        className={`flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${
                          isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                        key={index}
                        onClick={() => jumpToChapter(index)}
                        ref={isCurrent ? currentButtonRef : undefined}
                        type="button"
                      >
                        <span>Chapter {index + 1}</span>
                        {isPracticed && (
                          <IconCheckCircle
                            aria-label="Practiced"
                            className={
                              isCurrent
                                ? "h-4 w-4 shrink-0 text-primary-foreground/80"
                                : "h-4 w-4 shrink-0 text-green-500 dark:text-green-300"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                  {filteredChapters.length === 0 && (
                    <p className="px-2 py-3 text-center text-muted-foreground text-sm">
                      No matching chapters
                    </p>
                  )}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </Tooltip>
      )}
    </>
  );
};
