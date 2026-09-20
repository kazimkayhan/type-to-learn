import Tooltip from '@/components/Tooltip'
import { LANG_PRON_MAP } from '@/resources/soundResource'
import { currentDictInfoAtom, phoneticConfigAtom, pronunciationConfigAtom } from '@/store'
import type { PronunciationType } from '@/typings'
import { PRONUNCIATION_PHONETIC_MAP } from '@/typings'
import { CTRL } from '@/utils'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'

const PronunciationSwitcher = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  const [phoneticConfig, setPhoneticConfig] = useAtom(phoneticConfigAtom)
  const pronunciationList = useMemo(() => LANG_PRON_MAP[currentDictInfo.language].pronunciation, [currentDictInfo.language])

  useEffect(() => {
    const defaultPronIndex = currentDictInfo.defaultPronIndex || LANG_PRON_MAP[currentDictInfo.language].defaultPronIndex
    const defaultPron = pronunciationList[defaultPronIndex]

    const index = pronunciationList.findIndex((item) => item.pron === pronunciationConfig.type)
    if (index === -1) {
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

  return (
    <Popover>
      <PopoverTrigger
        className="flex h-8 min-w-max cursor-pointer items-center justify-center rounded-md px-1 transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        onFocus={(e) => {
          e.currentTarget.blur()
        }}
      >
        <Tooltip content="Switch pronunciation and phonetic">{currentLabel}</Tooltip>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle phonetic display</span>
            <div className="flex flex-row items-center justify-between">
              <Switch checked={phoneticConfig.isOpen} onCheckedChange={onChangePhoneticIsOpen} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Phonetic ${phoneticConfig.isOpen ? 'on' : 'off'}`}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle word pronunciation</span>
            <div className="flex flex-row items-center justify-between">
              <Switch checked={pronunciationConfig.isOpen} onCheckedChange={onChangePronunciationIsOpen} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${pronunciationConfig.isOpen ? 'on' : 'off'}`}</span>
            </div>
          </div>

          {window.speechSynthesis && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle definition pronunciation</span>
              <div className="flex flex-row items-center justify-between">
                <Switch checked={pronunciationConfig.isTransRead} onCheckedChange={onChangePronunciationIsTransRead} />
                <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Pronunciation ${pronunciationConfig.isTransRead ? 'on' : 'off'}`}</span>
              </div>
            </div>
          )}

          {pronunciationConfig.isOpen && (
            <>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle loop pronunciation</span>
                <div className="flex flex-row items-center justify-between">
                  <Switch checked={pronunciationConfig.isLoop} onCheckedChange={onChangePronunciationIsLoop} />
                  <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Loop ${pronunciationConfig.isLoop ? 'on' : 'off'}`}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Word pronunciation accent</span>
                <Select value={pronunciationConfig.type} onValueChange={onChangePronunciationType}>
                  <SelectTrigger>
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

              <span className="text-xs font-medium text-gray-500 dark:text-white dark:text-opacity-60">
                Tips: Read aloud shortcut ({CTRL} + J)
              </span>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default PronunciationSwitcher
