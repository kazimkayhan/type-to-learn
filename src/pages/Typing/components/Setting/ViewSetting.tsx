import styles from './index.module.css'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Slider } from '@/components/ui/slider'
import { defaultFontSizeConfig } from '@/constants'
import { fontSizeConfigAtom } from '@/store'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

export default function ViewSetting() {
  const [fontSizeConfig, setFontsizeConfig] = useAtom(fontSizeConfigAtom)

  const onChangeForeignFontSize = useCallback(
    (value: number[]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        foreignFont: value[0],
      }))
    },
    [setFontsizeConfig],
  )

  const onChangeTranslateFontSize = useCallback(
    (value: number[]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        translateFont: value[0],
      }))
    },
    [setFontsizeConfig],
  )

  const onResetFontSize = useCallback(() => {
    setFontsizeConfig({ ...defaultFontSizeConfig })
  }, [setFontsizeConfig])

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Font settings</span>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Foreign language font</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  value={[fontSizeConfig.foreignFont]}
                  min={20}
                  max={96}
                  step={4}
                  className="slider"
                  onValueChange={onChangeForeignFontSize}
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{fontSizeConfig.foreignFont}px</span>
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>Definition font</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  value={[fontSizeConfig.translateFont]}
                  max={60}
                  min={14}
                  step={4}
                  className="slider"
                  onValueChange={onChangeTranslateFontSize}
                />
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{fontSizeConfig.translateFont}px</span>
              </div>
            </div>
          </div>
          <button className="my-btn-primary ml-4 disabled:bg-gray-300" type="button" onClick={onResetFontSize} title="Reset font settings">
            Reset font settings
          </button>
        </div>
      </div>
      <ScrollBar className="flex touch-none select-none bg-transparent" orientation="vertical" />
    </ScrollArea>
  )
}
