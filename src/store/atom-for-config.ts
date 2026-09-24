import type { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { RESET } from "jotai/vanilla/utils/constants";

type SetStateActionWithReset<Value> =
  | Value
  | typeof RESET
  | ((prev: Value) => Value | typeof RESET);

// Merges in any default keys missing from what's stored (e.g. after a
// config's shape grows a new field) via atomWithStorage's own getItem hook,
// so the merged value actually lands in the atom's base state instead of
// being recomputed - and discarded - on every read.
function createMergingStorage<T extends Record<string, unknown>>(
  defaultValue: T
) {
  return {
    getItem(key: string, initialValue: T): T {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return initialValue;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return defaultValue;
      }

      if (typeof parsed !== "object" || parsed === null) {
        return defaultValue;
      }

      return { ...defaultValue, ...(parsed as Partial<T>) };
    },
    removeItem(key: string) {
      localStorage.removeItem(key);
    },
    setItem(key: string, newValue: T) {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
  };
}

export default function atomForConfig<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T
): WritableAtom<T, [SetStateActionWithReset<T>], void> {
  return atomWithStorage(key, defaultValue, createMergingStorage(defaultValue));
}
