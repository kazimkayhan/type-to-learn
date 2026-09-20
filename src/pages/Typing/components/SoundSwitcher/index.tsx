import { hintSoundsConfigAtom, keySoundsConfigAtom } from '@/store'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import IconSpeakerWave from '~icons/heroicons/speaker-wave-solid'

export default function SoundSwitcher() {
  const [keySoundsConfig, setKeySoundsConfig] = useAtom(keySoundsConfigAtom)
  const [hintSoundsConfig, setHintSoundsConfig] = useAtom(hintSoundsConfigAtom)

  const onChangeKeySound = useCallback(
    (checked: boolean) => {
      setKeySoundsConfig((old) => ({ ...old, isOpen: checked }))
    },
    [setKeySoundsConfig],
  )

  const onChangeHintSound = useCallback(
    (checked: boolean) => {
      setHintSoundsConfig((old) => ({ ...old, isOpen: checked }))
    },
    [setHintSoundsConfig],
  )

  return (
    <Popover>
      <PopoverTrigger
        className="flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white"
        onFocus={(e) => {
          e.currentTarget.blur()
        }}
        aria-label="Sound settings"
        title="Sound settings"
      >
        <IconSpeakerWave className="icon" />
      </PopoverTrigger>

      <PopoverContent className="w-60 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle key sounds</span>
            <div className="flex flex-row items-center justify-between">
              <Switch checked={keySoundsConfig.isOpen} onCheckedChange={onChangeKeySound} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Key sounds ${keySoundsConfig.isOpen ? 'on' : 'off'}`}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">Toggle effect sounds</span>
            <div className="flex flex-row items-center justify-between">
              <Switch checked={hintSoundsConfig.isOpen} onCheckedChange={onChangeHintSound} />
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Effect sounds ${hintSoundsConfig.isOpen ? 'on' : 'off'}`}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
