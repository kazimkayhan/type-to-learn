import classNames from "classnames";
import { useMemo } from "react";
import clamp from "@/utils/clamp";

export interface RemarkRingProps {
  caption: string;
  /**
   * `null` if the percentage is not appliable.
   * Otherwise, this is an integer between 0 and 100.
   */
  percentage?: number | null;
  remark: string;
  /**
   * Default to 7 rem.
   */
  size?: number;
}

const rootFontSize = Number.parseInt(
  window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("font-size"),
  10
);

export default function RemarkRing({
  remark,
  caption,
  percentage = null,
  size = 7,
}: RemarkRingProps) {
  const clipPath = useMemo((): string | undefined => {
    if (percentage === null) {
      return undefined;
    }
    const clamped = clamp(percentage, 0, 100);
    if (clamped === 100) {
      return undefined;
    }
    const alpha = Math.PI * 2 * (clamped / 100);
    const r = (rootFontSize * size) / 2;
    const path = `M ${r},0 A ${r},${r} 0 ${clamped > 50 ? 1 : 0},1 ${r + Math.sin(alpha) * r},${r + -Math.cos(alpha) * r} L ${r},${r} Z`;
    return `path("${path}")`;
  }, [percentage, size]);
  return (
    <div
      className={classNames(
        "relative flex flex-shrink-0 flex-col items-center justify-center rounded-full border-8 border-muted bg-transparent"
      )}
      style={{
        height: `${size}rem`,
        width: `${size}rem`,
      }}
    >
      {percentage !== null && (
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full border-8 border-primary bg-transparent"
          style={{ clipPath }}
        />
      )}
      <span className="text-foreground text-xl tabular-nums">{remark}</span>
      <span className="font-medium text-muted-foreground text-sm">
        {caption}
      </span>
    </div>
  );
}
