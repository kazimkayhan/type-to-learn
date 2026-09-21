import type { SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { LoadingUI } from "@/components/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ErrorColumn } from "./columns";
import { errorColumns } from "./columns";

interface DataTableProps {
  data: ErrorColumn[];
  error: unknown;
  isLoading: boolean;
  onDelete: (word: string) => Promise<void>;
}

export function ErrorTable({
  data,
  isLoading,
  error,
  onDelete,
}: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => errorColumns(onDelete), [onDelete]);

  const table = useReactTable({
    autoResetPageIndex: true,
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="h-full w-full overflow-x-auto rounded-md border p-1">
      <Table className="h-full w-full" {...{}}>
        <TableHeader className="sticky top-0 bg-white dark:bg-slate-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  {...{
                    colSpan: header.colSpan,
                    style: {
                      width: header.getSize(),
                    },
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="w-full">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                data-state={row.getIsSelected() && "selected"}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    {...{
                      style: {
                        width: cell.column.getSize(),
                      },
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="h-[22rem] text-center"
                colSpan={table.getAllColumns().length}
              >
                {isLoading ? (
                  <LoadingUI />
                ) : error ? (
                  "Something went wrong — try refreshing"
                ) : (
                  "No data yet — start practicing!"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
