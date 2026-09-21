import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PhArrowsDownUpFill from "~icons/ph/arrows-down-up-fill";
import DeleteIcon from "~icons/weui/delete-filled";
import type { TErrorWordData } from "../hooks/use-error-words";

export interface ErrorColumn {
  errorChar: string[];
  errorCount: number;
  trans: string;
  word: string;
}

export const errorColumns = (
  onDelete: (word: string) => Promise<void>
): ColumnDef<ErrorColumn>[] => [
  {
    accessorKey: "word",
    header: ({ column }) => (
      <Button
        className="p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Word
        <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
      </Button>
    ),
    size: 100,
  },
  {
    accessorKey: "trans",
    header: "Definition",
    size: 500,
  },
  {
    accessorKey: "errorCount",
    cell: ({ row }) => (
      <span className="flex justify-center">{row.original.errorCount} </span>
    ),
    header: ({ column }) => (
      <Button
        className="p-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        variant="ghost"
      >
        Mistakes
        <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
      </Button>
    ),
    size: 40,
  },
  {
    accessorKey: "errorChar",
    cell: ({ row }) => (
      <p>
        {(row.getValue("errorChar") as string[]).map((char, index) => (
          <kbd className="flex justify-center" key={`${char}-${index}`}>
            {`${char} `}
          </kbd>
        ))}
      </p>
    ),
    header: "Error-prone letters",
    size: 100,
  },
  {
    accessorKey: "delete",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DeleteIcon
              className="cursor-pointer"
              onClick={() => onDelete(row.original.word)}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Records</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    header: "",
    size: 40,
  },
];

export function getRowsFromErrorWordData(
  data: TErrorWordData[]
): ErrorColumn[] {
  return data.map((item) => ({
    errorChar: item.errorChar,
    errorCount: item.errorCount,
    trans: item.originData.trans.join("; ") ?? "",
    word: item.word,
  }));
}
