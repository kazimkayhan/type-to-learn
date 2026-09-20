import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCallback } from 'react'

type Props = {
  tagList: string[]
  currentTag: string
  onChangeCurrentTag: (tag: string) => void
}

export default function DictTagSwitcher({ tagList, currentTag, onChangeCurrentTag }: Props) {
  const onChangeTag = useCallback(
    (tag: string) => {
      onChangeCurrentTag(tag)
    },
    [onChangeCurrentTag],
  )

  return (
    <RadioGroup value={currentTag} onChange={onChangeTag}>
      <div className="flex flex-wrap items-center gap-2">
        {tagList.map((option) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className={({ checked }) =>
              `min-h-10 cursor-pointer whitespace-nowrap rounded-full px-3 py-1.5 text-sm sm:min-h-0 sm:px-4 sm:py-2 sm:text-base ${
                checked ? 'bg-indigo-400 text-white' : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-200'
              } ${!checked && 'hover:bg-indigo-100 dark:hover:bg-gray-600'}`
            }
          >
            <p className="font-normal">{option}</p>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}
