import React from "react";

const InfoBox: React.FC<InfoBoxProps> = ({ info, description }) => (
  <div className="flex flex-1 flex-col items-center justify-center">
    <span className="w-4/5 border-b pb-1 text-center font-bold text-base text-gray-600 transition-colors duration-300 sm:pb-2 sm:text-xl dark:text-gray-400">
      {info}
    </span>
    <span className="pt-1 text-[10px] transition-colors duration-300 sm:pt-2 sm:text-xs dark:text-gray-300">
      {description}
    </span>
  </div>
);

export default React.memo(InfoBox);

interface InfoBoxProps {
  description: string;
  info: string;
}
