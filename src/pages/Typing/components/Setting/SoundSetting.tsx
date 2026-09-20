import styles from './index.module.css'
<<<<<<< HEAD
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
=======
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
import { keySoundResources } from '@/resources/soundResource'
import { hintSoundsConfigAtom, keySoundsConfigAtom, pronunciationConfigAtom } from '@/store'
import type { SoundResource } from '@/typings'
import { toFixedNumber } from '@/utils'
import { playKeySoundResource } from '@/utils/sounds/keySounds'
<<<<<<< HEAD
=======
import { Listbox, Switch, Transition } from '@headlessui/react'
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import IconEar from '~icons/tabler/ear'

export default function SoundSetting() {
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom)
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom)

  const onTogglePronunciation = useCallback(
    (checked: boolean) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setPronunciationConfig],
  )
  const onTogglePronunciationIsTransRead = useCallback(
    (checked: boolean) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        isTransRead: checked,
      }))
    },
    [setPronunciationConfig],
  )
  const onChangePronunciationVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        volume: value[0] / 100,
      }))
    },
    [setPronunciationConfig],
  )
  const onChangePronunciationIsTransVolume = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        transVolume: value[0] / 100,
      }))
    },
    [setPronunciationConfig],
  )
  const onChangePronunciationRate = useCallback(
    (value: number[]) => {
      setPronunciationConfig((prev) => ({
        ...prev,
        rate: value[0],
      }))
    },
    [setPronunciationConfig],
  )

  const onToggleKeySounds = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setKeySoundsConfig],
  )
  const onChangeKeySoundsVolume = useCallback(
    (value: number[]) => {
      setKeySoundsConfig((prev) => ({
        ...prev,
        volume: value[0] / 100,
      }))
    },
    [setKeySoundsConfig],
  )

  const onChangeKeySoundsResource = useCallback(
    (key: string) => {
      const soundResource = keySoundResources.find((item: SoundResource) => item.key === key) as SoundResource
      if (!soundResource) return

      setKeySoundsConfig((prev) => ({
        ...prev,
        resource: soundResource,
      }))
    },
    [setKeySoundsConfig],
  )

  const onPlayKeySound = useCallback((soundResource: SoundResource) => {
    playKeySoundResource(soundResource)
  }, [])

  const onToggleHintSounds = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setHintSoundsConfig],
  )
  const onChangeHintSoundsVolume = useCallback(
    (value: number[]) => {
      setHintSoundsConfig((prev) => ({
        ...prev,
        volume: value[0] / 100,
      }))
    },
    [setHintSoundsConfig],
  )

  return (
<<<<<<< HEAD
    <ScrollArea className="h-full w-full flex-1 select-none overflow-y-auto px-3">
      <div className={styles.tabContent}>
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Word pronunciation</span>
          <div className={styles.switchBlock}>
            <Switch checked={pronunciationConfig.isOpen} onCheckedChange={onTogglePronunciation} />
            <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${
              pronunciationConfig.isOpen ? 'on' : 'off'
            }`}</span>
          </div>
          <div className={styles.block}>
            <span className={styles.blockLabel}>Volume</span>
            <div className="flex h-5 w-full items-center justify-between">
              <Slider
                defaultValue={[pronunciationConfig.volume * 100]}
                max={100}
                step={10}
                onValueChange={onChangePronunciationVolume}
                disabled={!pronunciationConfig.isOpen}
                className="flex-1"
              />
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(pronunciationConfig.volume * 100)}%`}</span>
            </div>
          </div>

          <div className={styles.block}>
            <span className={styles.blockLabel}>Speed</span>
            <div className="flex h-5 w-full items-center justify-between">
              <Slider
                defaultValue={[pronunciationConfig.rate ?? 1]}
                max={4}
                min={0.5}
                step={0.1}
                onValueChange={onChangePronunciationRate}
                disabled={!pronunciationConfig.isOpen}
                className="flex-1"
              />
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${toFixedNumber(pronunciationConfig.rate, 2)}`}</span>
            </div>
          </div>
        </div>
        {window.speechSynthesis && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Definition pronunciation</span>
            <div className={styles.switchBlock}>
              <Switch checked={pronunciationConfig.isTransRead} onCheckedChange={onTogglePronunciationIsTransRead} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${
                pronunciationConfig.isTransRead ? 'on' : 'off'
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  defaultValue={[pronunciationConfig.transVolume * 100]}
                  max={100}
                  step={10}
                  onValueChange={onChangePronunciationIsTransVolume}
                  className="flex-1"
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(
                  pronunciationConfig.transVolume * 100,
                )}%`}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Key sounds</span>
          <div className={styles.switchBlock}>
            <Switch checked={keySoundsConfig.isOpen} onCheckedChange={onToggleKeySounds} />
            <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Key sounds ${
              keySoundsConfig.isOpen ? 'on' : 'off'
            }`}</span>
          </div>
          <div className={styles.block}>
            <span className={styles.blockLabel}>Volume</span>
            <div className="flex h-5 w-full items-center justify-between">
              <Slider
                defaultValue={[keySoundsConfig.volume * 100]}
                max={100}
                min={1}
                step={10}
                onValueChange={onChangeKeySoundsVolume}
                disabled={!keySoundsConfig.isOpen}
                className="flex-1"
              />
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(keySoundsConfig.volume * 100)}%`}</span>
            </div>
          </div>
          <div className={`${styles.block}`}>
            <span className={styles.blockLabel}>Key sound effect</span>
            <Select value={keySoundsConfig.resource.key} onValueChange={onChangeKeySoundsResource}>
              <SelectTrigger className="w-full max-w-60">
                <SelectValue>{keySoundsConfig.resource.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {keySoundResources.map((keySoundResource) => (
                  <SelectItem key={keySoundResource.key} value={keySoundResource.key}>
                    <div className="flex items-center justify-between gap-2">
                      <span>{keySoundResource.name}</span>
                      <IconEar
                        onClick={(e) => {
                          e.stopPropagation()
                          onPlayKeySound(keySoundResource)
                        }}
                        className="cursor-pointer text-neutral-500 hover:text-indigo-400 dark:text-neutral-300"
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
            <Switch checked={hintSoundsConfig.isOpen} onCheckedChange={onToggleHintSounds} />
            <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Effect sounds ${
              hintSoundsConfig.isOpen ? 'on' : 'off'
            }`}</span>
          </div>
          <div className={styles.block}>
            <span className={styles.blockLabel}>Volume</span>
            <div className="flex h-5 w-full items-center justify-between">
              <Slider
                defaultValue={[hintSoundsConfig.volume * 100]}
                max={100}
                min={1}
                step={10}
                onValueChange={onChangeHintSoundsVolume}
                disabled={!hintSoundsConfig.isOpen}
                className="flex-1"
              />
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(hintSoundsConfig.volume * 100)}%`}</span>
            </div>
          </div>
        </div>
      </div>
=======
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Word pronunciation</span>
            <div className={styles.switchBlock}>
              <Switch checked={pronunciationConfig.isOpen} onChange={onTogglePronunciation} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${
                pronunciationConfig.isOpen ? 'on' : 'off'
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  defaultValue={[pronunciationConfig.volume * 100]}
                  max={100}
                  step={10}
                  className="slider"
                  onValueChange={onChangePronunciationVolume}
                  disabled={!pronunciationConfig.isOpen}
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(pronunciationConfig.volume * 100)}%`}</span>
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>Speed</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  defaultValue={[pronunciationConfig.rate ?? 1]}
                  max={4}
                  min={0.5}
                  step={0.1}
                  className="slider"
                  onValueChange={onChangePronunciationRate}
                  disabled={!pronunciationConfig.isOpen}
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${toFixedNumber(pronunciationConfig.rate, 2)}`}</span>
              </div>
            </div>
          </div>
          {window.speechSynthesis && (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Definition pronunciation</span>
              <div className={styles.switchBlock}>
                <Switch checked={pronunciationConfig.isTransRead} onChange={onTogglePronunciationIsTransRead} className="switch-root">
                  <span aria-hidden="true" className="switch-thumb" />
                </Switch>
                <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${
                  pronunciationConfig.isTransRead ? 'on' : 'off'
                }`}</span>
              </div>
              <div className={styles.block}>
                <span className={styles.blockLabel}>Volume</span>
                <div className="flex h-5 w-full items-center justify-between">
                  <Slider
                    defaultValue={[pronunciationConfig.transVolume * 100]}
                    max={100}
                    step={10}
                    className="slider"
                    onValueChange={onChangePronunciationIsTransVolume}
                  />
                  <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(
                    pronunciationConfig.transVolume * 100,
                  )}%`}</span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Key sounds</span>
            <div className={styles.switchBlock}>
              <Switch checked={keySoundsConfig.isOpen} onChange={onToggleKeySounds} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Key sounds ${
                keySoundsConfig.isOpen ? 'on' : 'off'
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  defaultValue={[keySoundsConfig.volume * 100]}
                  max={100}
                  min={1}
                  step={10}
                  className="slider"
                  onValueChange={onChangeKeySoundsVolume}
                  disabled={!keySoundsConfig.isOpen}
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(keySoundsConfig.volume * 100)}%`}</span>
              </div>
            </div>
            <div className={`${styles.block}`}>
              <span className={styles.blockLabel}>Key sound effect</span>
              <Listbox value={keySoundsConfig.resource.key} onChange={onChangeKeySoundsResource}>
                <div className="relative">
                  <Listbox.Button className="listbox-button w-full max-w-60">
                    <span>{keySoundsConfig.resource.name}</span>
                    <span>
                      <IconChevronDown className="focus:outline-none" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="listbox-options z-10">
                      {keySoundResources.map((keySoundResource) => (
                        <Listbox.Option key={keySoundResource.key} value={keySoundResource.key}>
                          {({ selected }) => (
                            <>
                              <div className="group flex cursor-pointer items-center justify-between">
                                <span>{keySoundResource.name}</span>
                                {selected ? (
                                  <span className="listbox-options-icon">
                                    <IconCheck className="focus:outline-none" />
                                  </span>
                                ) : null}
                                <IconEar
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onPlayKeySound(keySoundResource)
                                  }}
                                  className="mr-2  hidden cursor-pointer text-neutral-500 hover:text-indigo-400 group-hover:block dark:text-neutral-300"
                                />
                              </div>
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Effect sounds</span>
            <div className={styles.switchBlock}>
              <Switch checked={hintSoundsConfig.isOpen} onChange={onToggleHintSounds} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Effect sounds ${
                hintSoundsConfig.isOpen ? 'on' : 'off'
              }`}</span>
            </div>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Volume</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  defaultValue={[hintSoundsConfig.volume * 100]}
                  max={100}
                  min={1}
                  step={10}
                  className="slider"
                  onValueChange={onChangeHintSoundsVolume}
                  disabled={!hintSoundsConfig.isOpen}
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${Math.floor(hintSoundsConfig.volume * 100)}%`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar className="flex touch-none select-none bg-transparent" orientation="vertical" />
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
    </ScrollArea>
  )
}
