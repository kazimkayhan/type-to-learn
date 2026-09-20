import styles from './index.module.css'
<<<<<<< HEAD
import { Switch } from '@/components/ui/switch'
import { isIgnoreCaseAtom, isShowAnswerOnHoverAtom, isShowPrevAndNextWordAtom, isTextSelectableAtom, randomConfigAtom } from '@/store'
import * as ScrollArea from '@radix-ui/react-scroll-area'
=======
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { isIgnoreCaseAtom, isShowAnswerOnHoverAtom, isShowPrevAndNextWordAtom, isTextSelectableAtom, randomConfigAtom } from '@/store'
import { Switch } from '@headlessui/react'
>>>>>>> e390bb4 (Migrate from Radix UI to Base UI)
import { useAtom } from 'jotai'
import { useCallback } from 'react'

export default function AdvancedSetting() {
  const [randomConfig, setRandomConfig] = useAtom(randomConfigAtom)
  const [isShowPrevAndNextWord, setIsShowPrevAndNextWord] = useAtom(isShowPrevAndNextWordAtom)
  const [isIgnoreCase, setIsIgnoreCase] = useAtom(isIgnoreCaseAtom)
  const [isTextSelectable, setIsTextSelectable] = useAtom(isTextSelectableAtom)
  const [isShowAnswerOnHover, setIsShowAnswerOnHover] = useAtom(isShowAnswerOnHoverAtom)

  const onToggleRandom = useCallback(
    (checked: boolean) => {
      setRandomConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }))
    },
    [setRandomConfig],
  )

  const onToggleLastAndNextWord = useCallback(
    (checked: boolean) => {
      setIsShowPrevAndNextWord(checked)
    },
    [setIsShowPrevAndNextWord],
  )

  const onToggleIgnoreCase = useCallback(
    (checked: boolean) => {
      setIsIgnoreCase(checked)
    },
    [setIsIgnoreCase],
  )

  const onToggleTextSelectable = useCallback(
    (checked: boolean) => {
      setIsTextSelectable(checked)
    },
    [setIsTextSelectable],
  )
  const onToggleShowAnswerOnHover = useCallback(
    (checked: boolean) => {
      setIsShowAnswerOnHover(checked)
    },
    [setIsShowAnswerOnHover],
  )

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto ">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Shuffle chapters</span>
            <span className={styles.sectionDescription}>
              When enabled, words in each chapter will be randomly shuffled. Takes effect on the next chapter.
            </span>
            <div className={styles.switchBlock}>
              <Switch checked={randomConfig.isOpen} onChange={onToggleRandom} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Shuffle ${
                randomConfig.isOpen ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Show previous/next word during practice</span>
            <span className={styles.sectionDescription}>When enabled, the previous and next words are shown above during practice</span>
            <div className={styles.switchBlock}>
              <Switch checked={isShowPrevAndNextWord} onChange={onToggleLastAndNextWord} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Word preview ${
                isShowPrevAndNextWord ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Ignore case</span>
            <span className={styles.sectionDescription}>
              When enabled, input is case-insensitive — e.g. both &quot;hello&quot; and &quot;Hello&quot; are accepted
            </span>
            <div className={styles.switchBlock}>
              <Switch checked={isIgnoreCase} onChange={onToggleIgnoreCase} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Ignore case ${
                isIgnoreCase ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Allow text selection</span>
            <span className={styles.sectionDescription}>When enabled, text can be selected with the mouse </span>
            <div className={styles.switchBlock}>
              <Switch checked={isTextSelectable} onChange={onToggleTextSelectable} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Text selection ${
                isTextSelectable ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Show hints in dictation mode</span>
            <span className={styles.sectionDescription}>When enabled, hover over a word to reveal the correct answer </span>
            <div className={styles.switchBlock}>
              <Switch checked={isShowAnswerOnHover} onChange={onToggleShowAnswerOnHover} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`Hints ${
                isShowAnswerOnHover ? 'on' : 'off'
              }`}</span>
            </div>
          </div>
        </div>
      </div>
      <ScrollBar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollBar>
    </ScrollArea>
  )
}
