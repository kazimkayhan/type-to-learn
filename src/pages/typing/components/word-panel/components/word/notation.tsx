import { useMemo } from "react";
import { isKanji } from "@/utils/kana";

interface NotationProps {
  notation: string;
}

interface NotationInfo {
  phonetic?: string;
  word: string;
}

export default function Notation({ notation }: NotationProps) {
  const infos: NotationInfo[] = useMemo(
    () => getNotationInfo(notation),
    [notation]
  );
  return (
    <div className="mx-auto flex h-20 items-end">
      <ruby className="mb-1 p-0 font-mono text-5xl text-foreground">
        {infos.map(({ word, phonetic }) => {
          const hasPhonetic = phonetic && phonetic.length > 0;
          const isEmptyPhonetic = hasPhonetic && phonetic.trim().length === 0;
          return (
            <>
              {word}
              {hasPhonetic && isEmptyPhonetic ? (
                <rt>{phonetic}</rt>
              ) : (
                <>
                  <rp>{"("}</rp>
                  <rt>{phonetic}</rt>
                  <rp>{")"}</rp>
                </>
              )}
            </>
          );
        })}
      </ruby>
    </div>
  );
}

const getNotationInfo = (notation: string): NotationInfo[] => {
  const re = /(.+?)\((.+?)\)/g;
  let match: RegExpExecArray | null;
  let start = 0;
  const ret = [];

  match = re.exec(notation);
  while (match !== null) {
    const [fullMatch, wordMatch, phonetic] = match;
    let word = wordMatch;
    if (match.index > start) {
      ret.push({ phonetic: "", word: notation.slice(start, match.index) });
    }
    let kanjiStart = 0;
    for (let i = 0; i < word.length; i += 1) {
      if (!isKanji(word[i])) {
        kanjiStart += 1;
      } else if (kanjiStart > 0) {
        ret.push({
          phonetic: " ",
          word: word.slice(0, i),
        });
        word = word.slice(i);
        break;
      }
    }
    ret.push({
      phonetic,
      word,
    });
    start = match.index + fullMatch.length;
    match = re.exec(notation);
  }
  if (start < notation.length) {
    ret.push({
      phonetic: "",
      word: notation.slice(start),
    });
  }
  return ret;
};
