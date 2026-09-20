import React from 'react'

const InfoBox: React.FC<InfoBoxProps> = ({ info, description }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <span className="w-4/5 border-b pb-1 text-center text-base font-bold text-gray-600 transition-colors duration-300 dark:text-gray-400 sm:pb-2 sm:text-xl">
        {info}
      </span>
      <span className="pt-1 text-[10px] transition-colors duration-300 dark:text-gray-300 sm:pt-2 sm:text-xs">{description}</span>
    </div>
  )
}

export default React.memo(InfoBox)

export type InfoBoxProps = {
  info: string
  description: string
}
