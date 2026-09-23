import type { FC } from "react";
import { useCallback } from "react";
import NextIcon from "~icons/ooui/next-ltr";
import PrevIcon from "~icons/ooui/next-rtl";

interface IPaginationProps {
  className?: string;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export const ITEM_PER_PAGE = 20;

const Pagination: FC<IPaginationProps> = ({
  className,
  page,
  setPage,
  totalPages,
}) => {
  const nextPage = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);

  const prevPage = useCallback(() => {
    setPage(page - 1);
  }, [page, setPage]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        aria-label="Previous page"
        className="cursor-pointer rounded-full bg-card p-2 text-primary shadow-md focus-visible:ring-2 focus-visible:ring-ring"
        onClick={prevPage}
        type="button"
      >
        <PrevIcon />
      </button>
      <span className="text-foreground tabular-nums">{`${page} / ${totalPages}`}</span>
      <button
        aria-label="Next page"
        className="cursor-pointer rounded-full bg-card p-2 text-primary shadow-md focus-visible:ring-2 focus-visible:ring-ring"
        onClick={nextPage}
        type="button"
      >
        <NextIcon />
      </button>
    </div>
  );
};

export default Pagination;
