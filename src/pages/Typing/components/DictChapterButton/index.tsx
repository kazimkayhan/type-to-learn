import { useAtom, useAtomValue } from "jotai";
import { NavLink } from "react-router-dom";
import Tooltip from "@/components/Tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
} from "@/store";
import range from "@/utils/range";

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const chapterCount = currentDictInfo.chapterCount;
  const isReviewMode = useAtomValue(isReviewModeAtom);

  return (
    <>
      <Tooltip content="Switch dictionary">
        <NavLink
          className="block max-w-[9.5rem] truncate rounded-lg px-2 py-2 text-base transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none sm:max-w-[16rem] sm:px-3 sm:text-lg dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
          to="/gallery"
        >
          {currentDictInfo.name} {isReviewMode && "Error Review"}
        </NavLink>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content="Switch chapter">
          <Select
            onValueChange={(val) => setCurrentChapter(Number.parseInt(val, 10))}
            value={currentChapter.toString()}
          >
            <SelectTrigger className="min-h-10 rounded-lg px-2 py-2 text-base transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none sm:px-3 sm:text-lg dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100">
              <SelectValue>Chapter {currentChapter + 1}</SelectValue>
            </SelectTrigger>
            <SelectContent className="z-10 w-32">
              {range(0, chapterCount, 1).map((index) => (
                <SelectItem key={index} value={index.toString()}>
                  Chapter {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Tooltip>
      )}
    </>
  );
};
