import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/page-shell";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { isOpenDarkModeAtom } from "@/store";
import HeatmapCharts from "./components/heatmap-charts";
import KeyboardWithBarCharts from "./components/keyboard-with-bar-charts";
import LineCharts from "./components/line-charts";
import { useWordStats } from "./hooks/use-word-stats";

const Analysis = () => {
  const navigate = useNavigate();
  const [, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom);

  const onBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  useHotkeys(
    "ctrl+d",
    () => {
      setIsOpenDarkMode((old) => !old);
    },
    { enableOnFormTags: true, preventDefault: true },
    [setIsOpenDarkMode]
  );

  useHotkeys("enter", onBack, { preventDefault: true });

  const {
    isEmpty,
    exerciseRecord,
    wordRecord,
    wpmRecord,
    accuracyRecord,
    wrongTimeRecord,
  } = useWordStats(dayjs().subtract(6, "month").unix(), dayjs().unix());

  return (
    <PageShell
      closeLabel="Close statistics"
      onClose={onBack}
      title="Statistics"
    >
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="h-full w-auto pb-16">
          {isEmpty ? (
            <div className="m-4 grid h-80 w-auto place-content-center overflow-hidden rounded-lg bg-card px-4 text-center shadow-[var(--shadow-card)]">
              <div className="text-muted-foreground text-xl sm:text-2xl">
                No practice sessions in the past 6 months. Finish a chapter to
                see your progress here.
              </div>
            </div>
          ) : (
            <>
              <div className="mx-0 my-6 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:p-8">
                <HeatmapCharts
                  data={exerciseRecord}
                  title="Words typed heatmap (past 6 months)"
                  unitLabel={{
                    plural: "words typed",
                    singular: "word typed",
                  }}
                />
              </div>
              <div className="mx-0 my-6 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:p-8">
                <HeatmapCharts
                  data={wordRecord}
                  title="Unique words practiced heatmap (past 6 months)"
                  unitLabel={{
                    plural: "unique words",
                    singular: "unique word",
                  }}
                />
              </div>
              <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                <LineCharts
                  data={wpmRecord}
                  name="WPM"
                  title="WPM trend (past 6 months)"
                />
              </div>
              <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                <LineCharts
                  data={accuracyRecord}
                  name="Accuracy (%)"
                  suffix="%"
                  title="Accuracy trend (past 6 months)"
                />
              </div>
              <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-[var(--shadow-card)] sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                <KeyboardWithBarCharts
                  data={wrongTimeRecord}
                  name="Mistakes"
                  title="Key mistake ranking (past 6 months)"
                />
              </div>
            </>
          )}
        </div>
        <ScrollBar
          className="flex touch-none select-none bg-transparent"
          orientation="vertical"
        />
      </ScrollArea>
    </PageShell>
  );
};

export default Analysis;
