import { TypingContext } from '../../store'
import InfoBox from './InfoBox'
import { useContext } from 'react'

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  const seconds = state.timerData.time % 60
  const minutes = Math.floor(state.timerData.time / 60)
  const secondsString = seconds < 10 ? '0' + seconds : seconds + ''
  const minutesString = minutes < 10 ? '0' + minutes : minutes + ''
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount

  return (
    <div className="my-card flex w-full max-w-3xl rounded-xl bg-white px-2 py-4 opacity-50 transition-colors duration-300 dark:bg-gray-800 sm:w-3/5 sm:p-4 sm:py-10">
      <InfoBox info={`${minutesString}:${secondsString}`} description="Time" />
      <InfoBox info={inputNumber + ''} description="Inputs" />
      <InfoBox info={state.timerData.wpm + ''} description="WPM" />
      <InfoBox info={state.chapterData.correctCount + ''} description="Correct" />
      <InfoBox info={state.timerData.accuracy + ''} description="Accuracy" />
    </div>
  )
}
