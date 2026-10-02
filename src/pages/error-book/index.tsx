import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PageShell from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  currentChapterAtom,
  currentDictIdAtom,
  customDictionariesAtom,
  reviewModeInfoAtom,
  todaySessionAtom,
} from "@/store";
import { db, useDeleteWordRecord } from "@/utils/db";
import type { WordRecord } from "@/utils/db/record";
import {
  buildPracticeFromRecords,
  buildPracticeWeakWords,
  PRACTICE_TOP_N,
  type PracticeWeakResult,
} from "./build-practice-weak";
import DropdownExport from "./dropdown-export";
import ErrorRow, { recordSelectionKey } from "./error-row";
import type { ISortType } from "./head-wrong-number";
import HeadWrongNumber from "./head-wrong-number";
import Pagination, { ITEM_PER_PAGE } from "./pagination";
import RowDetail from "./row-detail";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";

export function ErrorBook() {
  const navigate = useNavigate();
  const [groupedRecords, setGroupedRecords] = useState<groupedWordRecords[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(
    () => Math.ceil(groupedRecords.length / ITEM_PER_PAGE),
    [groupedRecords.length]
  );
  const [sortType, setSortType] = useState<ISortType>("asc");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const currentRowDetail = useAtomValue(currentRowDetailAtom);
  const customDictionaries = useAtomValue(customDictionariesAtom);
  const setTodaySession = useSetAtom(todaySessionAtom);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const setCurrentDictId = useSetAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const { deleteWordRecord } = useDeleteWordRecord();
  const [reload, setReload] = useState(false);
  const [practiceStarting, setPracticeStarting] = useState(false);

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) {
        return;
      }
      setCurrentPage(page);
    },
    [totalPages]
  );

  const setSort = useCallback(
    (newSortType: ISortType) => {
      setSortType(newSortType);
      setPage(1);
    },
    [setPage]
  );

  const sortedRecords = useMemo(() => {
    if (sortType === "none") {
      return groupedRecords;
    }
    return [...groupedRecords].sort((a, b) => {
      if (sortType === "asc") {
        return a.wrongCount - b.wrongCount;
      }
      return b.wrongCount - a.wrongCount;
    });
  }, [groupedRecords, sortType]);

  const renderRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE;
    const end = start + ITEM_PER_PAGE;
    return sortedRecords.slice(start, end);
  }, [currentPage, sortedRecords]);

  const selectedRecords = useMemo(
    () =>
      sortedRecords.filter((record) =>
        selectedKeys.has(recordSelectionKey(record))
      ),
    [selectedKeys, sortedRecords]
  );

  useEffect(() => {
    db.wordRecords
      .where("wrongCount")
      .above(0)
      .toArray()
      .then((records) => {
        const groups: groupedWordRecords[] = [];

        for (const record of records) {
          let group = groups.find(
            (g) => g.word === record.word && g.dict === record.dict
          );
          if (!group) {
            group = {
              dict: record.dict,
              records: [],
              word: record.word,
              wrongCount: 0,
            };
            groups.push(group);
          }
          group.records.push(record as WordRecord);
        }

        for (const group of groups) {
          group.wrongCount = group.records.reduce(
            (acc, cur) => acc + cur.wrongCount,
            0
          );
        }

        setGroupedRecords(groups);
      });
  }, [reload]);

  // Deleting the last record on a page (or the last record overall) shrinks
  // totalPages; clamp currentPage back into range instead of stranding the
  // user on a now-empty page.
  useEffect(() => {
    setCurrentPage((page) => Math.min(page, Math.max(totalPages, 1)));
  }, [totalPages]);

  const handleDelete = async (word: string, dict: string) => {
    await deleteWordRecord(word, dict);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.delete(`${dict}::${word}`);
      return next;
    });
    setReload((prev) => !prev);
  };

  const onToggleSelect = useCallback((record: groupedWordRecords) => {
    const key = recordSelectionKey(record);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const startPracticeSession = useCallback(
    async (session: PracticeWeakResult | null) => {
      if (!session) {
        toast.error("Could not build a practice session from these words.");
        return;
      }
      setReviewModeInfo({ isReviewMode: false, reviewRecord: undefined });
      setCurrentDictId(session.dictId);
      setCurrentChapter(-1);
      setTodaySession({ active: true, words: session.words });
      toast.success(
        `Practicing ${session.words.length} word${session.words.length === 1 ? "" : "s"}`
      );
      navigate("/");
    },
    [
      navigate,
      setCurrentChapter,
      setCurrentDictId,
      setReviewModeInfo,
      setTodaySession,
    ]
  );

  const onPracticeTop = useCallback(async () => {
    if (groupedRecords.length === 0 || practiceStarting) {
      return;
    }
    setPracticeStarting(true);
    try {
      const session = await buildPracticeWeakWords(
        groupedRecords,
        customDictionaries
      );
      await startPracticeSession(session);
    } catch {
      toast.error("Failed to start practice.");
    } finally {
      setPracticeStarting(false);
    }
  }, [
    customDictionaries,
    groupedRecords,
    practiceStarting,
    startPracticeSession,
  ]);

  const onPracticeSelected = useCallback(async () => {
    if (selectedRecords.length === 0 || practiceStarting) {
      return;
    }
    setPracticeStarting(true);
    try {
      const session = await buildPracticeFromRecords(
        selectedRecords,
        customDictionaries
      );
      await startPracticeSession(session);
    } catch {
      toast.error("Failed to start practice.");
    } finally {
      setPracticeStarting(false);
    }
  }, [
    customDictionaries,
    practiceStarting,
    selectedRecords,
    startPracticeSession,
  ]);

  const practiceButtons = (
    <>
      <Button
        disabled={selectedRecords.length === 0 || practiceStarting}
        onClick={onPracticeSelected}
        size="sm"
        variant="default"
      >
        {practiceStarting
          ? "Starting…"
          : selectedRecords.length > 0
            ? `Practice selected (${selectedRecords.length})`
            : "Practice selected"}
      </Button>
      <Button
        disabled={groupedRecords.length === 0 || practiceStarting}
        onClick={onPracticeTop}
        size="sm"
        variant="secondary"
      >
        {practiceStarting ? "Starting…" : `Practice top ${PRACTICE_TOP_N}`}
      </Button>
    </>
  );

  return (
    <>
      <PageShell
        className={currentRowDetail ? "blur-sm" : undefined}
        closeLabel="Close Error Book"
        contentClassName="items-center"
        subtitle="Mistakes from practice. Click a word for details."
        title="Error Book"
      >
        <div className="flex w-full flex-1 select-text items-start justify-center overflow-hidden">
          <div className="flex h-full w-full flex-col sm:w-5/6">
            <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
              {practiceButtons}
              <DropdownExport renderRecords={sortedRecords} />
            </div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 md:hidden">
              <HeadWrongNumber
                className="text-sm"
                setSortType={setSort}
                sortType={sortType}
              />
            </div>
            <div className="hidden w-full items-center gap-4 rounded-lg bg-card px-6 py-4 text-base text-foreground shadow-[var(--shadow-card)] md:grid md:grid-cols-[auto_minmax(6.5rem,1fr)_minmax(0,2fr)_6.5rem_minmax(7rem,1.2fr)_2.5rem]">
              <span className="w-4" />
              <span>Word</span>
              <span>Definition</span>
              <HeadWrongNumber setSortType={setSort} sortType={sortType} />
              <span>Dictionary</span>
              <span />
            </div>
            <ScrollArea className="flex-1 overflow-y-auto pt-5">
              <div className="h-full">
                {renderRecords.length === 0 ? (
                  <div className="flex h-60 flex-col items-center justify-center gap-2 px-4 text-center">
                    <p className="font-medium text-foreground">
                      No missed words yet
                    </p>
                    <p className="max-w-sm text-muted-foreground text-sm">
                      Mistakes from practice on this site are stored in this
                      browser. Practice here, mistype a word, and it will show
                      up after you finish it.
                    </p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {renderRecords.map((record) => (
                      <ErrorRow
                        key={`${record.dict}-${record.word}`}
                        onDelete={() => handleDelete(record.word, record.dict)}
                        onToggleSelect={onToggleSelect}
                        record={record}
                        selected={selectedKeys.has(recordSelectionKey(record))}
                      />
                    ))}
                  </ul>
                )}
              </div>
              <ScrollBar
                className="flex touch-none select-none bg-transparent"
                orientation="vertical"
              />
            </ScrollArea>
          </div>
        </div>
        {totalPages > 0 ? (
          <Pagination
            className="pt-3"
            page={currentPage}
            setPage={setPage}
            totalPages={totalPages}
          />
        ) : null}
      </PageShell>
      {currentRowDetail ? (
        <RowDetail
          allRecords={sortedRecords}
          currentRowDetail={currentRowDetail}
        />
      ) : null}
    </>
  );
}
