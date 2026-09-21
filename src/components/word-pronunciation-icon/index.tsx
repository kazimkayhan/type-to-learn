import type React from "react";
import { useCallback, useEffect, useImperativeHandle } from "react";
import usePronunciationSound from "@/hooks/use-pronunciation";
import type { Word } from "@/typings";
import { SoundIcon } from "./sound-icon";

const CYRILLIC_REGEX = /[\u0400-\u04FF]/;

export const WordPronunciationIcon = ({
  word,
  lang,
  className,
  iconClassName,
  ref,
}: {
  word: Word;
  lang: string;
  className?: string;
  iconClassName?: string;
  ref?: React.RefObject<WordPronunciationIconRef | null>;
}) => {
  const currentWord = () => {
    if (lang === "hapin") {
      if (CYRILLIC_REGEX.test(word.notation || "")) {
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

  useEffect(() => stop, [stop]);

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
};

WordPronunciationIcon.displayName = "WordPronunciationIcon";

export interface WordPronunciationIconRef {
  play: () => void;
}
