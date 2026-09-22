import { atom, useAtomValue } from "jotai";
import { useState } from "react";
import Drawer from "@/components/drawer";
import Tooltip from "@/components/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
} from "@/store";
import ListIcon from "~icons/tabler/list";
import { TypingStateActionType, useTypingContext } from "../../store";
import WordCard from "./word-card";

const currentDictTitle = atom((get) => {
  const isReviewMode = get(isReviewModeAtom);

  if (isReviewMode) {
    return `${get(currentDictInfoAtom).name} Error Review`;
  }
  return `${get(currentDictInfoAtom).name} Chapter ${get(currentChapterAtom) + 1}`;
});

export default function WordList() {
  const { state, dispatch } = useTypingContext();

  const [isOpen, setIsOpen] = useState(false);
  const currentDictTitleValue = useAtomValue(currentDictTitle);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
    dispatch({ payload: false, type: TypingStateActionType.SET_IS_TYPING });
  }

  return (
    <>
      <Tooltip
        className="!absolute top-[50%] left-[max(0.5rem,env(safe-area-inset-left))] z-20"
        content="List"
        placement="top"
      >
        <button
          aria-label="Open chapter word list"
          className="fixed top-[50%] left-0 z-20 min-h-11 rounded-lg rounded-l-none bg-indigo-50 px-2 py-3 text-lg hover:bg-indigo-200 focus-visible:ring-2 focus-visible:ring-indigo-400 dark:bg-indigo-900 dark:hover:bg-indigo-800"
          onClick={openModal}
          type="button"
        >
          <ListIcon className="h-6 w-6 text-indigo-500 text-lg dark:text-white" />
        </button>
      </Tooltip>

      <Drawer
        classNames="bg-stone-50 dark:bg-gray-900"
        onClose={closeModal}
        open={isOpen}
      >
        <h3 className="p-4 pr-12 font-medium text-lg leading-6 dark:text-gray-50">
          {currentDictTitleValue}
        </h3>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="h-full w-full px-3 pb-4">
            <div className="flex h-full w-full flex-col gap-1">
              {state.chapterData.words?.map((word, index) => (
                <WordCard
                  isActive={state.chapterData.index === index}
                  key={`${word.name}_${index}`}
                  word={word}
                />
              ))}
            </div>
          </div>
          <ScrollBar
            className="flex touch-none select-none bg-transparent"
            orientation="vertical"
          />
        </ScrollArea>
      </Drawer>
    </>
  );
}
