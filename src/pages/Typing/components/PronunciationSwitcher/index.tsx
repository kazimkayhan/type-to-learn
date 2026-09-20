import Tooltip from '@/components/Tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { LANG_PRON_MAP } from '@/resources/soundResource'
import { currentDictInfoAtom, phoneticConfigAtom, pronunciationConfigAtom } from '@/store'
import type { PronunciationType } from '@/typings'
import { PRONUNCIATION_PHONETIC_MAP } from '@/typings'
import { CTRL } from '@/utils'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

const PronunciationSwitcher = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [phoneticConfig, setPhoneticConfig] = useAtom(phoneticConfigAtom)
  const pronunciationList = useMemo(() => LANG_PRON_MAP[currentDictInfo.language].pronunciation, [currentDictInfo.language])

  useEffect(() => {
    const defaultPronIndex = currentDictInfo.defaultPronIndex || LANG_PRON_MAP[currentDictInfo.language].defaultPronIndex
    const defaultPron = pronunciationList[defaultPronIndex]

    // if the current pronunciation is not in the pronunciation list, reset the pronunciation config to default
    const index = pronunciationList.findIndex((item) => item.pron === pronunciationConfig.type)
    if (index === -1) {
      // only change the type and name, keep the isOpen state
      setPronunciationConfig((old) => ({
        ...old,
        type: defaultPron.pron,
        name: defaultPron.name,
      }))
    }
  }, [currentDictInfo.defaultPronIndex, currentDictInfo.language, setPronunciationConfig, pronunciationList, pronunciationConfig.type])

  useEffect(() => {
    const phoneticType = PRONUNCIATION_PHONETIC_MAP[pronunciationConfig.type]
    if (phoneticType) {
      setPhoneticConfig((old) => ({
        ...old,
        type: phoneticType,
      }))
    }
  }, [pronunciationConfig.type, setPhoneticConfig])

  const onChangePronunciationIsOpen = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        ...old,
        isOpen: value,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationIsTransRead = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        ...old,
        isTransRead: value,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePronunciationIsLoop = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        ...old,
        isLoop: value,
      }))
    },
    [setPronunciationConfig],
  )

  const onChangePhoneticIsOpen = useCallback(
    (value: boolean) => {
      setPhoneticConfig((old) => ({
        ...old,
        isOpen: value,
      }))
    },
    [setPhoneticConfig],
  )

  const onChangePronunciationType = useCallback(
    (value: PronunciationType) => {
      const item = pronunciationList.find((item) => item.pron === value)
      if (item) {
        setPronunciationConfig((old) => ({
          ...old,
          type: item.pron,
          name: item.name,
        }))
      }
    },
    [setPronunciationConfig, pronunciationList],
  )

  const currentLabel = useMemo(() => {
    if (pronunciationConfig.isOpen) {
      return pronunciationConfig.name
    } else {
      return 'Off'
    }
  }, [pronunciationConfig.isOpen, pronunciationConfig.name])

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex h-8 min-w-max cursor-pointer items-center justify-center rounded-md px-1 transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100',
            open && 'bg-indigo-400 text-white',
          )}
        >
          <Tooltip content="Switch pronunciation and phonetic">{currentLabel}</Tooltip>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4" align="center">
        <div className="flex select-none flex-col items-center justify-center gap-4">
          <div className="flex w-full  flex-col  items-start gap-2 py-0">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
              Toggle phonetic display
            </span>
            <div className="flex w-full flex-row items-center justify-between">
              <Switch checked={phoneticConfig.isOpen} onCheckedChange={onChangePhoneticIsOpen} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Phonetic ${
                phoneticConfig.isOpen ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
          <div className="flex w-full  flex-col  items-start gap-2 py-0">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
              Toggle word pronunciation
            </span>
            <div className="flex w-full flex-row items-center justify-between">
              <Switch checked={pronunciationConfig.isOpen} onCheckedChange={onChangePronunciationIsOpen} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${
                pronunciationConfig.isOpen ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
          {window.speechSynthesis && (
            <div className="flex w-full  flex-col  items-start gap-2 py-0">
              <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
                Toggle definition pronunciation
              </span>
              <div className="flex w-full flex-row items-center justify-between">
                <Switch checked={pronunciationConfig.isTransRead} onCheckedChange={onChangePronunciationIsTransRead} />
                <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${
                  pronunciationConfig.isTransRead ? 'on' : 'off'
                }`}</span>
              </div>
            </div>
          )}
          {pronunciationConfig.isOpen && (
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <div className="flex w-full  flex-col  items-start gap-2 py-0">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
                  Toggle loop pronunciation
                </span>
                <div className="flex w-full flex-row items-center justify-between">
                  <Switch checked={pronunciationConfig.isLoop} onCheckedChange={onChangePronunciationIsLoop} />
                  <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Loop ${
                    pronunciationConfig.isLoop ? 'on' : 'off'
                  }`}</span>
                </div>
              </div>
              <div className="flex w-full  flex-col  items-start gap-2 py-0">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
                  Word pronunciation accent
                </span>
                <div className="flex w-full flex-row items-center justify-between">
                  <Select value={pronunciationConfig.type} onValueChange={onChangePronunciationType}>
                    <SelectTrigger className="w-full">
                      <SelectValue>{pronunciationConfig.name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {pronunciationList.map((item) => (
                        <SelectItem key={item.pron} value={item.pron}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <span className="text-colo text-xs font-medium text-gray-500 dark:text-white dark:text-opacity-60">
                Tips: Read aloud shortcut ({CTRL} + J)
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PronunciationSwitcher
