import type { ReactNode } from "react";
import { useState } from "react";
import { classNames } from "@/utils";

const Tooltip = ({
  children,
  content,
  className,
  placement = "top",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const placementClasses = {
    bottom: "top-full pt-2",
    top: "bottom-full pb-2",
  }[placement];

  return (
    <div className={classNames("relative", className)}>
      <div
        onBlur={() => setVisible(false)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      <div
        className={`${
          visible ? "opacity-100" : "opacity-0"
        } ${placementClasses} pointer-events-none absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center transition-opacity`}
      >
        <span className="tooltip">{content}</span>
      </div>
    </div>
  );
};

type TooltipProps = {
  children: ReactNode;
  /** 显示文本 */
  content: string;
  /** 位置 */
  placement?: "top" | "bottom";
  className?: string;
};

export default Tooltip;
