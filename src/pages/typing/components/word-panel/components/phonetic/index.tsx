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
        className="inline-flex max-w-full items-baseline gap-2 rounded-full bg-muted px-2.5 py-1"
      >
        <span className="shrink-0 rounded-md bg-primary/15 px-1.5 py-0.5 font-semibold text-[0.65em] text-primary tracking-wide">
          {isAmerican ? "US" : "UK"}
        </span>
        <span className="font-normal text-foreground text-sm italic leading-none tracking-wide">
          /{ipa}/
        </span>
      </p>
    </div>
  );
}

export default Phonetic;
