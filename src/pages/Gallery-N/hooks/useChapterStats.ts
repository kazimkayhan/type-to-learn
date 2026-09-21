import { useEffect, useState } from "react";
import { toFixedNumber } from "@/utils";
import { db } from "@/utils/db";
import type { IChapterRecord } from "@/utils/db/record";

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
  }, [dictID, chapter, isStartLoad]);

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
