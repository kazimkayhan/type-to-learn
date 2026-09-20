import HeatmapCharts from './components/HeatmapCharts'
import KeyboardWithBarCharts from './components/KeyboardWithBarCharts'
import LineCharts from './components/LineCharts'
import { useWordStats } from './hooks/useWordStats'
import Layout from '@/components/Layout'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { isOpenDarkModeAtom } from '@/store'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import IconX from '~icons/tabler/x'

const Analysis = () => {
  const navigate = useNavigate()
  const [, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old)
  }

  useHotkeys(
    'ctrl+d',
    () => {
      changeDarkModeState()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  const { isEmpty, exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord } = useWordStats(
    dayjs().subtract(1, 'year').unix(),
    dayjs().unix(),
  )

  return (
    <Layout>
      <div className="relative flex w-full min-w-0 flex-1 flex-col overflow-y-auto px-4 pt-16 sm:px-8 sm:pt-20 lg:px-20">
        <IconX className="absolute right-4 top-4 h-7 w-7 cursor-pointer text-gray-400 sm:right-10 sm:top-10" onClick={onBack} />
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="h-full w-auto pb-[20rem] [&>div]:!block">
            {isEmpty ? (
              <div className="align-items-center m-4 grid h-80 w-auto place-content-center overflow-hidden rounded-lg px-4 text-center shadow-lg dark:bg-gray-600">
                <div className="text-xl text-gray-400 sm:text-2xl">No practice data yet</div>
              </div>
            ) : (
              <>
                <div className="mx-0 my-6 overflow-x-auto rounded-lg p-4 shadow-lg dark:bg-gray-700 dark:bg-opacity-50 sm:mx-4 sm:my-8 sm:p-8">
                  <HeatmapCharts title="Practice sessions heatmap (past year)" data={exerciseRecord} />
                </div>
                <div className="mx-0 my-6 overflow-x-auto rounded-lg p-4 shadow-lg dark:bg-gray-700 dark:bg-opacity-50 sm:mx-4 sm:my-8 sm:p-8">
                  <HeatmapCharts title="Words practiced heatmap (past year)" data={wordRecord} />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg p-4 shadow-lg dark:bg-gray-700 dark:bg-opacity-50 sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                  <LineCharts title="WPM trend (past year)" name="WPM" data={wpmRecord} />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg p-4 shadow-lg dark:bg-gray-700 dark:bg-opacity-50 sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                  <LineCharts title="Accuracy trend (past year)" name="Accuracy (%)" data={accuracyRecord} suffix="%" />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg p-4 shadow-lg dark:bg-gray-700 dark:bg-opacity-50 sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                  <KeyboardWithBarCharts title="Key mistake ranking" name="Mistakes" data={wrongTimeRecord} />
                </div>
              </>
            )}
          </div>
          <ScrollBar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollBar>
        </ScrollArea>
        <div className="overflow-y-auto"></div>
      </div>
    </Layout>
  )
}

export default Analysis
