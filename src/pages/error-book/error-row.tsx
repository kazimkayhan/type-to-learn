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
import useGetWord from "./hooks/use-get-word";
import { LoadingWordUI } from "./loading-word-ui";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";

interface IErrorRowProps {
  onDelete: () => void;
  record: groupedWordRecords;
}

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
      className="grid w-full cursor-pointer grid-cols-1 gap-2 rounded-lg bg-card px-4 py-3 text-foreground shadow-md md:grid-cols-[minmax(6.5rem,1fr)_minmax(0,2.5fr)_6.5rem_minmax(7rem,1fr)_auto] md:items-center md:gap-4 md:px-6"
      onClick={onClick}
    >
      <span className="min-w-0 break-words font-mono text-lg md:text-base">
        {record.word}
      </span>
      <span className="min-w-0 break-words text-muted-foreground text-sm md:text-base md:text-foreground">
        {word ? (
          word.trans.join("; ")
        ) : (
          <LoadingWordUI hasError={hasError} isLoading={isLoading} />
        )}
      </span>
      <span className="tabular-nums">{record.wrongCount}</span>
      <span className="min-w-0 truncate text-muted-foreground md:text-inherit">
        {dictInfo?.name}
      </span>
      <span
        className="flex min-h-10 min-w-10 items-center justify-center"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              aria-label="Delete records"
              className="rounded p-1 hover:text-destructive"
              onClick={onDelete}
              type="button"
            >
              <DeleteIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete records</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </li>
  );
};

export default ErrorRow;
