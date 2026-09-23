import { useAtom, useSetAtom } from "jotai";
import type React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  currentChapterAtom,
  currentDictIdAtom,
  reviewModeInfoAtom,
} from "@/store";
import type { Dictionary } from "@/typings";
import range from "@/utils/range";
import IconMagnifyingGlass from "~icons/heroicons/magnifying-glass-solid";
import IconXMark from "~icons/heroicons/x-mark-solid";
import IcOutlineCollectionsBookmark from "~icons/ic/outline-collections-bookmark";
import MajesticonsPaperFoldTextLine from "~icons/majesticons/paper-fold-text-line";
import PajamasReviewList from "~icons/pajamas/review-list";
import { useDeleteWordRecord } from "../../../utils/db";
import Chapter from "../chapter";
import { ErrorTable } from "../error-table";
import { getRowsFromErrorWordData } from "../error-table/columns";
import { useChapterExerciseCounts } from "../hooks/use-chapter-stats";
import useErrorWordData from "../hooks/use-error-words";
import { ReviewDetail } from "../review-detail";

const Tab = {
  Chapters: "chapters",
  Errors: "errors",
  Review: "review",
} as const;

type Tab = (typeof Tab)[keyof typeof Tab];

const ChapterStatus = {
  All: "all",
  Practiced: "practiced",
  Remaining: "remaining",
} as const;

type ChapterStatus = (typeof ChapterStatus)[keyof typeof ChapterStatus];

