import type { WordMasteryState } from "@/utils/db/record";

export function deriveMasteryState(
  repetitions: number,
  intervalDays: number,
  lapses: number,
  quality: number
): WordMasteryState {
  if (repetitions === 0 && lapses === 0) {
    return "new";
  }
  if (intervalDays >= 21 && repetitions >= 3 && quality >= 4 && lapses <= 1) {
    return "mastered";
  }
  if (repetitions >= 1) {
    return "review";
  }
  return "learning";
}
