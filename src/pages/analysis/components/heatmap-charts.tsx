import { useAtom } from "jotai";
import type { FC } from "react";
import React from "react";
import type { Activity } from "react-activity-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";
import useWindowSize from "@/hooks/use-window-size";
import { isOpenDarkModeAtom } from "@/store";
import "react-tooltip/dist/react-tooltip.css";

interface HeatmapChartsProps {
  data: Activity[];
  title: string;
}

const HeatmapCharts: FC<HeatmapChartsProps> = ({ data, title }) => {
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom);
  const { width } = useWindowSize();
  const isNarrow = width < 768;

  if (data.length === 0) {
    return (
      <div className="flex w-full min-w-0 flex-col items-center justify-center px-4 py-8 text-center text-gray-500">
        {title}
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center overflow-x-auto">
      <div className="px-2 text-center font-bold text-base text-gray-600 sm:text-xl dark:text-white">
        {title}
      </div>
      <ActivityCalendar
        blockRadius={isNarrow ? 3 : 7}
        blockSize={isNarrow ? 10 : 22}
        colorScheme={isOpenDarkMode ? "dark" : "light"}
        data={data}
        fontSize={isNarrow ? 12 : 20}
        labels={{
          legend: {
            less: "Less",
            more: "More",
          },
          months: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          totalCount: "{{count}} sessions in the past year",
          weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        }}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            "data-tooltip-html": `${activity.date}: ${activity.count} session${activity.count === 1 ? "" : "s"}`,
            "data-tooltip-id": "react-tooltip",
          })
        }
        showWeekdayLabels={!isNarrow}
        style={{
          color: isOpenDarkMode ? "#fff" : "#000",
          padding: isNarrow ? "12px 8px 8px" : "40px 60px 20px 100px",
        }}
        theme={{
          dark: ["hsl(0, 0%, 22%)", "#818cf8"],
          light: ["#f0f0f0", "#6366f1"],
        }}
      />
      <ReactTooltip id="react-tooltip" />
    </div>
  );
};

export default HeatmapCharts;
