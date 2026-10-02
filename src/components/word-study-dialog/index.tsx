import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import WordStudySheet from "@/components/word-study-sheet";
import { customDictionariesAtom } from "@/store";
import type { Word } from "@/typings";
import type { IWordMastery } from "@/utils/db/record";
import { findDictionary } from "@/utils/dictionary-lookup";
import { wordListFetcher } from "@/utils/word-list-fetcher";
import IconX from "~icons/tabler/x";

interface WordStudyDialogProps {
  mastery: IWordMastery;
  onClose: () => void;
  onMasteryChange?: (mastery: IWordMastery) => void;
}

export default function WordStudyDialog({
  mastery,
  onClose,
  onMasteryChange,
}: WordStudyDialogProps) {
  const [word, setWord] = useState<Word | null>(null);
  const customDictionaries = useAtomValue(customDictionariesAtom);

  useEffect(() => {
    let cancelled = false;
    setWord(null);

    const load = async () => {
      const dictInfo = findDictionary(mastery.dict, customDictionaries);
      if (!dictInfo) {
        if (!cancelled) {
          setWord({ name: mastery.word, trans: [] });
        }
        return;
      }
      try {
        const list = await wordListFetcher(dictInfo.url);
        const found = list.find((item) => item.name === mastery.word);
        if (!cancelled) {
          setWord(found ?? { name: mastery.word, trans: [] });
        }
      } catch {
        if (!cancelled) {
          setWord({ name: mastery.word, trans: [] });
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [customDictionaries, mastery.dict, mastery.word]);

  useHotkeys(
    "esc",
    (e) => {
      onClose();
      e.stopPropagation();
    },
    { preventDefault: true }
  );

  const handleBackdrop = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <button
        aria-label="Dismiss"
        className="absolute inset-0 bg-foreground/40"
        onClick={handleBackdrop}
        type="button"
      />
      <div className="relative z-10 my-card flex max-h-[90dvh] w-[min(26rem,calc(100vw-1.5rem))] flex-col overflow-y-auto rounded-2xl bg-card px-4 py-10">
        <button
          aria-label="Close"
          className="absolute top-3 right-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onClose}
          type="button"
        >
          <IconX className="size-6" />
        </button>
        {word ? (
          <WordStudySheet
            dictId={mastery.dict}
            onClose={onClose}
            onMasteryChange={onMasteryChange}
            word={word}
          />
        ) : (
          <p className="py-10 text-center text-muted-foreground text-sm">
            Loading word…
          </p>
        )}
      </div>
    </div>
  );
}
