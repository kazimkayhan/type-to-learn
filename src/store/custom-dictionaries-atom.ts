import { atom } from "jotai";
import type { Dictionary } from "@/typings";
import { listCustomDictionaries } from "@/utils/db/custom-lists";

/** Synced snapshot of custom lists as Dictionary resources for lookup. */
export const customDictionariesAtom = atom<Dictionary[]>([]);

export async function refreshCustomDictionaries(
  setDictionaries: (dicts: Dictionary[]) => void
): Promise<Dictionary[]> {
  const dicts = await listCustomDictionaries();
  setDictionaries(dicts);
  return dicts;
}
