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
  } = useWordStats(dayjs().subtract(1, "year").unix(), dayjs().unix());

  return (
    <Layout>
      <div className="relative flex w-full min-w-0 flex-1 flex-col overflow-y-auto px-4 pt-16 sm:px-8 sm:pt-20 lg:px-20">
        <IconX
          className="absolute top-4 right-4 h-7 w-7 cursor-pointer text-gray-400 sm:top-10 sm:right-10"
          onClick={onBack}
        />
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="[&>div]:!block h-full w-auto pb-[20rem]">
            {isEmpty ? (
              <div className="m-4 grid h-80 w-auto place-content-center overflow-hidden rounded-lg px-4 text-center align-items-center shadow-lg dark:bg-gray-600">
                <div className="text-gray-400 text-xl sm:text-2xl">
                  No practice data yet
                </div>
              </div>
            ) : (
              <>
                <div className="mx-0 my-6 overflow-x-auto rounded-lg p-4 shadow-lg sm:mx-4 sm:my-8 sm:p-8 dark:bg-gray-700 dark:bg-opacity-50">
                  <HeatmapCharts
                    data={exerciseRecord}
                    title="Practice sessions heatmap (past year)"
                  />
                </div>
                <div className="mx-0 my-6 overflow-x-auto rounded-lg p-4 shadow-lg sm:mx-4 sm:my-8 sm:p-8 dark:bg-gray-700 dark:bg-opacity-50">
                  <HeatmapCharts
                    data={wordRecord}
                    title="Words practiced heatmap (past year)"
                  />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg p-4 shadow-lg sm:mx-4 sm:my-8 sm:h-80 sm:p-8 dark:bg-gray-700 dark:bg-opacity-50">
                  <LineCharts
                    data={wpmRecord}
                    name="WPM"
                    title="WPM trend (past year)"
                  />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg p-4 shadow-lg sm:mx-4 sm:my-8 sm:h-80 sm:p-8 dark:bg-gray-700 dark:bg-opacity-50">
                  <LineCharts
                    data={accuracyRecord}
                    name="Accuracy (%)"
                    suffix="%"
                    title="Accuracy trend (past year)"
                  />
                </div>
                <div className="mx-0 my-6 h-72 overflow-x-auto rounded-lg p-4 shadow-lg sm:mx-4 sm:my-8 sm:h-80 sm:p-8 dark:bg-gray-700 dark:bg-opacity-50">
                  <KeyboardWithBarCharts
                    data={wrongTimeRecord}
                    name="Mistakes"
                    title="Key mistake ranking"
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
        <div className="overflow-y-auto" />
      </div>
    </Layout>
  );
};

export default Analysis;
