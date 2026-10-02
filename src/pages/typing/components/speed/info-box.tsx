import React from "react";

interface InfoBoxProps {
  description: string;
  info: string;
  urgent?: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({ info, description, urgent }) => (
  <div className="flex flex-1 flex-col items-center justify-center">
    <span
      className={`w-4/5 border-b pb-1 text-center font-bold text-base tabular-nums transition-colors duration-200 sm:pb-2 sm:text-xl ${
        urgent
          ? "border-destructive text-destructive"
          : "border-border text-foreground"
      }`}
    >
      {info}
    </span>
    <span
      className={`pt-1 text-[10px] transition-colors duration-200 sm:pt-2 sm:text-xs ${
        urgent ? "text-destructive" : "text-muted-foreground"
      }`}
    >
      {description}
    </span>
  </div>
);

export default React.memo(InfoBox);
