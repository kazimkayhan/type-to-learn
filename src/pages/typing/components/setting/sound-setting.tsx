import { useAtom } from "jotai";
import { useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { keySoundResources } from "@/resources/sound-resource";
import {
  hintSoundsConfigAtom,
  keySoundsConfigAtom,
  pronunciationConfigAtom,
} from "@/store";
import type { SoundResource } from "@/typings";
import { toFixedNumber } from "@/utils";
import { playKeySoundResource } from "@/utils/sounds/key-sounds";
import IconEar from "~icons/tabler/ear";
import styles from "./index.module.css";

export default function SoundSetting() {
  const [pronunciationConfig, setPronunciationConfig] = useAtom(
    pronunciationConfigAtom
  );
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom);
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom);

  const onTogglePronunciation = useCallback(
    (checked: boolean) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setPronunciationConfig]
  );
  const onTogglePronunciationIsTransRead = useCallback(
    (checked: boolean) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        isTransRead: checked,
      }));
    },
    [setPronunciationConfig]
  );
  const onChangePronunciationVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        volume: value[0] / 100,
      }));
    },
    [setPronunciationConfig]
  );
  const onChangePronunciationIsTransVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        transVolume: value[0] / 100,
      }));
    },
    [setPronunciationConfig]
  );
  const onChangePronunciationRate = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        rate: value[0],
      }));
    },
    [setPronunciationConfig]
  );

  const onToggleKeySounds = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setKeySoundsConfig]
  );
  const onChangeKeySoundsVolume = useCallback(
    (value: number[]) => {
      setKeySoundsConfig((prev) => ({
        ...prev,
        volume: value[0] / 100,
      }));
    },
    [setKeySoundsConfig]
  );

  const onChangeKeySoundsResource = useCallback(
    (key: string) => {
      const soundResource = keySoundResources.find(
        (item: SoundResource) => item.key === key
      ) as SoundResource;
      if (!soundResource) {
        return;
      }

      setKeySoundsConfig((prev) => ({
        ...prev,
        resource: soundResource,
      }));
    },
    [setKeySoundsConfig]
  );

  const onPlayKeySound = useCallback((soundResource: SoundResource) => {
    playKeySoundResource(soundResource);
  }, []);

  const onToggleHintSounds = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setHintSoundsConfig]
  );
  const onChangeHintSoundsVolume = useCallback(
    (value: number[]) => {
      setHintSoundsConfig((prev) => ({
        ...prev,
        volume: value[0] / 100,
      }));
    },
    [setHintSoundsConfig]
  );

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Word pronunciation</span>
            <div className={styles.switchBlock}>
              <Switch
                checked={pronunciationConfig.isOpen}
                onCheckedChange={onTogglePronunciation}
              />
              <span className="text-right font-normal text-gray-600 text-xs leading-tight">{`Pronunciation ${
                pronunciationConfig.isOpen ? "on" : "off"
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  defaultValue={[pronunciationConfig.volume * 100]}
                  disabled={!pronunciationConfig.isOpen}
                  max={100}
                  onValueChange={onChangePronunciationVolume}
                  step={10}
                />
                <span className="ml-4 w-10 font-normal text-gray-600 text-xs">{`${Math.floor(pronunciationConfig.volume * 100)}%`}</span>
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>Speed</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  defaultValue={[pronunciationConfig.rate ?? 1]}
                  disabled={!pronunciationConfig.isOpen}
                  max={4}
                  min={0.5}
                  onValueChange={onChangePronunciationRate}
                  step={0.1}
                />
                <span className="ml-4 w-10 font-normal text-gray-600 text-xs">{`${toFixedNumber(pronunciationConfig.rate, 2)}`}</span>
              </div>
            </div>
          </div>
          {Boolean(window.speechSynthesis) && (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>
                Definition pronunciation
              </span>
              <div className={styles.switchBlock}>
                <Switch
                  checked={pronunciationConfig.isTransRead}
                  onCheckedChange={onTogglePronunciationIsTransRead}
                />
                <span className="text-right font-normal text-gray-600 text-xs leading-tight">{`Pronunciation ${
                  pronunciationConfig.isTransRead ? "on" : "off"
                }`}</span>
              </div>
              <div className={styles.block}>
                <span className={styles.blockLabel}>Volume</span>
                <div className="flex h-5 w-full items-center justify-between">
                  <Slider
                    className="slider"
                    defaultValue={[pronunciationConfig.transVolume * 100]}
                    max={100}
                    onValueChange={onChangePronunciationIsTransVolume}
                    step={10}
                  />
                  <span className="ml-4 w-10 font-normal text-gray-600 text-xs">{`${Math.floor(
                    pronunciationConfig.transVolume * 100
                  )}%`}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Key sounds</span>
            <div className={styles.switchBlock}>
              <Switch
                checked={keySoundsConfig.isOpen}
                onCheckedChange={onToggleKeySounds}
              />
              <span className="text-right font-normal text-gray-600 text-xs leading-tight">{`Key sounds ${
                keySoundsConfig.isOpen ? "on" : "off"
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  defaultValue={[keySoundsConfig.volume * 100]}
                  disabled={!keySoundsConfig.isOpen}
                  max={100}
                  min={1}
                  onValueChange={onChangeKeySoundsVolume}
                  step={10}
                />
                <span className="ml-4 w-10 font-normal text-gray-600 text-xs">{`${Math.floor(keySoundsConfig.volume * 100)}%`}</span>
              </div>
            </div>
            <div className={`${styles.block}`}>
              <span className={styles.blockLabel}>Key sound effect</span>
              <Select
                onValueChange={onChangeKeySoundsResource}
                value={keySoundsConfig.resource.key}
              >
                <SelectTrigger className="w-full max-w-60">
                  <SelectValue>{keySoundsConfig.resource.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {keySoundResources.map((keySoundResource) => (
                    <SelectItem
                      key={keySoundResource.key}
                      value={keySoundResource.key}
                    >
                      <div className="group flex w-full cursor-pointer items-center justify-between gap-2">
                        <span>{keySoundResource.name}</span>
                        <IconEar
                          className="cursor-pointer text-neutral-500 opacity-0 transition-opacity hover:text-indigo-400 group-hover:opacity-100 dark:text-neutral-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayKeySound(keySoundResource);
                          }}
                        />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Effect sounds</span>
            <div className={styles.switchBlock}>
              <Switch
                checked={hintSoundsConfig.isOpen}
                onCheckedChange={onToggleHintSounds}
              />
              <span className="text-right font-normal text-gray-600 text-xs leading-tight">{`Effect sounds ${
                hintSoundsConfig.isOpen ? "on" : "off"
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  defaultValue={[hintSoundsConfig.volume * 100]}
                  disabled={!hintSoundsConfig.isOpen}
                  max={100}
                  min={1}
                  onValueChange={onChangeHintSoundsVolume}
                  step={10}
                />
                <span className="ml-4 w-10 font-normal text-gray-600 text-xs">{`${Math.floor(hintSoundsConfig.volume * 100)}%`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar
        className="flex touch-none select-none bg-transparent"
        orientation="vertical"
      />
    </ScrollArea>
  );
}
