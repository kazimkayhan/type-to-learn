import React, { useCallback, useEffect, useImperativeHandle } from "react";
import usePronunciationSound from "@/hooks/usePronunciation";
import type { Word } from "@/typings";
import { SoundIcon } from "./SoundIcon";

export const WordPronunciationIcon = React.forwardRef<
  WordPronunciationIconRef,
  { word: Word; lang: string; className?: string; iconClassName?: string }
>(({ word, lang, className, iconClassName }, ref) => {
  const currentWord = () => {
    if (lang === "hapin") {
      if (/[\u0400-\u04FF]/.test(word.notation || "")) {
        // 哈萨克语西里尔文字
        return word.notation || "";
      }
      // 哈萨克语老文字
      return word.trans[2];
    }
    return word.name;
  };
  const { play, stop, isPlaying } = usePronunciationSound(currentWord());

  const playSound = useCallback(() => {
    stop();
    play();
  }, [play, stop]);

  useEffect(() => stop, [word, stop]);

  useImperativeHandle(
    ref,
    () => ({
      play: playSound,
    }),
    [playSound]
  );

  return (
    <SoundIcon
      animated={isPlaying}
      className={`cursor-pointer text-gray-600 ${className}`}
      iconClassName={iconClassName}
      onClick={playSound}
    />
  );
});

WordPronunciationIcon.displayName = "WordPronunciationIcon";

export type WordPronunciationIconRef = {
  play: () => void;
};
