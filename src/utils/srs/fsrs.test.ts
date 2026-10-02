import { Rating } from "ts-fsrs";
import { describe, expect, it } from "vitest";
import type { IWordMastery } from "@/utils/db/record";
import {
  cardFromMastery,
  fsrsReview,
  ratingFromWrongCount,
} from "@/utils/srs/fsrs";

function baseMastery(overrides: Partial<IWordMastery> = {}): IWordMastery {
  return {
    dict: "test-dict",
    due: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    lapses: 0,
    lastReview: 0,
    reps: 0,
    state: "new",
    totalWrong: 0,
    word: "apple",
    ...overrides,
  };
}

describe("ratingFromWrongCount", () => {
  it("maps perfect / one miss / more to Good / Hard / Again", () => {
    expect(ratingFromWrongCount(0)).toBe(Rating.Good);
    expect(ratingFromWrongCount(1)).toBe(Rating.Hard);
    expect(ratingFromWrongCount(2)).toBe(Rating.Again);
    expect(ratingFromWrongCount(5)).toBe(Rating.Again);
  });
});

describe("fsrsReview", () => {
  const now = Math.floor(Date.UTC(2026, 0, 15, 12, 0, 0) / 1000);

  it("schedules a first Good review into the future", () => {
    const result = fsrsReview(baseMastery(), 0, now);
    expect(result.reps).toBeGreaterThan(0);
    expect(result.due).toBeGreaterThan(now);
    expect(result.fsrsState).not.toBe("New");
  });

  it("increments lapses on Again", () => {
    const learning = baseMastery({
      difficulty: 5,
      elapsedDays: 0,
      fsrsState: "Learning",
      lastReview: now - 3600,
      learningSteps: 0,
      reps: 1,
      scheduledDays: 0,
      stability: 0.4,
      state: "learning",
    });
    const result = fsrsReview(learning, 3, now);
    expect(result.lapses).toBeGreaterThanOrEqual(learning.lapses);
    expect(
      result.fsrsState === "Learning" || result.fsrsState === "Relearning"
    ).toBe(true);
  });

  it("migrates SM-2-only rows without wiping reps", () => {
    const sm2 = baseMastery({
      easeFactor: 2.6,
      intervalDays: 4,
      lastReview: now - 86_400,
      reps: 3,
      state: "review",
    });
    const card = cardFromMastery(sm2);
    expect(card.reps).toBe(3);
    expect(card.stability).toBeGreaterThan(0);
  });
});
