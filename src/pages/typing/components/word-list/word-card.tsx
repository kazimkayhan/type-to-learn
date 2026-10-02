import { useAtomValue } from "jotai";
import { useCallback, useRef } from "react";
import type { WordPronunciationIconRef } from "@/components/word-pronunciation-icon";
import { WordPronunciationIcon } from "@/components/word-pronunciation-icon";
import { currentDictInfoAtom } from "@/store";
import type { Word } from "@/typings";

export default function WordCard({
  word,
  isActive,
}: {
  word: Word;
  isActive: boolean;
}) {
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);
  const currentLanguage = useAtomValue(currentDictInfoAtom).language;

  const handlePlay = useCallback(() => {
    wordPronunciationIconRef.current.play();
  }, []);

  return (
    <div
      className={`mb-2 flex cursor-pointer select-text items-center rounded-xl p-4 shadow-[var(--shadow-card)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
        isActive ? "bg-accent" : "bg-card"
      }`}
      key={word.name}
      onClick={handlePlay}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handlePlay();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="flex-1">
        <p className="select-all font-mono font-normal text-foreground text-xl leading-6">
          {["romaji", "hapin"].includes(currentLanguage)
            ? word.notation
            : word.name}
        </p>
        <div className="mt-2 max-w-sm font-sans text-muted-foreground text-sm">
          {word.trans.join("; ")}
        </div>
      </div>
      <WordPronunciationIcon
        className="h-8 w-8"
        lang={currentLanguage}
        ref={wordPronunciationIconRef}
        word={word}
      />
    </div>
  );
}
