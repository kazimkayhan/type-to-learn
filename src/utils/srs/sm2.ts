export interface Sm2State {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

export const DEFAULT_SM2_STATE: Sm2State = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

/** Map typing mistakes on a word to SM-2 quality (0–5). */
export function qualityFromWrongCount(wrongCount: number): number {
  if (wrongCount === 0) {
    return 5;
  }
  if (wrongCount === 1) {
    return 4;
  }
  if (wrongCount <= 3) {
    return 3;
  }
  return 2;
}

export function sm2Review(
  state: Sm2State,
  quality: number
): Sm2State & { dueDaysFromNow: number } {
  let { intervalDays, repetitions, easeFactor } = state;

  if (quality >= 3) {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }
    repetitions += 1;
  } else {
    repetitions = 0;
    intervalDays = 1;
  }

  easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  return {
    dueDaysFromNow: intervalDays,
    easeFactor,
    intervalDays,
    repetitions,
  };
}
