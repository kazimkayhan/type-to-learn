import standTypingHandPosition from '@/assets/standard_typing_hand_position.png'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState } from 'react'
import IconKeyboard from '~icons/ic/round-keyboard'

export default function HandPositionIllustration() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className={`flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white ${
          isOpen && 'bg-indigo-500 text-white'
        }`}
      >
        <IconKeyboard className="icon" />
      </DialogTrigger>

      <DialogContent className="w-[min(50rem,calc(100vw-1.5rem))] rounded-2xl bg-white p-4 dark:bg-gray-800 sm:p-6" showCloseButton={true}>
        <DialogTitle className="pr-8 text-center text-lg font-medium leading-6 text-gray-800 dark:text-gray-200 sm:text-xl">
          Recommended typing hand position guide
        </DialogTitle>
        <div className="mt-8">
          <img className="block h-auto w-full" src={standTypingHandPosition} alt="Recommended typing hand position" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
