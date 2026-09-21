import { useEffect, useState } from "react";
import { toFixedNumber } from "@/utils";
import { db } from "@/utils/db";
import type { IChapterRecord } from "@/utils/db/record";

export function useChapterExerciseCounts(dictID: string) {
  const [counts, setCounts] = useState<Record<number, number> | null>(null);

  useEffect(() => {
    let cancelled = false;
    setCounts(null);

    db.chapterRecords
      .where({ dict: dictID })
      .toArray()
      .then((records) => {
        if (cancelled) {
          return;
        }
        const nextCounts: Record<number, number> = {};
        for (const record of records) {
          // Skip review sessions (chapter === -1) and null chapters.
          if (record.chapter === null || record.chapter < 0) {
            continue;
          }
          nextCounts[record.chapter] = (nextCounts[record.chapter] ?? 0) + 1;
        }
        setCounts(nextCounts);
      })
      .catch(() => {
        if (!cancelled) {
          setCounts({});
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dictID]);

  return counts;
}

export function useChapterStats(
  chapter: number,
  dictID: string,
  isStartLoad: boolean
) {
  const [chapterStats, setChapterStats] = useState<IChapterStats | null>(null);

  useEffect(() => {
    const fetchChapterStats = async () => {
      const stats = await getChapterStats(dictID, chapter);
      setChapterStats(stats);
    };

    if (isStartLoad && !chapterStats) {
      fetchChapterStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictID, chapter, isStartLoad, chapterStats]);

  return chapterStats;
}

interface IChapterStats {
  avgWrongInputCount: number;
  avgWrongWordCount: number;
  exerciseCount: number;
}

async function getChapterStats(
  dict: string,
  chapter: number | null
): Promise<IChapterStats> {
  const records: IChapterRecord[] = await db.chapterRecords
    .where({ chapter, dict })
    .toArray();

  const exerciseCount = records.length;
  const totalWrongWordCount = records.reduce(
    (total, { wordNumber, correctWordIndexes }) =>
      total + (wordNumber - correctWordIndexes.length),
    0
  );
  const avgWrongWordCount =
    exerciseCount > 0
      ? toFixedNumber(totalWrongWordCount / exerciseCount, 2)
      : 0;

  const totalWrongInputCount = records.reduce(
    (total, { wrongCount }) => total + (wrongCount ?? 0),
    0
  );
  const avgWrongInputCount =
    exerciseCount > 0
      ? toFixedNumber(totalWrongInputCount / exerciseCount, 2)
      : 0;

  return { avgWrongInputCount, avgWrongWordCount, exerciseCount };
}
