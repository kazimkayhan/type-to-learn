import { TypingContext, TypingStateActionType } from '../../store'
import ShareButton from '../ShareButton'
import { AuthorButton } from './AuthorButton'
import ConclusionBar from './ConclusionBar'
import RemarkRing from './RemarkRing'
import WordChip from './WordChip'
import Tooltip from '@/components/Tooltip'
import { SITE } from '@/constants'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  wordDictationConfigAtom,
} from '@/store'
import { Transition } from '@headlessui/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import IexportWords from '~icons/icon-park-outline/excel'
import IconGithub from '~icons/simple-icons/github'
import IconX from '~icons/tabler/x'

const ResultScreen = () => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom)
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const randomConfig = useAtomValue(randomConfigAtom)
  const navigate = useNavigate()

  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const isReviewMode = useAtomValue(isReviewModeAtom)

  useEffect(() => {
    // tick a zero timer to calc the stats
    dispatch({ type: TypingStateActionType.TICK_TIMER, addTime: 0 })
  }, [dispatch])

  const exportWords = useCallback(() => {
    const { words, userInputLogs } = state.chapterData
    const exportData = userInputLogs.map((log) => {
      const word = words[log.index]
      const wordName = word.name
      return {
        ...word,
        trans: word.trans.join(';'),
        correctCount: log.correctCount,
        wrongCount: log.wrongCount,
        wrongLetters: Object.entries(log.LetterMistakes)
          .map(([key, mistakes]) => `${wordName[Number(key)]}:${mistakes.length}`)
          .join(';'),
      }
    })

    import('xlsx')
      .then(({ utils, writeFileXLSX }) => {
        const ws = utils.json_to_sheet(exportData)
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, 'Data')
        writeFileXLSX(wb, `${currentDictInfo.name} Chapter ${currentChapter + 1}.xlsx`)
      })
      .catch(() => {
        console.log('Failed to import xlsx module')
      })
  }, [currentChapter, currentDictInfo.name, state.chapterData])

  const wrongWords = useMemo(() => {
    return state.chapterData.userInputLogs
      .filter((log) => log.wrongCount > 0)
      .map((log) => state.chapterData.words[log.index])
      .filter((word) => word !== undefined)
  }, [state.chapterData.userInputLogs, state.chapterData.words])

  const isLastChapter = useMemo(() => {
    return currentChapter >= currentDictInfo.chapterCount - 1
  }, [currentChapter, currentDictInfo])

  const correctRate = useMemo(() => {
    const chapterLength = state.chapterData.words.length
    const correctCount = chapterLength - wrongWords.length
    return Math.floor((correctCount / chapterLength) * 100)
  }, [state.chapterData.words.length, wrongWords.length])

  const mistakeLevel = useMemo(() => {
    if (correctRate >= 85) {
      return 0
    } else if (correctRate >= 70) {
      return 1
    } else {
      return 2
    }
  }, [correctRate])

  const timeString = useMemo(() => {
    const seconds = state.timerData.time
    const minutes = Math.floor(seconds / 60)
    const minuteString = minutes < 10 ? '0' + minutes : minutes + ''
    const restSeconds = seconds % 60
    const secondString = restSeconds < 10 ? '0' + restSeconds : restSeconds + ''
    return `${minuteString}:${secondString}`
  }, [state.timerData.time])

  const repeatButtonHandler = useCallback(async () => {
    if (isReviewMode) {
      return
    }

    setWordDictationConfig((old) => {
      if (old.isOpen) {
        if (old.openBy === 'auto') {
          return { ...old, isOpen: false }
        }
      }
      return old
    })
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen])

  const dictationButtonHandler = useCallback(async () => {
    if (isReviewMode) {
      return
    }

    setWordDictationConfig((old) => ({ ...old, isOpen: true, openBy: 'auto' }))
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen])

  const nextButtonHandler = useCallback(() => {
    if (isReviewMode) {
      return
    }

    setWordDictationConfig((old) => {
      if (old.isOpen) {
        if (old.openBy === 'auto') {
          return { ...old, isOpen: false }
        }
      }
      return old
    })
    if (!isLastChapter) {
      setCurrentChapter((old) => old + 1)
      dispatch({ type: TypingStateActionType.NEXT_CHAPTER })
    }
  }, [dispatch, isLastChapter, isReviewMode, setCurrentChapter, setWordDictationConfig])

  const exitButtonHandler = useCallback(() => {
    if (isReviewMode) {
      setCurrentChapter(0)
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    } else {
      dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: false })
    }
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo])

  const onNavigateToGallery = useCallback(() => {
    setCurrentChapter(0)
    setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    navigate('/gallery')
  }, [navigate, setCurrentChapter, setReviewModeInfo])

  useHotkeys(
    'enter',
    () => {
      nextButtonHandler()
    },
    { preventDefault: true },
  )

  useHotkeys(
    'space',
    (e) => {
      // 火狐浏览器的阻止事件无效，会导致按空格键后 再次输入正确的第一个字母会报错
      e.stopPropagation()
      repeatButtonHandler()
    },
    { preventDefault: true },
  )

  useHotkeys(
    'shift+enter',
    () => {
      dictationButtonHandler()
    },
    { preventDefault: true },
  )

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto">
      <div className="absolute inset-0 bg-gray-300 opacity-80 dark:bg-gray-600"></div>
      <Transition
        show={true}
        enter="ease-in duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex min-h-dvh items-center justify-center p-3 sm:p-4">
          <div className="my-card relative flex max-h-[92dvh] w-[min(90vw,72rem)] max-w-6xl flex-col overflow-y-auto rounded-3xl bg-white px-4 pb-8 pt-8 shadow-lg dark:bg-gray-800 sm:pb-14 sm:pl-10 sm:pr-5 sm:pt-10 md:w-4/5 lg:w-3/5">
            <div className="text-center font-sans text-xl font-normal text-gray-900 dark:text-gray-400 md:text-2xl">
              {`${currentDictInfo.name} ${isReviewMode ? 'Error Review' : 'Chapter ' + (currentChapter + 1)}`}
            </div>
            <button className="absolute right-7 top-5" onClick={exitButtonHandler}>
              <IconX className="text-gray-400" />
            </button>
            <div className="mt-6 flex flex-col gap-4 overflow-hidden sm:mt-10 sm:flex-row sm:gap-2">
              <div className="flex flex-shrink-0 flex-grow-0 flex-row justify-center gap-3 px-2 sm:flex-col sm:px-4 md:px-2 lg:px-4">
                <RemarkRing remark={`${state.timerData.accuracy}%`} caption="Accuracy" percentage={state.timerData.accuracy} />
                <RemarkRing remark={timeString} caption="Chapter time" />
                <RemarkRing remark={state.timerData.wpm + ''} caption="WPM" />
              </div>
              <div className="z-10 flex-1 overflow-visible rounded-xl bg-indigo-50 dark:bg-gray-700 sm:ml-6">
                <div className="customized-scrollbar z-20 ml-3 mr-1 flex max-h-56 flex-row flex-wrap content-start gap-3 overflow-y-auto overflow-x-hidden pr-4 pt-6 sm:ml-8 sm:h-80 sm:max-h-none sm:gap-4 sm:pr-7 sm:pt-9">
                  {wrongWords.map((word, index) => (
                    <WordChip key={`${index}-${word.name}`} word={word} />
                  ))}
                </div>
                <div className="align-center flex w-full flex-row justify-start rounded-b-xl bg-indigo-200 px-4 dark:bg-indigo-400">
                  <ConclusionBar mistakeLevel={mistakeLevel} mistakeCount={wrongWords.length} />
                </div>
              </div>
              <div className="mt-2 flex flex-row flex-wrap items-center justify-center gap-3 text-xl sm:ml-2 sm:mt-0 sm:flex-col sm:items-center sm:justify-end">
                <AuthorButton />
                {!isReviewMode && (
                  <>
                    <ShareButton />
                    <IexportWords fontSize={18} className="cursor-pointer text-gray-500" onClick={exportWords}></IexportWords>
                  </>
                )}
                <a href={SITE.github} target="_blank" rel="noreferrer" className="leading-[0px]" aria-label="GitHub">
                  <IconGithub fontSize={16} className="text-gray-500 hover:text-green-800 focus:outline-none" />
                </a>
              </div>
            </div>
            <div className="mt-6 flex w-full flex-col justify-center gap-3 px-2 text-xl sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-5 sm:px-5">
              {!isReviewMode && (
                <>
                  <Tooltip content="Shortcut: shift + enter">
                    <button
                      className="my-btn-primary h-12 w-full border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 sm:w-auto"
                      type="button"
                      onClick={dictationButtonHandler}
                      title="Dictate this chapter"
                    >
                      Dictate this chapter
                    </button>
                  </Tooltip>
                  <Tooltip content="Shortcut: space">
                    <button
                      className="my-btn-primary h-12 w-full border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 sm:w-auto"
                      type="button"
                      onClick={repeatButtonHandler}
                      title="Repeat this chapter"
                    >
                      Repeat this chapter
                    </button>
                  </Tooltip>
                </>
              )}
              {!isLastChapter && !isReviewMode && (
                <Tooltip content="Shortcut: enter">
                  <button
                    className={`my-btn-primary h-12 w-full text-base font-bold sm:w-auto`}
                    type="button"
                    onClick={nextButtonHandler}
                    title="Next chapter"
                  >
                    Next chapter
                  </button>
                </Tooltip>
              )}

              {isReviewMode && (
                <button
                  className="my-btn-primary h-12 w-full text-base font-bold sm:w-auto"
                  type="button"
                  onClick={onNavigateToGallery}
                  title="Practice other chapters"
                >
                  Practice other chapters
                </button>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default ResultScreen
