import dayjs from "dayjs";
import { getUTCUnixTimestamp } from "@/utils";
import { db } from ".";
import type { IWordMastery, IWordRecord } from "./record";
import {
  ensureMasteryBackfill,
  getVocabularyAnalytics,
  LEECH_LAPSES_THRESHOLD,
  type VocabularyAnalytics,
} from "./word-mastery";

const DAY_SECONDS = 86_400;
const LOOKBACK_DAYS = 30;

export interface WeeklyVocabSummary {
  avgTimeMs: number;
  dueNow: number;
  endDate: string;
  firstTryRate: number;
  leechCount: number;
  newlyMastered: number;
  startDate: string;
  uniqueWords: number;
  wordsPracticed: number;
}

export interface TimeBucket {
  count: number;
  label: string;
}

export interface VocabularyDeepAnalytics extends VocabularyAnalytics {
  avgIntervalDays: number;
  firstTryByDay: [string, number][];
  firstTryOverall: number;
  masteredByDay: [string, number][];
  timeBuckets: TimeBucket[];
  uniqueWordsByDay: [string, number][];
  weekly: WeeklyVocabSummary;
}

function dayKeyFromUnix(ts: number): string {
  return dayjs.unix(ts).format("YYYY-MM-DD");
}

function emptyDaySeries(start: dayjs.Dayjs, days: number): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = 0; i < days; i += 1) {
    map.set(start.add(i, "day").format("YYYY-MM-DD"), 0);
  }
  return map;
}

function sumTimingMs(record: IWordRecord): number {
  return record.timing.reduce((acc, curr) => acc + curr, 0);
}

function buildTimeBuckets(records: IWordRecord[]): TimeBucket[] {
  const buckets = [
    { count: 0, label: "< 1s", max: 1000 },
    { count: 0, label: "1–2s", max: 2000 },
    { count: 0, label: "2–4s", max: 4000 },
    { count: 0, label: "4s+", max: Number.POSITIVE_INFINITY },
  ];

  for (const record of records) {
    const ms = sumTimingMs(record);
    const bucket = buckets.find((item) => ms < item.max);
    if (bucket) {
      bucket.count += 1;
    }
  }

  return buckets.map(({ count, label }) => ({ count, label }));
}

function ratePercent(correct: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((correct / total) * 1000) / 10;
}

function aggregatePracticeDays(
  practiceRecords: IWordRecord[],
  seriesStart: dayjs.Dayjs,
  weekStart: number
) {
  const firstTryCorrect = emptyDaySeries(seriesStart, LOOKBACK_DAYS);
  const firstTryTotal = emptyDaySeries(seriesStart, LOOKBACK_DAYS);
  const uniqueByDay = emptyDaySeries(seriesStart, LOOKBACK_DAYS);
  const uniqueSets = new Map<string, Set<string>>();
  for (const key of uniqueByDay.keys()) {
    uniqueSets.set(key, new Set());
  }

  let weekPracticed = 0;
  let weekFirstTryOk = 0;
  const weekUnique = new Set<string>();
  let weekTimeSum = 0;
  let overallFirstTryOk = 0;

  for (const record of practiceRecords) {
    const day = dayKeyFromUnix(record.timeStamp);
    if (!firstTryTotal.has(day)) {
      continue;
    }
    firstTryTotal.set(day, (firstTryTotal.get(day) ?? 0) + 1);
    if (record.wrongCount === 0) {
      firstTryCorrect.set(day, (firstTryCorrect.get(day) ?? 0) + 1);
      overallFirstTryOk += 1;
    }
    uniqueSets.get(day)?.add(`${record.dict}\0${record.word}`);

    if (record.timeStamp < weekStart) {
      continue;
    }
    weekPracticed += 1;
    weekUnique.add(`${record.dict}\0${record.word}`);
    weekTimeSum += sumTimingMs(record);
    if (record.wrongCount === 0) {
      weekFirstTryOk += 1;
    }
  }

  for (const [day, set] of uniqueSets) {
    uniqueByDay.set(day, set.size);
  }

  const firstTryByDay: [string, number][] = [];
  for (const [day, total] of firstTryTotal) {
    firstTryByDay.push([
      day,
      ratePercent(firstTryCorrect.get(day) ?? 0, total),
    ]);
  }

  return {
    firstTryByDay,
    overallFirstTryOk,
    uniqueWordsByDay: [...uniqueByDay.entries()] as [string, number][],
    weekFirstTryOk,
    weekPracticed,
    weekTimeSum,
    weekUniqueCount: weekUnique.size,
  };
}

