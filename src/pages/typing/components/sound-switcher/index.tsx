import { useAtom } from "jotai";
import { useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { hintSoundsConfigAtom, keySoundsConfigAtom } from "@/store";
import IconSpeakerWave from "~icons/heroicons/speaker-wave-solid";

export default function SoundSwitcher() {
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom);
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom);

  const onChangeKeySound = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((old) => ({ ...old, isOpen: checked }));
    },
    [setKeySoundsConfig]
  );

  const onChangeHintSound = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((old) => ({ ...old, isOpen: checked }));
    },
    [setHintSoundsConfig]
  );

  return (
    <Popover>
      <PopoverTrigger
        aria-label="Sound settings"
        className="nav-icon-btn"
        title="Sound settings"
      >
        <IconSpeakerWave className="icon" />
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-normal text-foreground text-sm leading-5">
              Toggle key sounds
            </span>
            <div className="flex flex-row items-center justify-between">
              <Switch
                checked={keySoundsConfig.isOpen}
                onCheckedChange={onChangeKeySound}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Key sounds ${keySoundsConfig.isOpen ? "on" : "off"}`}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-normal text-foreground text-sm leading-5">
              Toggle effect sounds
            </span>
            <div className="flex flex-row items-center justify-between">
              <Switch
                checked={hintSoundsConfig.isOpen}
                onCheckedChange={onChangeHintSound}
              />
              <span className="text-right font-normal text-muted-foreground text-xs leading-tight">{`Effect sounds ${hintSoundsConfig.isOpen ? "on" : "off"}`}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
