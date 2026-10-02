import classNames from "classnames";
import type React from "react";
import type { ElementType, SVGProps } from "react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InfoPanelProps {
  buttonClassName: string;
  children: React.ReactNode;
  icon: ElementType<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  onClose: () => void;
  openState: boolean;
  title: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  openState,
  title,
  onClose,
  icon: Icon,
  iconClassName,
  buttonClassName,
  children,
}) => {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Dialog onOpenChange={handleOpenChange} open={openState}>
      <DialogContent
        className="max-h-[90dvh] overflow-y-auto sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="sm:flex sm:flex-row sm:items-start sm:gap-4 sm:text-left">
          <div
            className={classNames(
              iconClassName,
              "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
            )}
          >
            <Icon className="h-6 w-6 stroke-current" />
          </div>
          <DialogTitle className="mt-3 text-center font-semibold text-base text-foreground leading-6 sm:mt-0 sm:text-left">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 text-muted-foreground text-sm">{children}</div>
        <DialogFooter className="bg-muted sm:flex sm:flex-row-reverse">
          <Button
            className={classNames(
              buttonClassName,
              "mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
            )}
            onClick={onClose}
            type="button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfoPanel;
