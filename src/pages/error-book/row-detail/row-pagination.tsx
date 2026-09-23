import { useAtom } from "jotai";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import NextIcon from "~icons/ooui/next-ltr";
import PrevIcon from "~icons/ooui/next-rtl";
import { currentRowDetailAtom } from "../store";
import type { groupedWordRecords } from "../type";

interface IRowPaginationProps {
  allRecords: groupedWordRecords[];
  className?: string;
}

const _ITEM_PER_PAGE = 20;

const RowPagination: FC<IRowPaginationProps> = ({ className, allRecords }) => {
  const [currentRowDetail, setCurrentRowDetail] = useAtom(currentRowDetailAtom);
  const currentIndex = useMemo(() => {
    if (!currentRowDetail) {
      return -1;
    }
    return allRecords.findIndex(
      (record) =>
        record.word === currentRowDetail.word &&
        record.dict === currentRowDetail.dict
    );
  }, [currentRowDetail, allRecords]);

  const nextRowDetail = useCallback(() => {
    if (!currentRowDetail) {
      return;
    }

    const index = currentIndex;
    if (index === -1) {
      return;
    }
    const nextIndex = index + 1;
    if (nextIndex >= allRecords.length) {
      return;
    }
    setCurrentRowDetail(allRecords[nextIndex]);
  }, [currentRowDetail, currentIndex, allRecords, setCurrentRowDetail]);

  const prevRowDetail = useCallback(() => {
    if (!currentRowDetail) {
      return;
    }

    const index = currentIndex;
    if (index === -1) {
      return;
    }
    const prevIndex = index - 1;
    if (prevIndex < 0) {
      return;
    }
    setCurrentRowDetail(allRecords[prevIndex]);
  }, [currentRowDetail, currentIndex, setCurrentRowDetail, allRecords]);

  useHotkeys(
    "left",
    (e) => {
      prevRowDetail();
      e.stopPropagation();
    },
    {
      preventDefault: true,
    }
  );

  useHotkeys(
    "right",
    (e) => {
      nextRowDetail();
      e.stopPropagation();
    },
    {
      preventDefault: true,
    }
  );

  return (
    <div className={`flex select-none items-center -gap-1 ${className}`}>
      <button
        className="d cursor-pointer rounded-full p-1 text-primary focus:outline-none"
        onClick={prevRowDetail}
        type="button"
      >
        <PrevIcon />
      </button>
      <span className="text-foreground text-sm">{`${currentIndex + 1} / ${allRecords.length}`}</span>
      <button
        className="cursor-pointer rounded-full p-1 text-primary focus:outline-none"
        onClick={nextRowDetail}
        type="button"
      >
        <NextIcon />
      </button>
    </div>
  );
};

export default RowPagination;
