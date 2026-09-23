import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import {
  VolumeHighIcon,
  VolumeIcon,
  VolumeLowIcon,
  VolumeMediumIcon,
} from "./volume-icon";

const volumeIcons = [
  VolumeIcon,
  VolumeLowIcon,
  VolumeMediumIcon,
  VolumeHighIcon,
];

export const SoundIcon = ({
  duration = 500,
  animated = false,
  onClick,
  iconClassName,
  className,
  disabled = false,
}: SoundIconProps) => {
  const [animationFrameIndex, setAnimationFrameIndex] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const index = animated
        ? animationFrameIndex < volumeIcons.length - 1
          ? animationFrameIndex + 1
          : 0
        : 0;

      setAnimationFrameIndex(index);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, animationFrameIndex, duration]);

  const Icon = volumeIcons[animationFrameIndex];

  return (
    <button
      aria-disabled={disabled}
      aria-label="Play pronunciation"
      className={`fill-muted-foreground focus:outline-none ${className}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon className={iconClassName} />
    </button>
  );
};

export interface SoundIconProps {
  animated?: boolean;
  className?: string;
  disabled?: boolean;
  duration?: number;
  iconClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
