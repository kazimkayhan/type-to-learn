import { idDictionaryMap } from "@/resources/dictionary";
import type { Dictionary } from "@/typings";
import { isCustomDictId } from "@/utils/db/custom-lists";

export function findDictionary(
  id: string,
  customDictionaries: Dictionary[] = []
): Dictionary | undefined {
  return (
    idDictionaryMap[id] ?? customDictionaries.find((dict) => dict.id === id)
  );
}

export function isKnownDictionaryId(
  id: string,
  customDictionaries: Dictionary[] = []
): boolean {
  if (id in idDictionaryMap) {
    return true;
  }
  if (!isCustomDictId(id)) {
    return false;
  }
  return customDictionaries.some((dict) => dict.id === id);
}
