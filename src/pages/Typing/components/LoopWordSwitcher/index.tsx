import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { loopWordConfigAtom } from '@/store'
import type { LoopWordTimesOption } from '@/typings'
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
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
