import { useMemo } from "react";
import { isKanji } from "@/utils/kana";

type NotationProps = {
  notation: string;
};

type NotationInfo = {
  word: string;
  phonetic?: string;
};

export default function Notation({ notation }: NotationProps) {
  const infos: NotationInfo[] = useMemo(
    () => getNotationInfo(notation),
    [notation]
  );
  return (
    <div className="mx-auto flex h-20 items-end">
      <ruby className="mb-1 p-0 font-mono text-5xl text-gray-800 dark:text-opacity-80">
        {infos.map(({ word, phonetic }) => {
          const hasPhonetic = phonetic && phonetic.length > 0;
          const isEmptyPhonetic = hasPhonetic && phonetic.trim().length == 0;
          return (
            <>
              {word}
              {hasPhonetic && isEmptyPhonetic ? (
                <>
                  <rt>{phonetic}</rt>
                </>
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
  let match;
  let start = 0;
  const ret = [];
  while ((match = re.exec(notation))) {
    const [fullMatch, , phonetic] = match;
    let word = match[1];
    if (match.index > start) {
      ret.push({ phonetic: "", word: notation.substring(start, match.index) });
    }
    let kanjiStart = 0;
    for (let i = 0; i < word.length; i++) {
      if (!isKanji(word[i])) {
        kanjiStart += 1;
      } else if (kanjiStart > 0) {
        ret.push({
          phonetic: " ",
          word: word.substring(0, i),
        });
        word = word.substring(i);
        break;
      }
    }
    ret.push({
      phonetic,
      word,
    });
    start = match.index + fullMatch.length;
  }
  if (start < notation.length) {
    ret.push({
      phonetic: "",
      word: notation.substring(start),
    });
  }
  return ret;
};
