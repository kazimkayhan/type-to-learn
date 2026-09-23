import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db, useDeleteWordRecord } from "@/utils/db";
import type { WordRecord } from "@/utils/db/record";
import IconX from "~icons/tabler/x";
import DropdownExport from "./dropdown-export";
import ErrorRow from "./error-row";
import type { ISortType } from "./head-wrong-number";
import HeadWrongNumber from "./head-wrong-number";
import Pagination, { ITEM_PER_PAGE } from "./pagination";
import RowDetail from "./row-detail";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";

export function ErrorBook() {
  const [groupedRecords, setGroupedRecords] = useState<groupedWordRecords[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(
    () => Math.ceil(groupedRecords.length / ITEM_PER_PAGE),
    [groupedRecords.length]
  );
  const [sortType, setSortType] = useState<ISortType>("asc");
  const navigate = useNavigate();
  const currentRowDetail = useAtomValue(currentRowDetailAtom);
  const { deleteWordRecord } = useDeleteWordRecord();
  const [reload, setReload] = useState(false);

  const onBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) {
        return;
      }
      setCurrentPage(page);
    },
    [totalPages]
  );

  const setSort = useCallback(
    (newSortType: ISortType) => {
      setSortType(newSortType);
      setPage(1);
    },
    [setPage]
  );

  const sortedRecords = useMemo(() => {
    if (sortType === "none") {
      return groupedRecords;
    }
    return [...groupedRecords].sort((a, b) => {
      if (sortType === "asc") {
        return a.wrongCount - b.wrongCount;
      }
      return b.wrongCount - a.wrongCount;
    });
  }, [groupedRecords, sortType]);

  const renderRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE;
    const end = start + ITEM_PER_PAGE;
    return sortedRecords.slice(start, end);
  }, [currentPage, sortedRecords]);

  useEffect(() => {
    db.wordRecords
      .where("wrongCount")
      .above(0)
      .toArray()
      .then((records) => {
        const groups: groupedWordRecords[] = [];

        for (const record of records) {
          let group = groups.find(
            (g) => g.word === record.word && g.dict === record.dict
          );
          if (!group) {
            group = {
              dict: record.dict,
              records: [],
              word: record.word,
              wrongCount: 0,
            };
            groups.push(group);
          }
          group.records.push(record as WordRecord);
        }

        for (const group of groups) {
          group.wrongCount = group.records.reduce(
            (acc, cur) => acc + cur.wrongCount,
            0
          );
        }

        setGroupedRecords(groups);
      });
  }, [reload]);

  const handleDelete = async (word: string, dict: string) => {
    await deleteWordRecord(word, dict);
    setReload((prev) => !prev);
  };

  return (
    <>
      <div
        className={`relative flex h-dvh w-full flex-col items-center pb-4 ease-in ${currentRowDetail && "blur-sm"}`}
      >
        <div className="mt-4 flex w-full items-start justify-between gap-3 px-4 sm:px-8">
          <div className="min-w-0">
            <h1 className="font-medium text-foreground text-lg">Error Book</h1>
            <p className="mt-0.5 text-muted-foreground text-sm">
              Mistakes from practice. Click a word for details.
            </p>
          </div>
          <button
            aria-label="Close Error Book"
            className="rounded p-1 text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onBack}
            type="button"
          >
            <IconX className="h-7 w-7" />
          </button>
        </div>

        <div className="flex w-full flex-1 select-text items-start justify-center overflow-hidden px-3 sm:px-0">
          <div className="flex h-full w-full flex-col pt-4 sm:w-5/6 sm:pt-10">
            <div className="hidden w-full items-center gap-4 rounded-lg bg-card px-6 py-4 text-base text-foreground shadow-lg md:grid md:grid-cols-[minmax(6.5rem,1fr)_minmax(0,2.5fr)_6.5rem_minmax(7rem,1fr)_auto]">
              <span>Word</span>
              <span>Definition</span>
              <HeadWrongNumber setSortType={setSort} sortType={sortType} />
              <span>Dictionary</span>
              <DropdownExport renderRecords={sortedRecords} />
            </div>
            <div className="mb-3 flex items-center justify-between md:hidden">
              <HeadWrongNumber
                className="text-sm"
                setSortType={setSort}
                sortType={sortType}
              />
              <DropdownExport renderRecords={sortedRecords} />
            </div>
            <ScrollArea className="flex-1 overflow-y-auto pt-5">
              <div className="h-full">
                {renderRecords.length === 0 ? (
                  <div className="flex h-60 flex-col items-center justify-center gap-2 px-4 text-center">
                    <p className="font-medium text-foreground">
                      No missed words yet
                    </p>
                    <p className="max-w-sm text-muted-foreground text-sm">
                      Mistakes from practice on this site are stored in this
                      browser. Practice here, mistype a word, and it will show
                      up after you finish it.
                    </p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {renderRecords.map((record) => (
                      <ErrorRow
                        key={`${record.dict}-${record.word}`}
                        onDelete={() => handleDelete(record.word, record.dict)}
                        record={record}
                      />
                    ))}
                  </ul>
                )}
              </div>
              <ScrollBar
                className="flex touch-none select-none bg-transparent"
                orientation="vertical"
              />
            </ScrollArea>
          </div>
        </div>
        {totalPages > 0 ? (
          <Pagination
            className="pt-3"
            page={currentPage}
            setPage={setPage}
            totalPages={totalPages}
          />
        ) : null}
      </div>
      {currentRowDetail ? (
        <RowDetail
          allRecords={sortedRecords}
          currentRowDetail={currentRowDetail}
        />
      ) : null}
    </>
  );
}
