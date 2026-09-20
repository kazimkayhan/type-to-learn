import { wordDictationConfigAtom } from '@/store'
import type { WordDictationType } from '@/typings'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useAtom } from 'jotai'
import { useLayoutEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconEyeSlash from '~icons/heroicons/eye-slash-solid'
import IconEye from '~icons/heroicons/eye-solid'

const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  { name: 'Hide all', type: 'hideAll' },
  { name: 'Hide vowels', type: 'hideVowel' },
  { name: 'Hide consonants', type: 'hideConsonant' },
  { name: 'Random hide', type: 'randomHide' },
]

export default function WordDictationSwitcher() {
  const [wordDictationConfig, setWordDictationConfig] = useAtom(wordDictationConfigAtom)
  const [currentType, setCurrentType] = useState(wordDictationTypeList[0])

  const onToggleWordDictation = () => {
    setWordDictationConfig((old) => {
      if (!old.isOpen) {
        return { ...old, isOpen: !old.isOpen, openBy: 'user' }
      } else {
        return { ...old, isOpen: !old.isOpen }
      }
    })
  }

  const onChangeWordDictationType = (value: WordDictationType) => {
    setWordDictationConfig((old) => {
      return { ...old, type: value }
    })
  }

  useLayoutEffect(() => {
    setCurrentType(wordDictationTypeList.find((item) => item.type === wordDictationConfig.type) || wordDictationTypeList[0])
  }, [wordDictationConfig.type])

  useHotkeys(
    'ctrl+v',
    () => {
      onToggleWordDictation()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  return (
    <Popover>
      <PopoverTrigger
        className={`flex items-center justify-center rounded p-[2px] text-lg ${
          wordDictationConfig.isOpen ? 'text-indigo-500' : 'text-gray-500'
        } outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white`}
        type="button"
        aria-label="Toggle dictation mode"
      >
        {wordDictationConfig.isOpen ? <IconEye className="icon" /> : <IconEyeSlash className="icon" />}
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle dictation mode</span>
            <div className="flex flex-row items-center justify-between">
              <Switch checked={wordDictationConfig.isOpen} onCheckedChange={onToggleWordDictation} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Dictation ${wordDictationConfig.isOpen ? 'on' : 'off'}`}</span>
            </div>
          </div>

          {wordDictationConfig.isOpen && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Dictation mode</span>
              <Select value={currentType.type} onValueChange={onChangeWordDictationType}>
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

          <span className="text-xs font-medium text-gray-500 dark:text-white dark:text-opacity-60">
            Tips: Toggle dictation shortcut (Ctrl + V)
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
