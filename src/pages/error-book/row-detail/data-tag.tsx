import type React from "react";

interface DataTagProps {
  data: number | string;
  icon: React.ElementType;
  name: string;
}

const DataTag: React.FC<DataTagProps> = ({ icon, name, data }) => {
  const IconComponent = icon;

  return (
    <div className="g flex h-10 w-40 flex-1 select-none items-center justify-between rounded-md border-border bg-muted px-3 py-5 shadow">
      <div className="flex items-center space-x-1">
        <IconComponent className="h-4 w-4 text-muted-foreground" />
        <span className="break-keep font-normal text-base text-muted-foreground">
          {name}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="font-normal text-base text-foreground">{data}</span>
      </div>
    </div>
  );
};

export default DataTag;
