import { useState } from "react";
import standTypingHandPosition from "@/assets/standard_typing_hand_position.png";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import IconKeyboard from "~icons/ic/round-keyboard";

export default function HandPositionIllustration() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        aria-label="Show typing hand position guide"
        className={`nav-icon-btn ${
          isOpen ? "bg-primary text-primary-foreground" : ""
        }`}
      >
        <IconKeyboard className="icon" />
      </DialogTrigger>

      <DialogContent
        className="w-[min(50rem,calc(100vw-1.5rem))] rounded-2xl bg-card p-4 sm:p-6"
        showCloseButton={true}
      >
        <DialogTitle className="pr-8 text-center font-medium text-foreground text-lg leading-6 sm:text-xl">
          Recommended typing hand position guide
        </DialogTitle>
        <div className="mt-8">
          <img
            alt="Recommended typing hand position"
            className="block h-auto w-full"
            src={standTypingHandPosition}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
