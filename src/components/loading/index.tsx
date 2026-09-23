import React from "react";

export const LoadingUI: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent border-solid align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
    role="status"
  >
    <span className="sr-only">Loading…</span>
  </div>
);

const Loading: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="flex flex-col items-center justify-center">
      <LoadingUI />
    </div>
  </div>
);

export default React.memo(Loading);
