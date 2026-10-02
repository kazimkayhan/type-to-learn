import { useAtom, useSetAtom } from "jotai";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTodayQueueStats } from "@/hooks/use-today-queue";
import {
  currentChapterAtom,
  reviewModeInfoAtom,
  todaySessionAtom,
} from "@/store";
import IconCalendar from "~icons/heroicons/calendar-days-solid";

export default function TodayPanel() {
  const { buildQueue, counts, loading, refresh, totalSuggested } =
    useTodayQueueStats();
  const setTodaySession = useSetAtom(todaySessionAtom);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);
  const [todaySession] = useAtom(todaySessionAtom);
  const [starting, setStarting] = useState(false);

  const onStartToday = useCallback(async () => {
    if (totalSuggested === 0) {
      return;
    }
    setStarting(true);
    try {
      const words = await buildQueue();
      if (words.length === 0) {
        return;
      }
      setReviewModeInfo({ isReviewMode: false, reviewRecord: undefined });
      setCurrentChapter(-1);
      setTodaySession({ active: true, words });
    } finally {
      setStarting(false);
      refresh();
    }
  }, [
    buildQueue,
    refresh,
    setCurrentChapter,
    setReviewModeInfo,
    setTodaySession,
    totalSuggested,
  ]);

  const onExitToday = useCallback(() => {
    setTodaySession({ active: false, words: [] });
    setCurrentChapter(0);
    refresh();
  }, [refresh, setCurrentChapter, setTodaySession]);

  if (loading && !todaySession.active) {
    return (
      <div className="my-card w-full max-w-3xl rounded-xl bg-card px-4 py-3 text-center text-muted-foreground text-sm">
        Loading today&apos;s review…
      </div>
    );
  }

  if (todaySession.active) {
    return (
      <div className="my-card flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3">
        <div className="min-w-0 text-left">
          <p className="font-semibold text-foreground text-sm">
            Today&apos;s review
          </p>
          <p className="text-muted-foreground text-xs">
            {todaySession.words.length} words in this session
          </p>
        </div>
        <Button onClick={onExitToday} size="sm" variant="outline">
          Exit review
        </Button>
      </div>
    );
  }

  const isEmpty = counts.due === 0 && counts.new === 0;

  return (
    <div className="my-card flex w-full max-w-3xl flex-col gap-3 rounded-xl bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <IconCalendar
          aria-hidden
          className="mt-0.5 size-5 shrink-0 text-primary"
        />
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm">Today</p>
          <p className="text-muted-foreground text-xs">
            {isEmpty
              ? "You're caught up on this dictionary. Practice a chapter to add new words."
              : `${counts.due} due · ${counts.new} new in current chapter`}
          </p>
        </div>
      </div>
      <Button
        className="w-full sm:w-auto"
        disabled={isEmpty || starting}
        onClick={onStartToday}
        size="sm"
      >
        {starting ? "Preparing…" : `Start review (${totalSuggested})`}
      </Button>
    </div>
  );
}
