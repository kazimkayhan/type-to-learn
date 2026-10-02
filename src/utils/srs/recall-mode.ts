import type { RecallMode } from "@/typings";

export type EffectiveRecallMode = Exclude<RecallMode, "rotate">;

const ROTATE_CYCLE: EffectiveRecallMode[] = [
  "classic",
  "definition",
  "audio",
  "cloze",
];

export function resolveRecallMode(
  mode: RecallMode,
  wordIndex: number
): EffectiveRecallMode {
  if (mode !== "rotate") {
    return mode;
  }
  return ROTATE_CYCLE[Math.abs(wordIndex) % ROTATE_CYCLE.length] ?? "classic";
}

export function recallModeLabel(mode: EffectiveRecallMode): string {
  switch (mode) {
    case "definition":
      return "Definition → type";
    case "audio":
      return "Audio → type";
    case "cloze":
      return "Cloze → type";
    default:
      return "Classic";
  }
}
