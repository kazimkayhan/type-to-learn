import { useAtomValue, useSetAtom } from "jotai";
import type { FC } from "react";
import { useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { customDictionariesAtom } from "@/store";
import { recordErrorBookAction } from "@/utils";
import { findDictionary } from "@/utils/dictionary-lookup";
import DeleteIcon from "~icons/weui/delete-filled";
import useGetWord from "./hooks/use-get-word";
import { LoadingWordUI } from "./loading-word-ui";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";

export function recordSelectionKey(record: groupedWordRecords): string {
  return `${record.dict}::${record.word}`;
}

interface IErrorRowProps {
  onDelete: () => void;
  onToggleSelect: (record: groupedWordRecords) => void;
  record: groupedWordRecords;
  selected: boolean;
}

const ErrorRow: FC<IErrorRowProps> = ({
  record,
  onDelete,
  onToggleSelect,
  selected,
}) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom);
  const customDictionaries = useAtomValue(customDictionariesAtom);
  const dictInfo = findDictionary(record.dict, customDictionaries);
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo);

  const onClick = useCallback(() => {
    setCurrentRowDetail(record);
    recordErrorBookAction("detail");
  }, [record, setCurrentRowDetail]);

  return (
    <li
      className="grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)] gap-2 rounded-lg bg-card px-4 py-3 text-foreground shadow-md md:grid-cols-[auto_minmax(6.5rem,1fr)_minmax(0,2.5fr)_6.5rem_minmax(7rem,1fr)_auto] md:items-center md:gap-4 md:px-6"
      onClick={onClick}
    >
      <span
        className="flex items-center justify-center self-start pt-1 md:self-center md:pt-0"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <input
          aria-label={`Select ${record.word}`}
          checked={selected}
          className="size-4 cursor-pointer accent-primary"
          onChange={() => onToggleSelect(record)}
          type="checkbox"
        />
      </span>
      <span className="min-w-0 break-words font-mono text-lg md:text-base">
        {record.word}
      </span>
      <span className="col-span-2 min-w-0 break-words text-muted-foreground text-sm md:col-span-1 md:text-base md:text-foreground">
        {word ? (
          word.trans.join("; ")
        ) : (
          <LoadingWordUI hasError={hasError} isLoading={isLoading} />
        )}
      </span>
      <span className="col-start-2 tabular-nums md:col-start-auto">
        {record.wrongCount}
      </span>
      <span className="col-span-2 min-w-0 truncate text-muted-foreground md:col-span-1 md:text-inherit">
        {dictInfo?.name}
      </span>
      <span
        className="col-start-2 flex min-h-10 min-w-10 items-center justify-center md:col-start-auto"
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
