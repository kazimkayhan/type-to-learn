import type { FC } from "react";
import { useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PhWarning from "~icons/ph/warning";

export interface ITipAlert {
  className?: string;
  setShow: (show: boolean) => void;
  show: boolean;
}

export const TipAlert: FC<ITipAlert> = ({ className, show, setShow }) => {
  const onClose = useCallback(() => {
    setShow(false);
  }, [setShow]);

  return (
    <>
      {Boolean(show) && (
        <div
          className={`alert z-10 w-fit cursor-pointer pr-5 ${className}`}
          onClick={onClose}
        >
          <Alert className="relative" variant="destructive">
            <PhWarning className="h-4 w-4" />
            <AlertTitle>Extension conflict!</AlertTitle>
            <AlertDescription>
              If input fails repeatedly, a browser extension may be interfering.
              Try disabling related extensions or switching browsers.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};
