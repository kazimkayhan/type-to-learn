import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { customDictionariesAtom, refreshCustomDictionaries } from "@/store";

/** Loads custom dictionaries from IndexedDB into the jotai cache. */
export function useHydrateCustomDictionaries() {
  const setCustomDictionaries = useSetAtom(customDictionariesAtom);

  useEffect(() => {
    refreshCustomDictionaries(setCustomDictionaries).catch(() => {
      setCustomDictionaries([]);
    });
  }, [setCustomDictionaries]);
}
