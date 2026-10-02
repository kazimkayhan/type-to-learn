import type { Word } from "@/typings";
import { getUTCUnixTimestamp } from "../index";
import { fsrsReview } from "../srs/fsrs";
import { deriveMasteryState } from "../srs/mastery-state";
import { qualityFromWrongCount, sm2Review } from "../srs/sm2";
import { db } from ".";
import type { IWordMastery } from "./record";
import { WordMasteryRecord } from "./record";

const DAY_SECONDS = 86_400;
const BACKFILL_FLAG_KEY = "wordMasteryBackfillV1";
const SRS_CONFIG_KEY = "srsConfig";

function getActiveScheduler(): "sm2" | "fsrs" {
  try {
    const raw = localStorage.getItem(SRS_CONFIG_KEY);
    if (!raw) {
      return "fsrs";
    }
    const parsed = JSON.parse(raw) as { algorithm?: string };
    return parsed.algorithm === "sm2" ? "sm2" : "fsrs";
  } catch {
    return "fsrs";
  }
}

export interface TodayQueueCounts {
  due: number;
  new: number;
}

export interface TodayQueueOptions {
  maxDue?: number;
  maxNew?: number;
}

const DEFAULT_MAX_DUE = 20;
const DEFAULT_MAX_NEW = 10;

function masteryKey(dict: string, word: string) {
  return `${dict}\0${word}`;
}

export async function getMastery(
  dict: string,
  word: string
): Promise<IWordMastery | undefined> {
  return db.wordMastery.where({ dict, word }).first();
}

export async function getTodayQueueCounts(
  dict: string,
  chapterWordNames: string[]
): Promise<TodayQueueCounts> {
  await ensureMasteryBackfill();
  const now = getUTCUnixTimestamp();
  const due = await db.wordMastery
    .where({ dict })
    .filter((row) => row.due <= now && row.state !== "mastered")
    .count();

  const chapterSet = new Set(chapterWordNames);
  const masteryInChapter = await db.wordMastery
    .where({ dict })
    .filter((row) => chapterSet.has(row.word))
    .toArray();
  const byName = new Map(masteryInChapter.map((row) => [row.word, row]));

  let newCount = 0;
  for (const name of chapterWordNames) {
    const row = byName.get(name);
    if (!row || row.state === "new") {
      newCount += 1;
    }
  }

  return { due, new: newCount };
}

export async function getDictMasteryStats(
  dict: string,
  dictWordLength: number
) {
  await ensureMasteryBackfill();
  const mastered = await db.wordMastery
    .where({ dict })
    .filter((row) => row.state === "mastered")
    .count();
  const tracked = await db.wordMastery.where({ dict }).count();
  return {
    mastered,
    total: dictWordLength,
    tracked,
  };
}

export async function buildTodayWordQueue(
  dict: string,
  chapterWords: Word[],
  options: TodayQueueOptions = {}
): Promise<Word[]> {
  await ensureMasteryBackfill();
  const maxDue = options.maxDue ?? DEFAULT_MAX_DUE;
  const maxNew = options.maxNew ?? DEFAULT_MAX_NEW;
  const now = getUTCUnixTimestamp();

  const dueRecords = await db.wordMastery
    .where({ dict })
    .filter((row) => row.due <= now && row.state !== "mastered")
    .toArray();
  dueRecords.sort((a, b) => a.due - b.due);

  const dueNames = new Set<string>();
  const queue: Word[] = [];
  const wordByName = new Map(chapterWords.map((w) => [w.name, w]));

  for (const record of dueRecords) {
    if (queue.length >= maxDue) {
      break;
    }
    dueNames.add(record.word);
    const fromChapter = wordByName.get(record.word);
    if (fromChapter) {
      queue.push(fromChapter);
      continue;
    }
    queue.push({
      name: record.word,
      trans: [],
    });
  }

  const chapterMastery = await db.wordMastery
    .where({ dict })
    .filter((row) => wordByName.has(row.word))
    .toArray();
  const masteryByName = new Map(chapterMastery.map((row) => [row.word, row]));

  for (const word of chapterWords) {
    if (queue.length >= maxDue + maxNew) {
      break;
    }
    if (dueNames.has(word.name)) {
      continue;
    }
    const existing = masteryByName.get(word.name);
    if (!existing || existing.state === "new") {
      queue.push(word);
    }
  }

  return queue.slice(0, maxDue + maxNew);
}

export async function applyWordReview(
  dict: string,
  word: string,
  wrongCount: number
): Promise<void> {
  await ensureMasteryBackfill();
  const now = getUTCUnixTimestamp();
  let record = await getMastery(dict, word);

  if (!record) {
    record = new WordMasteryRecord(dict, word);
  }

  let updated: IWordMastery;

  if (getActiveScheduler() === "fsrs") {
    const next = fsrsReview(record, wrongCount, now);
    updated = {
      ...record,
      difficulty: next.difficulty,
      due: next.due,
      elapsedDays: next.elapsedDays,
      fsrsState: next.fsrsState,
      intervalDays: next.intervalDays,
      lapses: next.lapses,
      lastReview: now,
      learningSteps: next.learningSteps,
      reps: next.reps,
      scheduledDays: next.scheduledDays,
      stability: next.stability,
      state: next.state,
      totalWrong: record.totalWrong + wrongCount,
    };
  } else {
    const quality = qualityFromWrongCount(wrongCount);
    const sm2 = sm2Review(
      {
        easeFactor: record.easeFactor,
        intervalDays: record.intervalDays,
        repetitions: record.reps,
      },
      quality
    );
    const lapses = quality < 3 ? record.lapses + 1 : record.lapses;
    updated = {
      ...record,
      due: now + sm2.dueDaysFromNow * DAY_SECONDS,
      easeFactor: sm2.easeFactor,
      intervalDays: sm2.intervalDays,
      lapses,
      lastReview: now,
      reps: sm2.repetitions,
      state: deriveMasteryState(
        sm2.repetitions,
        sm2.intervalDays,
        lapses,
        quality
      ),
      totalWrong: record.totalWrong + wrongCount,
    };
  }

  if (record.id) {
    await db.wordMastery.put(updated);
  } else {
    await db.wordMastery.add(updated);
  }
}

