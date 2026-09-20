import classNames from 'classnames'
import type { ElementType, SVGAttributes } from 'react'
import IconExclamationTriangle from '~icons/heroicons/exclamation-triangle-solid'
import IconHandThumbUp from '~icons/heroicons/hand-thumb-up-solid'
import IconHeart from '~icons/heroicons/heart-solid'

type IconMapper = {
  icon: ElementType<SVGAttributes<SVGSVGElement>>
  className: string
  text: (mistakeCount: number) => string
}

const ICON_MAPPER: IconMapper[] = [
  {
    icon: IconHeart,
    className: 'text-indigo-600',
    text: (mistakeCount: number) =>
      `Great job!` + (mistakeCount > 0 ? ` Only ${mistakeCount} word${mistakeCount > 1 ? 's' : ''} wrong` : ' Perfect score!'),
  },
  {
    icon: IconHandThumbUp,
    className: 'text-indigo-600',
    text: () => 'Not bad — you can do even better next time!',
  },
  {
    icon: IconExclamationTriangle,
    className: 'text-indigo-600',
    text: () => 'Too many mistakes — want to try again?',
  },
]

const ConclusionBar = ({ mistakeLevel, mistakeCount }: ConclusionBarProps) => {
  const { icon: Icon, className, text } = ICON_MAPPER[mistakeLevel]

  return (
    <div className="flex h-auto min-h-10 flex-row items-center py-1 sm:h-10">
      <Icon className={classNames(className, 'h-5 w-5 shrink-0')} />
      <span className="ml-2 inline-block align-middle text-sm font-medium leading-5 text-gray-700 sm:leading-10 md:text-base">
        {text(mistakeCount)}
      </span>
    </div>
  )
}

export type ConclusionBarProps = {
  mistakeLevel: number
  mistakeCount: number
}

export default ConclusionBar
