<<<<<<< HEAD
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { loopWordConfigAtom } from '@/store'
import type { LoopWordTimesOption } from '@/typings'
=======
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { loopWordConfigAtom } from '@/store'
import type { LoopWordTimesOption } from '@/typings'
import { Popover, Transition } from '@headlessui/react'
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
import { useAtom } from 'jotai'
import { useCallback, useState } from 'react'
import IconRepeat from '~icons/tabler/repeat'
import IconRepeatOff from '~icons/tabler/repeat-off'

const loopOptions: LoopWordTimesOption[] = [1, 3, 5, 8, Number.MAX_SAFE_INTEGER]
export default function LoopWordSwitcher() {
  const [{ times: loopTimes }, setLoopWordConfig] = useAtom(loopWordConfigAtom)
  const [isOpen, setIsOpen] = useState(false)

  const onChangeLoopTimes = useCallback(
    (value: number) => {
      setLoopWordConfig((old) => ({
        ...old,
        times: value,
      }))
    },
    [setLoopWordConfig],
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`p-[2px] ${
            loopTimes === 1 ? 'text-gray-500' : 'text-indigo-500'
          } rounded text-lg hover:bg-indigo-400 hover:text-white focus:outline-none`}
          type="button"
          aria-label="Select word loop count"
        >
          <div className="relative">
            {loopTimes === 1 ? (
              <IconRepeatOff />
            ) : (
              <>
                <IconRepeat />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] transform font-mono text-xs font-bold">
                  {loopTimes === Number.MAX_SAFE_INTEGER ? '' : loopTimes}
                </span>
              </>
            )}
          </div>
<<<<<<< HEAD
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4" align="center">
        <div className="flex select-none flex-col items-center justify-center gap-4">
          <div className="flex w-full  flex-col  items-start gap-2 py-0">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Select word loop count</span>
            <div className="flex w-full flex-row items-center justify-between">
              <RadioGroup
                className="flex w-full flex-col gap-2.5"
                value={loopTimes.toString()}
                onValueChange={(value) => onChangeLoopTimes(Number(value))}
              >
                {loopOptions.map((value, index) => (
                  <div className="flex w-full items-center gap-2" key={value}>
                    <RadioGroupItem value={value.toString()} id={`r${index}`} />
                    <Label
                      className="flex-1 cursor-pointer text-[15px] leading-none dark:text-white dark:text-opacity-60"
                      htmlFor={`r${index}`}
                    >
                      {value === Number.MAX_SAFE_INTEGER ? 'Unlimited' : value}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
=======
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel className="absolute left-1/2 z-10 mt-2 flex max-w-max -translate-x-1/2 px-4 ">
            <div className="shadow-upper box-border flex w-60 select-none flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 drop-shadow dark:bg-gray-800">
              <div className="flex w-full  flex-col  items-start gap-2 py-0">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
                  Select word loop count
                </span>
                <div className="flex w-full flex-row items-center justify-between">
                  <RadioGroup
                    className="flex w-full flex-col gap-2.5"
                    defaultValue={loopTimes.toString()}
                    aria-label="Select word loop count"
                  >
                    {loopOptions.map((value, index) => (
                      <div className="flex w-full items-center" key={value}>
                        <RadioGroupItem
                          className="h-[25px] w-[25px] cursor-pointer rounded-full bg-white shadow-[0_2px_10px] shadow-gray-300 outline-none hover:bg-indigo-100"
                          value={value.toString()}
                          onClick={() => onChangeLoopTimes(value)}
                          id={`r${index}`}
                        />
                        <label
                          className="flex-1 cursor-pointer pl-[15px] text-[15px] leading-none dark:text-white dark:text-opacity-60"
                          htmlFor={`r${index}`}
                          onClick={() => onChangeLoopTimes(value)}
                        >
                          {value === Number.MAX_SAFE_INTEGER ? 'Unlimited' : value}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
