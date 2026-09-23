import React from "react";

const InfoBox: React.FC<InfoBoxProps> = ({ info, description }) => (
  <div className="flex flex-1 flex-col items-center justify-center">
    <span className="w-4/5 border-b pb-1 text-center font-bold text-base text-foreground tabular-nums transition-colors duration-300 sm:pb-2 sm:text-xl">
      {info}
    </span>
    <span className="pt-1 text-[10px] text-muted-foreground transition-colors duration-300 sm:pt-2 sm:text-xs">
      {description}
    </span>
  </div>
);

export default React.memo(InfoBox);

interface InfoBoxProps {
  description: string;
  info: string;
}
