import { useSetAtom } from "jotai";
import type { FC } from "react";
import { useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idDictionaryMap } from "@/resources/dictionary";
import { recordErrorBookAction } from "@/utils";
import DeleteIcon from "~icons/weui/delete-filled";
import useGetWord from "./hooks/useGetWord";
import { LoadingWordUI } from "./LoadingWordUI";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";

type IErrorRowProps = {
  record: groupedWordRecords;
  onDelete: () => void;
};

const ErrorRow: FC<IErrorRowProps> = ({ record, onDelete }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom);
  const dictInfo = idDictionaryMap[record.dict];
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo);

  const onClick = useCallback(() => {
    setCurrentRowDetail(record);
    recordErrorBookAction("detail");
  }, [record, setCurrentRowDetail]);

  return (
    <li
      className="flex w-full cursor-pointer flex-col gap-2 rounded-lg bg-white px-4 py-3 text-black opacity-85 shadow-md md:flex-row md:items-center md:justify-between md:px-6 dark:bg-gray-800 dark:text-white"
      onClick={onClick}
    >
      <span className="basis-2/12 break-normal font-mono text-lg md:text-base">
        {record.word}
      </span>
      <span className="basis-6/12 break-normal text-gray-600 text-sm md:text-base md:text-black dark:text-gray-300 md:dark:text-white">
        {word ? (
          word.trans.join("; ")
        ) : (
          <LoadingWordUI hasError={hasError} isLoading={isLoading} />
        )}
      </span>
      <div className="flex items-center justify-between gap-3 text-sm md:contents">
        <span className="basis-1/12 break-normal md:pl-8">
          {record.wrongCount}
        </span>
        <span className="basis-1/12 break-normal text-gray-500 md:text-inherit">
          {dictInfo?.name}
        </span>
        <span
          className="flex min-h-10 min-w-10 items-center justify-center break-normal md:basis-1/12"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <DeleteIcon />
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Records</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
    </li>
  );
};

export default ErrorRow;
