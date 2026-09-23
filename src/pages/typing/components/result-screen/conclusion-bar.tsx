import classNames from "classnames";
import type { ElementType, SVGAttributes } from "react";
import IconExclamationTriangle from "~icons/heroicons/exclamation-triangle-solid";
import IconHandThumbUp from "~icons/heroicons/hand-thumb-up-solid";
import IconHeart from "~icons/heroicons/heart-solid";

interface IconMapper {
  className: string;
  icon: ElementType<SVGAttributes<SVGSVGElement>>;
  text: (mistakeCount: number) => string;
}

const ICON_MAPPER: IconMapper[] = [
  {
    className: "text-primary",
    icon: IconHeart,
    text: (mistakeCount: number) =>
      "Great job!" +
      (mistakeCount > 0
        ? ` Only ${mistakeCount} word${mistakeCount > 1 ? "s" : ""} wrong`
        : " Perfect score!"),
  },
  {
    className: "text-primary",
    icon: IconHandThumbUp,
    text: () => "Not bad — you can do even better next time!",
  },
  {
    className: "text-primary",
    icon: IconExclamationTriangle,
    text: () => "Too many mistakes — want to try again?",
  },
];

const ConclusionBar = ({ mistakeLevel, mistakeCount }: ConclusionBarProps) => {
  const { icon: Icon, className, text } = ICON_MAPPER[mistakeLevel];

  return (
    <div className="flex h-auto min-h-10 flex-row items-center py-1 sm:h-10">
      <Icon className={classNames(className, "h-5 w-5 shrink-0")} />
      <span className="ml-2 inline-block align-middle font-medium text-accent-foreground text-sm leading-5 sm:leading-10 md:text-base">
        {text(mistakeCount)}
      </span>
    </div>
  );
};

interface ConclusionBarProps {
  mistakeCount: number;
  mistakeLevel: number;
}

export default ConclusionBar;
