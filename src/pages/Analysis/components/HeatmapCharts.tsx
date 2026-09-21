import useWindowSize from '@/hooks/useWindowSize'
import { isOpenDarkModeAtom } from '@/store'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import React from 'react'
import { ActivityCalendar } from 'react-activity-calendar'
import type { Activity } from 'react-activity-calendar'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

interface HeatmapChartsProps {
  title: string
  data: Activity[]
}

const HeatmapCharts: FC<HeatmapChartsProps> = ({ data, title }) => {
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom)
  const { width } = useWindowSize()
  const isNarrow = width < 768

  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center overflow-x-auto">
      <div className="px-2 text-center text-base font-bold text-gray-600 dark:text-white sm:text-xl">{title}</div>
      <ActivityCalendar
        fontSize={isNarrow ? 12 : 20}
        blockSize={isNarrow ? 10 : 22}
        blockRadius={isNarrow ? 3 : 7}
        style={{
          padding: isNarrow ? '12px 8px 8px' : '40px 60px 20px 100px',
          color: isOpenDarkMode ? '#fff' : '#000',
        }}
        colorScheme={isOpenDarkMode ? 'dark' : 'light'}
        data={data}
        theme={{
          light: ['#f0f0f0', '#6366f1'],
          dark: ['hsl(0, 0%, 22%)', '#818cf8'],
        }}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            'data-tooltip-id': 'react-tooltip',
            'data-tooltip-html': `${activity.date}: ${activity.count} session${activity.count === 1 ? '' : 's'}`,
          })
        }
        showWeekdayLabels={!isNarrow}
        labels={{
          months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          totalCount: '{{count}} sessions in the past year',
          legend: {
            less: 'Less',
            more: 'More',
          },
        }}
      />
      <ReactTooltip id="react-tooltip" />
    </div>
  )
}

export default HeatmapCharts
