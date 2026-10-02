import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useAtom } from "jotai";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import useWindowSize from "@/hooks/use-window-size";
import { isOpenDarkModeAtom } from "@/store";

echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
]);

interface LineChartsProps {
  data: [string, number][];
  name: string;
  suffix?: string;
  title: string;
}

const LineCharts: FC<LineChartsProps> = ({ data, title, suffix, name }) => {
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom);

  const chartRef = useRef<HTMLDivElement>(null);

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!(chartRef.current && data.length)) {
      return;
    }

    let chart = echarts.getInstanceByDom(chartRef.current);
    chart?.dispose();

    chart = echarts.init(chartRef.current, isOpenDarkMode ? "dark" : undefined);

    const option = {
      color: ["#0ea5e9"],
      grid: {
        bottom: "10%",
        left: "10%",
        right: "10%",
        top: "20%",
      },
      series: [
        {
          data,
          emphasis: { focus: "series" },
          itemStyle: { color: isOpenDarkMode ? "#38bdf8" : "#0ea5e9" },
          lineStyle: { color: isOpenDarkMode ? "#38bdf8" : "#0ea5e9" },
          name,
          smooth: true,
          type: "line",
        },
      ],
      tooltip: { trigger: "axis" },
      xAxis: {
        axisPointer: {
          label: {
            formatter(params: { seriesData: [{ data: [string, number] }] }) {
              return params.seriesData[0].data[0];
            },
          },
        },
        type: "time",
      },
      yAxis: {
        axisLabel: { formatter: (value: number) => value + (suffix || "") },
        type: "value",
      },
    };

    chart.setOption(option);
  }, [data, suffix, name, isOpenDarkMode]);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }
    const chart = echarts.getInstanceByDom(chartRef.current);
    chart?.resize();
  }, [width, height]);

  return (
    <div className="flex h-full flex-col">
      <div className="text-center font-bold text-foreground text-xl">
        {title}
      </div>
      <div
        className="line-chart flex-grow"
        ref={chartRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default LineCharts;
