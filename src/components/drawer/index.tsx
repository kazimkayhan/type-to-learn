import classNames from "classnames";
import { useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type Placement = "left" | "top" | "right" | "bottom";

interface DrawerProps {
  children?: React.ReactNode;
  classNames?: string;
  onClose?: () => void;
  open?: boolean;
  placement?: Placement;
}

export default function Drawer(props: DrawerProps) {
  const { open = false, placement = "left", onClose, children } = props;

  const sideMap: Record<Placement, "left" | "right" | "top" | "bottom"> = {
    bottom: "bottom",
    left: "left",
    right: "right",
    top: "top",
  };

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && onClose) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <Sheet onOpenChange={handleOpenChange} open={open}>
      <SheetContent
        className={classNames(
          props.classNames || "",
          "flex h-full w-full max-w-full flex-col overflow-hidden sm:w-[35rem] sm:max-w-sm"
        )}
        side={sideMap[placement]}
      >
        {children}
      </SheetContent>
    </Sheet>
  );
}
