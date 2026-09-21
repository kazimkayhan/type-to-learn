import type { FC } from "react";
import { LoadingUI } from "@/components/Loading";
import ErrorIcon from "~icons/ic/outline-error";

type LoadingWordUIProps = {
  className?: string;
  isLoading: boolean;
  hasError: boolean;
};

export const LoadingWordUI: FC<LoadingWordUIProps> = ({
  className,
  isLoading,
  hasError,
}) => (
  <div className={`${className}`}>
    {hasError ? (
      <div className="tooltip !bg-transparent" data-tip="Failed to load data">
        <ErrorIcon className="text-red-500" />
      </div>
    ) : (
      isLoading && <LoadingUI />
    )}
  </div>
);
