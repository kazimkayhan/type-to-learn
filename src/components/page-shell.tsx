import type React from "react";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/ui";
import IconX from "~icons/tabler/x";
import Layout from "./layout";

interface PageShellProps {
  /** Extra controls rendered to the left of the close button. */
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  closeLabel?: string;
  contentClassName?: string;
  /** Lock to the viewport (analysis, error-book). Gallery should grow with content. */
  fillViewport?: boolean;
  /** Content max width. Defaults to 7xl. Pass false for full bleed. */
  maxWidth?: "md" | "5xl" | "7xl" | false;
  onClose?: () => void;
  /** Optional sticky band below the title row (e.g. gallery search). */
  stickyHeader?: React.ReactNode;
  subtitle?: string;
  title: string;
}

export default function PageShell({
  title,
  subtitle,
  children,
  fillViewport = true,
  actions,
  stickyHeader,
  maxWidth = "7xl",
  className,
  contentClassName,
  closeLabel = "Close",
  onClose,
}: PageShellProps) {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
      return;
    }
    navigate("/");
  }, [navigate, onClose]);

  useHotkeys("esc", handleClose, { preventDefault: true });

  const widthClass =
    maxWidth === false
      ? "max-w-none"
      : maxWidth === "md"
        ? "max-w-md"
        : maxWidth === "5xl"
          ? "max-w-5xl"
          : "max-w-7xl";

  return (
    <Layout fillViewport={fillViewport}>
      <div
        className={cn(
          "relative mx-auto flex w-full min-w-0 flex-1 flex-col px-4 pt-4 pb-8 sm:px-6 lg:px-8",
          widthClass,
          className
        )}
      >
        <div className="mb-6 flex items-start justify-between gap-3 sm:mb-8">
          <div className="min-w-0">
            <h1 className="min-w-0 text-pretty font-semibold text-2xl text-foreground sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2">
            {actions}
            <button
              aria-label={closeLabel}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
              onClick={handleClose}
              type="button"
            >
              <IconX className="size-7" />
            </button>
          </div>
        </div>

        {stickyHeader ? (
          <div className="sticky top-0 z-10 -mx-4 mb-6 border-border/60 border-b bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:mb-8 sm:px-6 lg:-mx-8 lg:px-8">
            {stickyHeader}
          </div>
        ) : null}

        <div
          className={cn(
            "flex min-h-0 w-full min-w-0 flex-1 flex-col",
            contentClassName
          )}
        >
          {children}
        </div>
      </div>
    </Layout>
  );
}
