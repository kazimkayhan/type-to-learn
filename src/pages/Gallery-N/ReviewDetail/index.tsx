import type { TErrorWordData } from '../hooks/useErrorWords'
import { Button } from '@/components/ui/button'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { currentChapterAtom, currentDictIdAtom, reviewModeInfoAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { timeStamp2String } from '@/utils'
import { generateNewWordReviewRecord, useGetLatestReviewRecord } from '@/utils/db/review-record'
import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import MdiRobotAngry from '~icons/mdi/robot-angry'

export function ReviewDetail({ errorData, dict }: { errorData: TErrorWordData[]; dict: Dictionary }) {
  const latestReviewRecord = useGetLatestReviewRecord(dict.id)
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  const setCurrentDictId = useSetAtom(currentDictIdAtom)
  const navigate = useNavigate()
  const setCurrentChapter = useSetAtom(currentChapterAtom)

  const startReview = async () => {
    setCurrentDictId(dict.id)
    setCurrentChapter(-1)

    const record = await generateNewWordReviewRecord(dict.id, errorData)
    setReviewModeInfo({ isReviewMode: true, reviewRecord: record })
    navigate('/')
  }

  const continueReview = () => {
    setCurrentDictId(dict.id)
    setCurrentChapter(-1)

    setReviewModeInfo({ isReviewMode: true, reviewRecord: latestReviewRecord })
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col items-center justify-around px-4 sm:px-10 lg:px-20">
      <div>
        <MdiRobotAngry fontSize={30} className="text-indigo-300 " />
        <blockquote>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            We use your historical practice data, mistake counts, and practice time for this dictionary to intelligently generate a practice
            list.
            <br />
            This generation method is still experimental — we will continue to improve it.
          </p>
        </blockquote>
      </div>
      <div className="flex w-full flex-col items-center">
        {latestReviewRecord && (
          <>
            <div className="flex w-full items-center py-0 sm:ml-10">
              <Progress value={latestReviewRecord.index + 1} max={latestReviewRecord.words.length} className="mr-4 w-full">
                <ProgressTrack className="h-2 rounded-full border border-indigo-400 bg-white">
                  <ProgressIndicator
                    className="h-full rounded-full bg-indigo-400 pl-0"
                    style={{ width: `calc(${((latestReviewRecord.index + 1) / latestReviewRecord.words.length) * 100}% )` }}
                  />
                </ProgressTrack>
              </Progress>
              <span className="p-0 text-xs">
                {latestReviewRecord.index + 1}/{latestReviewRecord.words.length}
              </span>
            </div>
            <div className="mt-1 text-sm font-normal text-gray-500">{`( Created ${timeStamp2String(latestReviewRecord.createTime)} )`}</div>
          </>
        )}

        {!latestReviewRecord && <div>Current dictionary error words: {errorData.length}</div>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-10">
          {latestReviewRecord && (
            <Button size="sm" onClick={continueReview}>
              Continue current progress
            </Button>
          )}
          <Button size="sm" onClick={startReview}>
            Start{latestReviewRecord && ' new'} review
          </Button>
        </div>
      </div>
    </div>
  )
}
