import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { isOpenDarkModeAtom } from "@/store";
import IconX from "~icons/tabler/x";
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

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old);
  };

  useHotkeys(
    "ctrl+d",
    () => {
      changeDarkModeState();
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  useHotkeys("enter,esc", onBack, { preventDefault: true });

  const {
    isEmpty,
    exerciseRecord,
    wordRecord,
    wpmRecord,
    accuracyRecord,
    wrongTimeRecord,
  } = useWordStats(dayjs().subtract(6, "month").unix(), dayjs().unix());

  return (
    <Layout>
      <div className="relative flex w-full min-w-0 flex-1 flex-col overflow-y-auto px-4 pt-16 sm:px-8 sm:pt-20 lg:px-20">
        <button
          aria-label="Close statistics"
          className="absolute top-4 right-4 rounded p-1 text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring sm:top-10 sm:right-10"
          onClick={onBack}
          type="button"
        >
          <IconX className="h-7 w-7" />
        </button>
        <h1 className="mb-4 font-semibold text-2xl text-foreground">
          Statistics
        </h1>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="h-full w-auto pb-16">
            {isEmpty ? (
              <div className="m-4 grid h-80 w-auto place-content-center overflow-hidden rounded-lg bg-card px-4 text-center shadow-lg">
                <div className="text-muted-foreground text-xl sm:text-2xl">
                  No practice sessions in the past 6 months. Finish a chapter to
                  see your progress here.
                </div>
              </div>
            ) : (
              <>
                <div className="mx-0 my-6 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-lg sm:mx-4 sm:my-8 sm:p-8">
                  <HeatmapCharts
                    data={exerciseRecord}
                    title="Words typed heatmap (past 6 months)"
                    unitLabel={{
                      plural: "words typed",
                      singular: "word typed",
                    }}
                  />
                </div>
                <div className="mx-0 my-6 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-lg sm:mx-4 sm:my-8 sm:p-8">
                  <HeatmapCharts
                    data={wordRecord}
                    title="Unique words practiced heatmap (past 6 months)"
                    unitLabel={{
                      plural: "unique words",
                      singular: "unique word",
                    }}
                  />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-lg sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                  <LineCharts
                    data={wpmRecord}
                    name="WPM"
                    title="WPM trend (past 6 months)"
                  />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-lg sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
                  <LineCharts
                    data={accuracyRecord}
                    name="Accuracy (%)"
                    suffix="%"
                    title="Accuracy trend (past 6 months)"
                  />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg bg-card/50 p-4 shadow-lg sm:mx-4 sm:my-8 sm:h-80 sm:p-8">
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
      </div>
    </Layout>
  );
};

export default Analysis;
