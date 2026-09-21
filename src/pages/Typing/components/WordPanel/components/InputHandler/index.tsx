import { useAtomValue } from "jotai";
import type { FormEvent } from "react";
import { useMemo } from "react";
import { useIsTouch } from "@/hooks/useMediaQuery";
import { currentDictInfoAtom } from "@/store";
import KeyEventHandler from "../KeyEventHandler";
import TextAreaHandler from "../TextAreaHandler";

export default function InputHandler({
  updateInput,
}: {
  updateInput: (updateObj: WordUpdateAction) => void;
}) {
  const dictInfo = useAtomValue(currentDictInfoAtom);
  const isTouch = useIsTouch();

  const handler = useMemo(() => {
    const needsTextArea =
      isTouch || !["en", "de", "romaji"].includes(dictInfo.language);
    if (needsTextArea) {
      return <TextAreaHandler updateInput={updateInput} />;
    }

    return <KeyEventHandler updateInput={updateInput} />;
  }, [dictInfo.language, isTouch, updateInput]);

  return <>{handler}</>;
}
export type WordUpdateAction =
  | WordAddAction
  | WordDeleteAction
  | WordCompositionAction;

type WordAddAction = {
  type: "add";
  value: string;
  event: FormEvent<HTMLTextAreaElement> | KeyboardEvent;
};

type WordDeleteAction = {
  type: "delete";
  length: number;
};

// composition api is not ready yet
type WordCompositionAction = {
  type: "composition";
  value: string;
};