export default function DictDetail({
  dictionary: dict,
  onStartPractice,
}: {
  dictionary: Dictionary;
  onStartPractice?: () => void;
}) {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters);
  const [chapterQuery, setChapterQuery] = useState("");
  const [chapterStatus, setChapterStatus] = useState<ChapterStatus>(
    ChapterStatus.All
  );
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const navigate = useNavigate();
  const { deleteWordRecord } = useDeleteWordRecord();
  const [reload, setReload] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Only highlight a chapter when this dictionary is the active practice dict.
  // Otherwise Chapter 1 looked "selected" for every opened dictionary.
  const chapter = useMemo(
    () => (dict.id === currentDictId ? currentChapter : null),
    [currentChapter, currentDictId, dict.id]
  );
  const { errorWordData, isLoading, error } = useErrorWordData(dict, reload);
  const chapterExerciseCounts = useChapterExerciseCounts(dict.id);

  const tableData = useMemo(
    () => getRowsFromErrorWordData(errorWordData),
    [errorWordData]
  );

  const onDelete = useCallback(
    async (word: string) => {
      await deleteWordRecord(word, dict.id);
      setReload((old) => !old);
    },
    [deleteWordRecord, dict.id]
  );

  const onChangeChapter = useCallback(
    (index: number) => {
      onStartPractice?.();
      setCurrentDictId(dict.id);
      setCurrentChapter(index);
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }));
      navigate("/");
    },
    [
      dict.id,
      navigate,
      onStartPractice,
      setCurrentChapter,
      setCurrentDictId,
      setReviewModeInfo,
    ]
  );

  const handleTabChange = useCallback((groupValue: string[]) => {
    const [value] = groupValue;
    if (
      value === Tab.Chapters ||
      value === Tab.Errors ||
      value === Tab.Review
    ) {
      setCurTab(value);
    }
  }, []);

  const practicedChapterCount = useMemo(() => {
    if (!chapterExerciseCounts) {
      return 0;
    }
    return Object.values(chapterExerciseCounts).filter((count) => count > 0)
      .length;
  }, [chapterExerciseCounts]);

  const firstUnpracticedChapter = useMemo(() => {
    if (!chapterExerciseCounts) {
      return null;
    }
    const found = range(0, dict.chapterCount, 1).find(
      (index) => !(chapterExerciseCounts[index] > 0)
    );
    return found ?? null;
  }, [chapterExerciseCounts, dict.chapterCount]);

  const chapters = useMemo(
    () => range(0, dict.chapterCount, 1),
    [dict.chapterCount]
  );

  const filteredChapters = useMemo(() => {
    const trimmed = chapterQuery.trim();
    const lower = trimmed.toLowerCase();
    return chapters.filter((index) => {
      const matchesQuery =
        !trimmed ||
        `${index + 1}`.includes(trimmed) ||
        `chapter ${index + 1}`.includes(lower);
      if (!matchesQuery) {
        return false;
      }
      if (chapterStatus === ChapterStatus.All || !chapterExerciseCounts) {
        return true;
      }
      const isPracticed = (chapterExerciseCounts[index] ?? 0) > 0;
      if (chapterStatus === ChapterStatus.Practiced) {
        return isPracticed;
      }
      return !isPracticed;
    });
  }, [chapterExerciseCounts, chapterQuery, chapterStatus, chapters]);

  const hasActiveFilters =
    chapterQuery.trim().length > 0 || chapterStatus !== ChapterStatus.All;

  const clearFilters = useCallback(() => {
    setChapterQuery("");
    setChapterStatus(ChapterStatus.All);
    searchInputRef.current?.focus();
  }, []);

  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        if (chapterQuery) {
          event.preventDefault();
          setChapterQuery("");
        }
        return;
      }
      if (event.key !== "Enter") {
        return;
      }
      const trimmed = chapterQuery.trim();
      if (!trimmed) {
        return;
      }
      const exact = Number.parseInt(trimmed, 10);
      if (
        !Number.isNaN(exact) &&
        exact >= 1 &&
        exact <= dict.chapterCount &&
        `${exact}` === trimmed
      ) {
        event.preventDefault();
        onChangeChapter(exact - 1);
        return;
      }
      if (filteredChapters.length === 1) {
        event.preventDefault();
        onChangeChapter(filteredChapters[0]);
      }
    },
    [chapterQuery, dict.chapterCount, filteredChapters, onChangeChapter]
  );

  const handleStatusChange = useCallback((values: string[]) => {
    const [value] = values;
    if (
      value === ChapterStatus.All ||
      value === ChapterStatus.Practiced ||
      value === ChapterStatus.Remaining
    ) {
      setChapterStatus(value);
    }
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl px-1 py-2 text-foreground sm:px-4 sm:py-3">
      <div className="flex min-w-0 flex-wrap items-end justify-start gap-3">
        <div className="min-w-0 pr-8">
          <h3 className="font-semibold text-lg sm:text-2xl">{dict.name}</h3>
          <p className="mt-1 tabular-nums">{dict.chapterCount} chapters</p>
          <p className="tabular-nums">
            {dict.length.toLocaleString()} words total
          </p>
          <p className="mt-1 text-sm tabular-nums sm:text-base">
            {practicedChapterCount} of {dict.chapterCount} chapters practiced
          </p>
          <p className="mt-1 text-sm sm:text-base">{dict.description}</p>
        </div>
        <ToggleGroup
          className="flex-wrap justify-start"
          onValueChange={handleTabChange}
          value={[curTab]}
        >
          <ToggleGroupItem
            className={
              curTab === Tab.Chapters
                ? "bg-primary text-primary-foreground"
                : ""
            }
            value={Tab.Chapters}
          >
            <MajesticonsPaperFoldTextLine className="mr-1.5 text-muted-foreground" />
            Chapters
          </ToggleGroupItem>
          {errorWordData.length > 0 && (
            <>
              <ToggleGroupItem
                className={
                  curTab === Tab.Errors
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                value={Tab.Errors}
              >
                <IcOutlineCollectionsBookmark className="mr-1.5 text-muted-foreground" />
                View errors
              </ToggleGroupItem>
              <ToggleGroupItem
                className={
                  curTab === Tab.Review
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                value={Tab.Review}
              >
                <PajamasReviewList className="mr-1.5 text-muted-foreground" />
                Error review
              </ToggleGroupItem>
            </>
          )}
        </ToggleGroup>
      </div>
      <div className="flex min-w-0">
        <Tabs className="h-[min(30rem,55dvh)] w-full min-w-0" value={curTab}>
          <TabsContent
            className="flex h-full flex-col gap-3"
            value={Tab.Chapters}
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full min-w-0 sm:max-w-xs">
                  <IconMagnifyingGlass
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    aria-controls="chapter-grid"
                    aria-label="Search chapters"
                    className="h-9 pr-9 pl-8"
                    inputMode="numeric"
                    onChange={(event) => setChapterQuery(event.target.value)}
                    onKeyDown={onSearchKeyDown}
                    placeholder={`Search chapters (1–${dict.chapterCount})`}
                    ref={searchInputRef}
                    type="text"
                    value={chapterQuery}
                  />
                  {chapterQuery.length > 0 && (
                    <button
                      aria-label="Clear search"
                      className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      onClick={() => {
                        setChapterQuery("");
                        searchInputRef.current?.focus();
                      }}
                      type="button"
                    >
                      <IconXMark className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <ToggleGroup
                  aria-label="Filter by practice status"
                  className="justify-start"
                  onValueChange={handleStatusChange}
                  size="sm"
                  value={[chapterStatus]}
                >
                  <ToggleGroupItem value={ChapterStatus.All}>
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ChapterStatus.Practiced}>
                    Done
                  </ToggleGroupItem>
                  <ToggleGroupItem value={ChapterStatus.Remaining}>
                    Todo
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                {hasActiveFilters && (
                  <p
                    aria-live="polite"
                    className="text-muted-foreground text-xs tabular-nums sm:text-sm"
                  >
                    {filteredChapters.length} of {dict.chapterCount}
                  </p>
                )}
                {firstUnpracticedChapter !== null && (
                  <Button
                    onClick={() => onChangeChapter(firstUnpracticedChapter)}
                    size="sm"
                  >
                    Continue: Chapter {firstUnpracticedChapter + 1}
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              {filteredChapters.length > 0 ? (
                <div
                  className="grid w-full grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                  id="chapter-grid"
                >
                  {filteredChapters.map((index) => (
                    <Chapter
                      checked={chapter === index}
                      exerciseCount={
                        chapterExerciseCounts === null
                          ? null
                          : (chapterExerciseCounts[index] ?? 0)
                      }
                      index={index}
                      key={`${dict.id}-${index}`}
                      onChange={onChangeChapter}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    No chapters match
                    {chapterQuery.trim()
                      ? ` “${chapterQuery.trim()}”`
                      : " this filter"}
                    .
                  </p>
                  <Button onClick={clearFilters} size="sm" variant="outline">
                    Clear filters
                  </Button>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent className="h-full" value={Tab.Errors}>
            <ErrorTable
              data={tableData}
              error={error}
              isLoading={isLoading}
              onDelete={onDelete}
            />
          </TabsContent>
          <TabsContent className="h-full" value={Tab.Review}>
            <ReviewDetail dict={dict} errorData={errorWordData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
