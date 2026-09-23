import classNames from "classnames";
import type { FC } from "react";
import { useCallback } from "react";
import DownIcon from "~icons/fa/sort-down";
import UPIcon from "~icons/fa/sort-up";

interface IHeadWrongNumberProps {
  className?: string;
  setSortType: (sortType: ISortType) => void;
  sortType: ISortType;
}

export type ISortType = "asc" | "desc" | "none";

const HeadWrongNumber: FC<IHeadWrongNumberProps> = ({
  className,
  sortType,
  setSortType,
}) => {
  const onClick = useCallback(() => {
    const sortTypes: Record<ISortType, ISortType> = {
      asc: "desc",
      desc: "none",
      none: "asc",
    };
    setSortType(sortTypes[sortType]);
  }, [setSortType, sortType]);

  return (
    <button
      className={`relative cursor-pointer pr-4 text-left ${className ?? ""}`}
      onClick={onClick}
      type="button"
    >
      Mistakes
      <span className="absolute top-0 right-0 bottom-0 flex flex-col items-center justify-center text-[12px]">
        <UPIcon
          className={classNames("-mb-2", {
            "text-muted-foreground": sortType !== "asc",
            "text-primary": sortType === "asc",
          })}
        />
        <DownIcon
          className={classNames({
            "text-muted-foreground": sortType !== "desc",
            "text-primary": sortType === "desc",
          })}
        />
      </span>
    </button>
  );
};

export default HeadWrongNumber;