async function upsertMastery(record: IWordMastery): Promise<IWordMastery> {
  if (record.id) {
    await db.wordMastery.put(record);
    return record;
  }
  const id = await db.wordMastery.add(record);
  return { ...record, id };
}

export async function ensureMasteryRecord(
  dict: string,
  word: string
): Promise<IWordMastery> {
  await ensureMasteryBackfill();
  const existing = await getMastery(dict, word);
  if (existing) {
    return existing;
  }
  return upsertMastery(new WordMasteryRecord(dict, word));
}

/** Mark a word mastered and push due date far out. */
export async function markWordMastered(
  dict: string,
  word: string
): Promise<IWordMastery> {
  const record = await ensureMasteryRecord(dict, word);
  const now = getUTCUnixTimestamp();
  const updated: IWordMastery = {
    ...record,
    due: now + 180 * DAY_SECONDS,
    intervalDays: Math.max(record.intervalDays, 180),
    lastReview: now,
    reps: Math.max(record.reps, 3),
    state: "mastered",
  };
  return upsertMastery(updated);
}

/** Delay the next review by `days` (default 7). */
export async function snoozeWord(
  dict: string,
  word: string,
  days = 7
): Promise<IWordMastery> {
  const record = await ensureMasteryRecord(dict, word);
  const now = getUTCUnixTimestamp();
  const updated: IWordMastery = {
    ...record,
    due: now + days * DAY_SECONDS,
    lastReview: now,
    state: record.state === "new" ? "learning" : record.state,
  };
  return upsertMastery(updated);
}

/** Put a word back into the due queue immediately. */
export async function resetWordDue(
  dict: string,
  word: string
): Promise<IWordMastery> {
  const record = await ensureMasteryRecord(dict, word);
  const now = getUTCUnixTimestamp();
  const updated: IWordMastery = {
    ...record,
    due: now,
    state: record.state === "mastered" ? "review" : record.state,
  };
  return upsertMastery(updated);
}

export async function ensureMasteryBackfill(): Promise<void> {
  if (localStorage.getItem(BACKFILL_FLAG_KEY) === "1") {
    return;
  }

  const aggregates = new Map<
    string,
    { totalWrong: number; lastSeen: number }
  >();

  await db.wordRecords.each((row) => {
    const key = masteryKey(row.dict, row.word);
    const prev = aggregates.get(key) ?? { lastSeen: 0, totalWrong: 0 };
    prev.totalWrong += row.wrongCount;
    prev.lastSeen = Math.max(prev.lastSeen, row.timeStamp);
    aggregates.set(key, prev);
  });

  const existingKeys = new Set<string>();
  await db.wordMastery.each((row) => {
    existingKeys.add(masteryKey(row.dict, row.word));
  });

  const toAdd: IWordMastery[] = [];
  for (const [key, agg] of aggregates) {
    if (existingKeys.has(key)) {
      continue;
    }
    const sep = key.indexOf("\0");
    const dict = key.slice(0, sep);
    const word = key.slice(sep + 1);
    const record = new WordMasteryRecord(dict, word);
    record.totalWrong = agg.totalWrong;
    record.lastReview = agg.lastSeen;
    record.reps = agg.totalWrong === 0 ? 2 : 1;
    record.intervalDays = agg.totalWrong === 0 ? 6 : 1;
    record.due = agg.lastSeen + (agg.totalWrong === 0 ? 6 : 1) * DAY_SECONDS;
    record.state =
      agg.totalWrong === 0 && record.reps >= 2 ? "review" : "learning";
    if (agg.totalWrong >= 8) {
      record.lapses = 2;
      record.due = getUTCUnixTimestamp();
    }
    toAdd.push(record);
  }

  if (toAdd.length > 0) {
    await db.wordMastery.bulkAdd(toAdd);
  }

  localStorage.setItem(BACKFILL_FLAG_KEY, "1");
}

export const LEECH_LAPSES_THRESHOLD = 2;

export interface VocabularyAnalytics {
  due: number;
  learning: number;
  leeches: IWordMastery[];
  mastered: number;
  new: number;
  review: number;
  tracked: number;
}

export async function getVocabularyAnalytics(): Promise<VocabularyAnalytics> {
  await ensureMasteryBackfill();
  const now = getUTCUnixTimestamp();
  const rows = await db.wordMastery.toArray();

  let mastered = 0;
  let learning = 0;
  let review = 0;
  let newCount = 0;
  let due = 0;
  const leeches: IWordMastery[] = [];

  for (const row of rows) {
    switch (row.state) {
      case "mastered":
        mastered += 1;
        break;
      case "learning":
        learning += 1;
        break;
      case "review":
        review += 1;
        break;
      default:
        newCount += 1;
        break;
    }
    if (row.due <= now && row.state !== "mastered") {
      due += 1;
    }
    if (row.lapses >= LEECH_LAPSES_THRESHOLD) {
      leeches.push(row);
    }
  }

  leeches.sort((a, b) => b.lapses - a.lapses || b.totalWrong - a.totalWrong);

  return {
    due,
    learning,
    leeches: leeches.slice(0, 50),
    mastered,
    new: newCount,
    review,
    tracked: rows.length,
  };
}
