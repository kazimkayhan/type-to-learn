import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { loopWordConfigAtom } from "@/store";
import type { LoopWordTimesOption } from "@/typings";
import IconRepeat from "~icons/tabler/repeat";
import IconRepeatOff from "~icons/tabler/repeat-off";

const loopOptions: LoopWordTimesOption[] = [
  1,
  3,
  5,
  8,
  Number.MAX_SAFE_INTEGER,
];

export default function LoopWordSwitcher() {
  const [{ times: loopTimes }, setLoopWordConfig] = useAtom(loopWordConfigAtom);

  const onChangeLoopTimes = useCallback(
    (value: number) => {
      setLoopWordConfig((old) => ({
        ...old,
        times: value,
      }));
    },
    [setLoopWordConfig]
  );

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Select word loop count"
        className={`p-[2px] ${
          loopTimes === 1 ? "text-muted-foreground" : "text-primary"
        } rounded text-lg hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring`}
        type="button"
      >
        <div className="relative">
          {loopTimes === 1 ? (
            <IconRepeatOff />
          ) : (
            <>
              <IconRepeat />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] transform font-bold font-mono text-xs">
                {loopTimes === Number.MAX_SAFE_INTEGER ? "" : loopTimes}
              </span>
            </>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-2">
          <span className="font-normal text-foreground text-sm leading-5">
            Select word loop count
          </span>
          <RadioGroup
            aria-label="Select word loop count"
            className="flex flex-col gap-2.5"
            onValueChange={(val) => onChangeLoopTimes(Number.parseInt(val, 10))}
            value={loopTimes.toString()}
          >
            {loopOptions.map((value, index) => (
              <div className="flex items-center gap-3" key={value}>
                <RadioGroupItem
                  className="cursor-pointer hover:border-primary hover:ring-2 hover:ring-primary/20"
                  id={`r${index}`}
                  value={value.toString()}
                />
                <label
                  className="flex-1 cursor-pointer text-foreground text-sm leading-none"
                  htmlFor={`r${index}`}
                >
                  {value === Number.MAX_SAFE_INTEGER ? "Unlimited" : value}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
