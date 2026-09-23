import { useCallback } from "react";

interface Props {
  currentTag: string;
  onChangeCurrentTag: (tag: string) => void;
  tagList: string[];
}

export default function DictTagSwitcher({
  tagList,
  currentTag,
  onChangeCurrentTag,
}: Props) {
  const onChangeTag = useCallback(
    (tag: string) => {
      onChangeCurrentTag(tag);
    },
    [onChangeCurrentTag]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tagList.map((option) => (
        <button
          aria-pressed={currentTag === option}
          className={`min-h-10 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-sm sm:min-h-0 sm:px-4 sm:py-2 sm:text-base ${
            currentTag === option
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground"
          } ${currentTag !== option && "hover:bg-accent"}`}
          key={option}
          onClick={() => onChangeTag(option)}
          type="button"
        >
          <p className="font-normal">{option}</p>
        </button>
      ))}
    </div>
  );
}
