import { useContext } from "react";
import { TypingContext } from "../../store";
import InfoBox from "./InfoBox";

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!;
  const seconds = state.timerData.time % 60;
  const minutes = Math.floor(state.timerData.time / 60);
  const secondsString = seconds < 10 ? "0" + seconds : seconds + "";
  const minutesString = minutes < 10 ? "0" + minutes : minutes + "";
  const inputNumber =
    state.chapterData.correctCount + state.chapterData.wrongCount;

  return (
    <div className="my-card flex w-full max-w-full flex-wrap justify-center gap-2 rounded-xl bg-white px-2 py-2 opacity-50 transition-colors duration-300 sm:max-w-3xl sm:flex-nowrap sm:gap-0 sm:px-2 sm:py-4 md:px-4 md:py-10 dark:bg-gray-800">
      <InfoBox description="Time" info={`${minutesString}:${secondsString}`} />
      <InfoBox description="Inputs" info={inputNumber + ""} />
      <InfoBox description="WPM" info={state.timerData.wpm + ""} />
      <InfoBox
        description="Correct"
        info={state.chapterData.correctCount + ""}
      />
      <InfoBox description="Accuracy" info={state.timerData.accuracy + ""} />
    </div>
  );
}
