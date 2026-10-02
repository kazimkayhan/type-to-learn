import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { CHAPTER_LENGTH } from "@/constants";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  dailyReviewConfigAtom,
} from "@/store";
import type { TodayQueueCounts } from "@/utils/db/word-mastery";
import {
  buildTodayWordQueue,
  ensureMasteryBackfill,
  getTodayQueueCounts,
} from "@/utils/db/word-mastery";
import { wordListFetcher } from "@/utils/word-list-fetcher";

export function useTodayQueueStats() {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const currentChapter = useAtomValue(currentChapterAtom);
  const dailyConfig = useAtomValue(dailyReviewConfigAtom);
  const [counts, setCounts] = useState<TodayQueueCounts>({ due: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await ensureMasteryBackfill();
      const wordList = await wordListFetcher(currentDictInfo.url);
      const chapterWords = wordList.slice(
        currentChapter * CHAPTER_LENGTH,
        (currentChapter + 1) * CHAPTER_LENGTH
      );
      const next = await getTodayQueueCounts(
        currentDictInfo.id,
        chapterWords.map((w) => w.name)
      );
      setCounts(next);
    } catch {
      setCounts({ due: 0, new: 0 });
    } finally {
      setLoading(false);
    }
  }, [currentChapter, currentDictInfo.id, currentDictInfo.url]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const buildQueue = useCallback(async () => {
    const wordList = await wordListFetcher(currentDictInfo.url);
    const chapterWords = wordList.slice(
      currentChapter * CHAPTER_LENGTH,
      (currentChapter + 1) * CHAPTER_LENGTH
    );
    return buildTodayWordQueue(currentDictInfo.id, chapterWords, {
      maxDue: dailyConfig.maxDue,
      maxNew: dailyConfig.maxNew,
    });
  }, [
    currentChapter,
    currentDictInfo.id,
    currentDictInfo.url,
    dailyConfig.maxDue,
    dailyConfig.maxNew,
  ]);

  return {
    buildQueue,
    counts,
    loading,
    refresh,
    totalSuggested: Math.min(
      counts.due + counts.new,
      dailyConfig.maxDue + dailyConfig.maxNew
    ),
  };
}
