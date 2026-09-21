import { useCallback } from "react";
import Tooltip from "@/components/tooltip";
import usePronunciationSound from "@/hooks/use-pronunciation";
import type { WordWithIndex } from "@/typings";

export default function WordChip({ word }: { word: WordWithIndex }) {
  const { play, stop } = usePronunciationSound(word.name, false);

  const onClickWord = useCallback(() => {
    stop();
    play();
  }, [play, stop]);

  return (
    <Tooltip content={word.trans}>
      <button
        className="word-chip select-all"
        onClick={onClickWord}
        title={`Read aloud ${word.name}`}
        type="button"
      >
        <span>{word.name}</span>
      </button>
    </Tooltip>
  );
}
