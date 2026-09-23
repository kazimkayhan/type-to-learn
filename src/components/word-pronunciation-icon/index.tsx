import type React from "react";
import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import usePronunciationSound from "@/hooks/use-pronunciation";
import type { Word } from "@/typings";
import { SoundIcon } from "./sound-icon";

const CYRILLIC_REGEX = /[\u0400-\u04FF]/;

export const WordPronunciationIcon = ({
  autoPlay = false,
  isTyping = false,
  word,
  lang,
  className,
  iconClassName,
  ref,
}: {
  autoPlay?: boolean;
  className?: string;
  iconClassName?: string;
  isTyping?: boolean;
  lang: string;
  ref?: React.RefObject<WordPronunciationIconRef | null>;
  word: Word;
}) => {
  const spokenWord = getSpokenWord(word, lang);
  const { isPlaying, playExclusive } = usePronunciationSound(spokenWord);

  const playSound = useCallback(() => {
    playExclusive();
  }, [playExclusive]);
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;
  const lastPlayedWordRef = useRef("");
  const wasTypingRef = useRef(false);

  useEffect(() => {
    const startedTyping = isTyping && !wasTypingRef.current;
    wasTypingRef.current = isTyping;

    if (!autoPlay) {
      return;
    }

    const wordChanged = lastPlayedWordRef.current !== spokenWord;
    if (!(wordChanged || startedTyping)) {
      return;
    }

    lastPlayedWordRef.current = spokenWord;
    playSoundRef.current();
  }, [autoPlay, isTyping, spokenWord]);

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
      className={`cursor-pointer text-muted-foreground ${className}`}
      iconClassName={iconClassName}
      onClick={playSound}
    />
  );
};

function getSpokenWord(word: Word, lang: string): string {
  if (lang === "hapin") {
    if (CYRILLIC_REGEX.test(word.notation || "")) {
      return word.notation || "";
    }
    return word.trans[2];
  }
  return word.name;
}

WordPronunciationIcon.displayName = "WordPronunciationIcon";

export interface WordPronunciationIconRef {
  play: () => void;
}
