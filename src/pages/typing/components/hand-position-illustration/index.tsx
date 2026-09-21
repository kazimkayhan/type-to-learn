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
        className={`flex items-center justify-center rounded p-[2px] text-indigo-500 text-lg outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white ${
          isOpen && "bg-indigo-500 text-white"
        }`}
      >
        <IconKeyboard className="icon" />
      </DialogTrigger>

      <DialogContent
        className="w-[min(50rem,calc(100vw-1.5rem))] rounded-2xl bg-white p-4 sm:p-6 dark:bg-gray-800"
        showCloseButton={true}
      >
        <DialogTitle className="pr-8 text-center font-medium text-gray-800 text-lg leading-6 sm:text-xl dark:text-gray-200">
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
