import type { FC } from "react";
import { LoadingUI } from "@/components/loading";
import ErrorIcon from "~icons/ic/outline-error";

interface LoadingWordUIProps {
  className?: string;
  hasError: boolean;
  isLoading: boolean;
}

export const LoadingWordUI: FC<LoadingWordUIProps> = ({
  className,
  isLoading,
  hasError,
}) => (
  <div className={`${className}`}>
    {hasError ? (
      <div className="tooltip !bg-transparent" data-tip="Failed to load data">
        <ErrorIcon className="text-destructive" />
      </div>
    ) : (
      isLoading && <LoadingUI />
    )}
  </div>
);
