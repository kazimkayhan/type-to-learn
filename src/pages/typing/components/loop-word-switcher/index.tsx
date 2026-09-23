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
        className={`nav-icon-btn ${
          loopTimes === 1 ? "text-muted-foreground" : "text-primary"
        }`}
        type="button"
      >
        <div className="relative inline-flex size-5 items-center justify-center">
          {loopTimes === 1 ? (
            <IconRepeatOff className="icon" />
          ) : (
            <>
              <IconRepeat className="icon" />
              <span className="absolute inset-0 flex items-center justify-center font-bold font-mono text-[0.65rem] leading-none">
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
