import { useState } from 'react'

interface Props {
  titles?: string[]
}

export default function CategoryNavigation({ titles = ['Chinese Exams', 'Study Abroad Exams', 'Code Practice'] }: Props) {
  const [selectedTitle, setSelectedTitle] = useState(titles[0])

  return (
    <div className="mr-4 flex flex-col items-center justify-center pr-4">
      <div className="flex flex-col gap-y-3">
        {titles.map((title) => (
          <button
            key={title}
            onClick={() => setSelectedTitle(title)}
            className={`flex cursor-pointer items-center space-x-2 ${selectedTitle === title ? 'text-gray-800' : 'text-gray-500'}`}
          >
            <div className={`mr-1 h-2.5 w-2.5 rounded-full ${selectedTitle === title ? 'bg-indigo-400' : 'bg-indigo-100'}`} />
            <span className="text-lg">{title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
