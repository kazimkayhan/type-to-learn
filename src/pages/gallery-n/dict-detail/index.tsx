import { useAtom, useSetAtom } from "jotai";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
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

export default function DictDetail({
  dictionary: dict,
}: {
  dictionary: Dictionary;
}) {
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom);
  const [curTab, setCurTab] = useState<Tab>(Tab.Chapters);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const navigate = useNavigate();
  const { deleteWordRecord } = useDeleteWordRecord();
  const [reload, setReload] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  const chapter = useMemo(
    () => (dict.id === currentDictId ? currentChapter : 0),
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
      setCurrentDictId(dict.id);
      setCurrentChapter(index);
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }));
      navigate("/");
    },
    [dict.id, navigate, setCurrentChapter, setCurrentDictId, setReviewModeInfo]
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

  const onSubmitJump = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const parsed = Number.parseInt(jumpValue, 10);
      if (Number.isNaN(parsed) || parsed < 1 || parsed > dict.chapterCount) {
        return;
      }
      onChangeChapter(parsed - 1);
    },
    [jumpValue, dict.chapterCount, onChangeChapter]
  );

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
            <div className="flex flex-wrap items-center justify-end gap-3">
              {firstUnpracticedChapter !== null && (
                <Button
                  onClick={() => onChangeChapter(firstUnpracticedChapter)}
                  size="sm"
                >
                  Continue: Chapter {firstUnpracticedChapter + 1}
                </Button>
              )}
              <form
                className="flex items-center gap-1.5"
                onSubmit={onSubmitJump}
              >
                <Input
                  aria-label="Jump to chapter number"
                  className="h-8 w-40"
                  inputMode="numeric"
                  onChange={(event) => setJumpValue(event.target.value)}
                  placeholder={`Go to # (1-${dict.chapterCount})`}
                  value={jumpValue}
                />
                <Button size="sm" type="submit" variant="outline">
                  Go
                </Button>
              </form>
            </div>
            <ScrollArea className="min-h-0 flex-1">
              <div className="grid w-full grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {range(0, dict.chapterCount, 1).map((index) => (
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
