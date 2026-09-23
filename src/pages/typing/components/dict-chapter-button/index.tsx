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
import IconMagnifyingGlass from "~icons/heroicons/magnifying-glass-solid";
import IconXMark from "~icons/heroicons/x-mark-solid";

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const { chapterCount, id: dictId } = currentDictInfo;
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const chapterExerciseCounts = useChapterExerciseCounts(dictId);
  const currentButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const chapters = useMemo(() => range(0, chapterCount, 1), [chapterCount]);
  const trimmedFilter = filter.trim();
  const filteredChapters = useMemo(() => {
    if (!trimmedFilter) {
      return chapters;
    }
    const lower = trimmedFilter.toLowerCase();
    return chapters.filter(
      (index) =>
        `${index + 1}`.includes(trimmedFilter) ||
        `chapter ${index + 1}`.includes(lower)
    );
  }, [chapters, trimmedFilter]);

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
      if (event.key === "Escape" && filter) {
        event.preventDefault();
        event.stopPropagation();
        setFilter("");
        return;
      }
      if (event.key !== "Enter") {
        return;
      }
      if (!trimmedFilter) {
        return;
      }
      const exact = Number.parseInt(trimmedFilter, 10);
      if (
        !Number.isNaN(exact) &&
        exact >= 1 &&
        exact <= chapterCount &&
        `${exact}` === trimmedFilter
      ) {
        jumpToChapter(exact - 1);
        return;
      }
      if (filteredChapters.length === 1) {
        jumpToChapter(filteredChapters[0]);
      }
    },
    [chapterCount, filter, filteredChapters, jumpToChapter, trimmedFilter]
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
            <PopoverContent align="start" className="w-60 p-2">
              <div className="relative">
                <IconMagnifyingGlass
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  aria-label="Search chapters"
                  autoFocus
                  className="h-9 pr-9 pl-8"
                  inputMode="numeric"
                  onChange={(event) => setFilter(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder={`Search (1–${chapterCount})`}
                  ref={searchInputRef}
                  type="text"
                  value={filter}
                />
                {filter.length > 0 && (
                  <button
                    aria-label="Clear search"
                    className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => {
                      setFilter("");
                      searchInputRef.current?.focus();
                    }}
                    type="button"
                  >
                    <IconXMark className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              {trimmedFilter.length > 0 && (
                <p
                  aria-live="polite"
                  className="mt-1.5 px-0.5 text-muted-foreground text-xs tabular-nums"
                >
                  {filteredChapters.length} match
                  {filteredChapters.length === 1 ? "" : "es"}
                </p>
              )}
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
                    <div className="flex flex-col items-center gap-2 px-2 py-4 text-center">
                      <p className="text-muted-foreground text-sm">
                        No matching chapters
                      </p>
                      <button
                        className="text-primary text-xs underline-offset-2 hover:underline"
                        onClick={() => {
                          setFilter("");
                          searchInputRef.current?.focus();
                        }}
                        type="button"
                      >
                        Clear search
                      </button>
                    </div>
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
