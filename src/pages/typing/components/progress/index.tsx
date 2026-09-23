import { useEffect, useState } from "react";
import { useTypingContext } from "../../store";

export default function Progress({ className }: { className?: string }) {
  const { state } = useTypingContext();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const colorSwitcher: { [key: number]: string } = {
    0: "bg-primary/40",
    1: "bg-primary/70",
    2: "bg-primary",
  };

  useEffect(() => {
    const newProgress = Math.floor(
      (state.chapterData.index / state.chapterData.words.length) * 100
    );
    setProgress(newProgress);
    const colorPhase = Math.floor(newProgress / 33.4);
    setPhase(colorPhase);
  }, [state.chapterData.index, state.chapterData.words.length]);

  return (
    <div className={`relative pt-1 ${className}`}>
      <div className="mb-4 flex h-2 overflow-hidden rounded-xl bg-muted text-xs transition-all duration-300">
        <div
          className={`flex flex-col justify-center whitespace-nowrap rounded-xl text-center text-primary-foreground shadow-none transition-all duration-300 ${
            colorSwitcher[phase] ?? "bg-primary/40"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
