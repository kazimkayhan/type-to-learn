import { type Card, createEmptyCard, fsrs, Rating, State } from "ts-fsrs";
import type { IWordMastery, WordMasteryState } from "@/utils/db/record";

export type SchedulerKind = "sm2" | "fsrs";

const scheduler = fsrs();

/** Map typing mistakes to an FSRS grade. */
export function ratingFromWrongCount(wrongCount: number): Rating {
  if (wrongCount === 0) {
    return Rating.Good;
  }
  if (wrongCount === 1) {
    return Rating.Hard;
  }
  return Rating.Again;
}

function unixToDate(seconds: number): Date {
  return new Date(seconds * 1000);
}

function dateToUnix(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function masteryStateFromFsrs(
  state: State,
  scheduledDays: number,
  rating: Rating
): WordMasteryState {
  if (state === State.New) {
    return "new";
  }
  if (
    state === State.Review &&
    scheduledDays >= 21 &&
    (rating === Rating.Good || rating === Rating.Easy)
  ) {
    return "mastered";
  }
  if (state === State.Review) {
    return "review";
  }
  return "learning";
}

/** Build a ts-fsrs Card from stored mastery fields (or a fresh empty card). */
export function cardFromMastery(record: IWordMastery): Card {
  if (
    typeof record.stability === "number" &&
    typeof record.difficulty === "number"
  ) {
    return {
      difficulty: record.difficulty,
      due: unixToDate(record.due > 0 ? record.due : Date.now() / 1000),
      elapsed_days: record.elapsedDays ?? 0,
      lapses: record.lapses,
      last_review:
        record.lastReview > 0 ? unixToDate(record.lastReview) : undefined,
      learning_steps: record.learningSteps ?? 0,
      reps: record.reps,
      scheduled_days: record.scheduledDays ?? record.intervalDays,
      stability: record.stability,
      state: fsrsStateFromMastery(record),
    };
  }

  // Migrate SM-2-only records into an FSRS card without wiping progress.
  const empty = createEmptyCard(
    unixToDate(record.due > 0 ? record.due : Date.now() / 1000)
  );
  if (record.reps <= 0 && record.lastReview <= 0) {
    return empty;
  }

  return {
    ...empty,
    difficulty: Math.min(10, Math.max(1, 10 - (record.easeFactor - 1.3) * 2)),
    lapses: record.lapses,
    last_review:
      record.lastReview > 0 ? unixToDate(record.lastReview) : undefined,
    reps: record.reps,
    scheduled_days: Math.max(0, record.intervalDays),
    stability: Math.max(0.1, record.intervalDays || 0.5),
    state:
      record.state === "new"
        ? State.New
        : record.state === "learning"
          ? State.Learning
          : State.Review,
  };
}

function fsrsStateFromMastery(record: IWordMastery): State {
  switch (record.fsrsState) {
    case "Learning":
      return State.Learning;
    case "Review":
      return State.Review;
    case "Relearning":
      return State.Relearning;
    case "New":
      return State.New;
    default:
      break;
  }
  switch (record.state) {
    case "learning":
      return State.Learning;
    case "review":
    case "mastered":
      return State.Review;
    default:
      return State.New;
  }
}

export interface FsrsReviewResult {
  difficulty: number;
  due: number;
  elapsedDays: number;
  fsrsState: "New" | "Learning" | "Review" | "Relearning";
  intervalDays: number;
  lapses: number;
  learningSteps: number;
  reps: number;
  scheduledDays: number;
  stability: number;
  state: WordMasteryState;
}

export function fsrsReview(
  record: IWordMastery,
  wrongCount: number,
  nowUnix: number
): FsrsReviewResult {
  const rating = ratingFromWrongCount(wrongCount);
  const card = cardFromMastery(record);
  const now = unixToDate(nowUnix);
  const { card: next } = scheduler.next(card, now, rating);

  return {
    difficulty: next.difficulty,
    due: dateToUnix(next.due),
    elapsedDays: next.elapsed_days,
    fsrsState: State[next.state] as FsrsReviewResult["fsrsState"],
    intervalDays: Math.max(0, Math.round(next.scheduled_days)),
    lapses: next.lapses,
    learningSteps: next.learning_steps,
    reps: next.reps,
    scheduledDays: next.scheduled_days,
    stability: next.stability,
    state: masteryStateFromFsrs(next.state, next.scheduled_days, rating),
  };
}
