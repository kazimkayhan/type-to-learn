import classNames from "classnames";
import type React from "react";
import type { ElementType, SVGProps } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type InfoPanelProps = {
  openState: boolean;
  onClose: () => void;
  title: string;
  icon: ElementType<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  buttonClassName: string;
  children: React.ReactNode;
};

const InfoPanel: React.FC<InfoPanelProps> = ({
  openState,
  title,
  onClose,
  icon: Icon,
  iconClassName,
  buttonClassName,
  children,
}) => (
  <Dialog onOpenChange={(open) => !open && onClose()} open={openState}>
    <DialogContent
      className="max-h-[90dvh] overflow-y-auto sm:max-w-lg"
      showCloseButton={false}
    >
      <DialogHeader className="sm:flex sm:flex-row sm:items-start sm:gap-4 sm:text-left">
        <div
          className={classNames(
            iconClassName,
            "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 dark:bg-opacity-30"
          )}
        >
          <Icon className="h-6 w-6 stroke-current dark:bg-opacity-100" />
        </div>
        <DialogTitle className="mt-3 text-center font-semibold text-base text-gray-900 leading-6 sm:mt-0 sm:text-left dark:text-white">
          {title}
        </DialogTitle>
      </DialogHeader>
      <DialogDescription asChild>
        <div className="mt-2">{children}</div>
      </DialogDescription>
      <DialogFooter className="bg-gray-50 sm:flex sm:flex-row-reverse dark:bg-gray-700">
        <button
          className={classNames(buttonClassName, "my-btn-info-panel")}
          onClick={() => onClose()}
          type="button"
        >
          Close
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default InfoPanel;