function aggregateMasteryTrends(
  masteryRows: IWordMastery[],
  seriesStart: dayjs.Dayjs,
  lookbackStart: number,
  weekStart: number
) {
  const masteredDaily = emptyDaySeries(seriesStart, LOOKBACK_DAYS);
  let newlyMasteredWeek = 0;
  let intervalSum = 0;
  let intervalCount = 0;
  let leechCount = 0;

  for (const row of masteryRows) {
    if (row.lapses >= LEECH_LAPSES_THRESHOLD) {
      leechCount += 1;
    }
    if (row.intervalDays > 0) {
      intervalSum += row.intervalDays;
      intervalCount += 1;
    }
    if (row.state !== "mastered" || row.lastReview <= 0) {
      continue;
    }
    if (row.lastReview >= weekStart) {
      newlyMasteredWeek += 1;
    }
    if (row.lastReview < lookbackStart) {
      continue;
    }
    const day = dayKeyFromUnix(row.lastReview);
    if (masteredDaily.has(day)) {
      masteredDaily.set(day, (masteredDaily.get(day) ?? 0) + 1);
    }
  }

  let cumulative = 0;
  const masteredByDay: [string, number][] = [];
  for (const [day, count] of masteredDaily) {
    cumulative += count;
    masteredByDay.push([day, cumulative]);
  }

  return {
    avgIntervalDays:
      intervalCount === 0
        ? 0
        : Math.round((intervalSum / intervalCount) * 10) / 10,
    leechCount,
    masteredByDay,
    newlyMasteredWeek,
  };
}

export async function getVocabularyDeepAnalytics(): Promise<VocabularyDeepAnalytics> {
  await ensureMasteryBackfill();
  const base = await getVocabularyAnalytics();
  const now = getUTCUnixTimestamp();
  const lookbackStart = now - LOOKBACK_DAYS * DAY_SECONDS;
  const weekStart = now - 7 * DAY_SECONDS;
  const seriesStart = dayjs.unix(lookbackStart).startOf("day");

  const [masteryRows, practiceRecords] = await Promise.all([
    db.wordMastery.toArray(),
    db.wordRecords
      .where("timeStamp")
      .between(lookbackStart, now, true, true)
      .toArray(),
  ]);

  const practice = aggregatePracticeDays(
    practiceRecords,
    seriesStart,
    weekStart
  );
  const mastery = aggregateMasteryTrends(
    masteryRows,
    seriesStart,
    lookbackStart,
    weekStart
  );

  const weekly: WeeklyVocabSummary = {
    avgTimeMs:
      practice.weekPracticed === 0
        ? 0
        : Math.round(practice.weekTimeSum / practice.weekPracticed),
    dueNow: base.due,
    endDate: dayjs.unix(now).format("YYYY-MM-DD"),
    firstTryRate: ratePercent(practice.weekFirstTryOk, practice.weekPracticed),
    leechCount: mastery.leechCount,
    newlyMastered: mastery.newlyMasteredWeek,
    startDate: dayjs.unix(weekStart).format("YYYY-MM-DD"),
    uniqueWords: practice.weekUniqueCount,
    wordsPracticed: practice.weekPracticed,
  };

  return {
    ...base,
    avgIntervalDays: mastery.avgIntervalDays,
    firstTryByDay: practice.firstTryByDay,
    firstTryOverall: ratePercent(
      practice.overallFirstTryOk,
      practiceRecords.length
    ),
    masteredByDay: mastery.masteredByDay,
    timeBuckets: buildTimeBuckets(practiceRecords),
    uniqueWordsByDay: practice.uniqueWordsByDay,
    weekly,
  };
}
