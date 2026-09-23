import { useAtom } from "jotai";
import { useLayoutEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { wordDictationConfigAtom } from "@/store";
import type { WordDictationType } from "@/typings";
import IconEyeSlash from "~icons/heroicons/eye-slash-solid";
import IconEye from "~icons/heroicons/eye-solid";

const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  { name: "Hide all", type: "hideAll" },
  { name: "Hide vowels", type: "hideVowel" },
  { name: "Hide consonants", type: "hideConsonant" },
  { name: "Random hide", type: "randomHide" },
];

export default function WordDictationSwitcher() {
  const [wordDictationConfig, setWordDictationConfig] = useAtom(
    wordDictationConfigAtom
  );
  const [currentType, setCurrentType] = useState(wordDictationTypeList[0]);

  const onToggleWordDictation = () => {
    setWordDictationConfig((old) => {
      if (old.isOpen) {
        return { ...old, isOpen: !old.isOpen };
      }
      return { ...old, isOpen: !old.isOpen, openBy: "user" };
    });
  };

  const onChangeWordDictationType = (value: WordDictationType) => {
    setWordDictationConfig((old) => ({ ...old, type: value }));
  };

  useLayoutEffect(() => {
    setCurrentType(
      wordDictationTypeList.find(
        (item) => item.type === wordDictationConfig.type
      ) || wordDictationTypeList[0]
    );
  }, [wordDictationConfig.type]);

  useHotkeys(
    "ctrl+v",
    () => {
      onToggleWordDictation();
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Toggle dictation mode"
        className={`nav-icon-btn ${
          wordDictationConfig.isOpen ? "text-primary" : "text-muted-foreground"
        }`}
        type="button"
      >
        {wordDictationConfig.isOpen ? (
          <IconEye className="icon" />
        ) : (
          <IconEyeSlash className="icon" />
        )}
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-normal text-foreground text-sm leading-5">
              Toggle dictation mode
            </span>
            <div className="flex flex-row items-center justify-between">
              <Switch
                checked={wordDictationConfig.isOpen}
                onCheckedChange={onToggleWordDictation}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Dictation ${wordDictationConfig.isOpen ? "on" : "off"}`}</span>
            </div>
          </div>

          {Boolean(wordDictationConfig.isOpen) && (
            <div className="flex flex-col gap-2">
              <span className="font-normal text-foreground text-sm leading-5">
                Dictation mode
              </span>
              <Select
                onValueChange={onChangeWordDictationType}
                value={currentType.type}
              >
                <SelectTrigger>
                  <SelectValue>{currentType.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {wordDictationTypeList.map((item) => (
                    <SelectItem key={item.name} value={item.type}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <span className="font-medium text-muted-foreground text-xs">
            Tips: Toggle dictation shortcut (Ctrl + V)
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
