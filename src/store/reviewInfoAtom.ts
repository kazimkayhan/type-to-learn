import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { ReviewRecord } from "@/utils/db/record";
import { putWordReviewRecord } from "@/utils/db/review-record";

type TReviewInfoAtomData = {
  isReviewMode: boolean;
  reviewRecord: ReviewRecord | undefined;
};

export function reviewInfoAtom(initialValue: TReviewInfoAtomData) {
  const storageAtom = atomWithStorage("reviewModeInfo", initialValue);

  return atom(
    (get) => get(storageAtom),
    (
      get,
      set,
      updater:
        | TReviewInfoAtomData
        | ((oldValue: TReviewInfoAtomData) => TReviewInfoAtomData)
    ) => {
      const newValue =
        typeof updater === "function" ? updater(get(storageAtom)) : updater;

      // update reviewRecord to indexdb
      if (newValue.reviewRecord?.id) {
        putWordReviewRecord(newValue.reviewRecord);
      }
      set(storageAtom, newValue);
    }
  );
}
