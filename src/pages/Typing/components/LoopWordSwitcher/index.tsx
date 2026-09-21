import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { loopWordConfigAtom } from '@/store'
import type { LoopWordTimesOption } from '@/typings'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import IconRepeat from '~icons/tabler/repeat'
import IconRepeatOff from '~icons/tabler/repeat-off'

const loopOptions: LoopWordTimesOption[] = [1, 3, 5, 8, Number.MAX_SAFE_INTEGER]

export default function LoopWordSwitcher() {
  const [{ times: loopTimes }, setLoopWordConfig] = useAtom(loopWordConfigAtom)

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
    <Popover>
      <PopoverTrigger
        className={`p-[2px] ${
          loopTimes === 1 ? 'text-gray-500' : 'text-indigo-500'
        } rounded text-lg hover:bg-indigo-400 hover:text-white focus:outline-none`}
        type="button"
        onClick={(e) => {
          e.currentTarget.blur()
        }}
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
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Select word loop count</span>
          <RadioGroup
            className="flex flex-col gap-2.5"
            value={loopTimes.toString()}
            onValueChange={(val) => onChangeLoopTimes(parseInt(val, 10))}
            aria-label="Select word loop count"
          >
            {loopOptions.map((value, index) => (
              <div className="flex items-center gap-3" key={value}>
                <RadioGroupItem
                  className="cursor-pointer hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 dark:hover:border-indigo-500 dark:hover:ring-indigo-900/50"
                  value={value.toString()}
                  id={`r${index}`}
                />
                <label
                  className="flex-1 cursor-pointer text-sm leading-none text-gray-900 dark:text-white dark:text-opacity-80"
                  htmlFor={`r${index}`}
                >
                  {value === Number.MAX_SAFE_INTEGER ? 'Unlimited' : value}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}
