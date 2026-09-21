import { useAtomValue } from "jotai";
import { isTextSelectableAtom, phoneticConfigAtom } from "@/store";
import type { Word, WordWithIndex } from "@/typings";

interface PhoneticProps {
  word: WordWithIndex | Word;
}

function Phonetic({ word }: PhoneticProps) {
  const phoneticConfig = useAtomValue(phoneticConfigAtom);
  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  const isAmerican = phoneticConfig.type === "us";
  const ipa = (isAmerican ? word.usphone : word.ukphone)?.trim() ?? "";

  if (ipa.length <= 1) {
    return null;
  }

  return (
    <div
      className={`flex justify-center px-3 pt-1.5 pb-0.5 ${
        isTextSelectable ? "select-text" : ""
      }`}
    >
      <p
        aria-label={`${isAmerican ? "US" : "UK"} pronunciation: ${ipa}`}
        className="inline-flex max-w-full items-baseline gap-2 rounded-full bg-indigo-100/80 px-2.5 py-1 dark:bg-indigo-400/15"
      >
        <span className="shrink-0 rounded-md bg-indigo-500/15 px-1.5 py-0.5 font-semibold text-[0.65em] text-indigo-700 tracking-wide dark:bg-indigo-400/20 dark:text-indigo-300">
          {isAmerican ? "US" : "UK"}
        </span>
        <span className="font-normal text-gray-800 text-sm italic leading-none tracking-wide dark:text-indigo-50">
          /{ipa}/
        </span>
      </p>
    </div>
  );
}

export default Phonetic;
