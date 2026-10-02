import { useAtomValue } from "jotai";
import { timedPracticeConfigAtom } from "@/store";
import { useTypingContext } from "../../store";
import InfoBox from "./info-box";

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const seconds = safe % 60;
  const minutes = Math.floor(safe / 60);
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${minutesString}:${secondsString}`;
}

export default function Speed() {
  const { state } = useTypingContext();
  const timedConfig = useAtomValue(timedPracticeConfigAtom);
  const timedLimitSeconds =
    timedConfig.enabled && timedConfig.durationMinutes > 0
      ? timedConfig.durationMinutes * 60
      : null;
  const remainingSeconds =
    timedLimitSeconds === null
      ? null
      : Math.max(0, timedLimitSeconds - state.timerData.time);
  const isUrgent =
    remainingSeconds !== null && remainingSeconds > 0 && remainingSeconds <= 30;
  const inputNumber =
    state.chapterData.correctCount + state.chapterData.wrongCount;

  return (
    <div className="my-card flex w-full max-w-full flex-wrap justify-center gap-2 rounded-xl bg-card px-2 py-2 transition-colors duration-200 sm:max-w-3xl sm:flex-nowrap sm:gap-0 sm:px-2 sm:py-4 md:px-4 md:py-10">
      <InfoBox
        description={timedLimitSeconds === null ? "Time" : "Left"}
        info={formatClock(
          remainingSeconds === null ? state.timerData.time : remainingSeconds
        )}
        urgent={isUrgent}
      />
      <InfoBox description="Inputs" info={`${inputNumber}`} />
      <InfoBox description="WPM" info={`${state.timerData.wpm}`} />
      <InfoBox
        description="Correct"
        info={`${state.chapterData.correctCount}`}
      />
      <InfoBox description="Accuracy" info={`${state.timerData.accuracy}%`} />
    </div>
  );
}
