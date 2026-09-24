import type { ReactNode } from "react";
import { useCallback, useId, useState } from "react";
import { classNames } from "@/utils";

const Tooltip = ({
  children,
  content,
  className,
  placement = "top",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  const handleBlur = useCallback(() => setVisible(false), []);
  const handleMouseEnter = useCallback(() => setVisible(true), []);
  const handleMouseLeave = useCallback(() => setVisible(false), []);

  const placementClasses = {
    bottom: "top-full pt-2",
    top: "bottom-full pb-2",
  }[placement];

  return (
    <div
      className={classNames(
        "relative inline-flex items-center justify-center",
        className
      )}
    >
      <div
        aria-describedby={tooltipId}
        className="inline-flex items-center justify-center"
        onBlur={handleBlur}
        onFocus={handleMouseEnter}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      <div
        aria-hidden={!visible}
        className={`${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        } ${placementClasses} pointer-events-none absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center transition-opacity`}
        id={tooltipId}
        role="tooltip"
      >
        <span className="tooltip">{content}</span>
      </div>
    </div>
  );
};

interface TooltipProps {
  children: ReactNode;
  className?: string;
  content: string;
  placement?: "top" | "bottom";
}

export default Tooltip;
