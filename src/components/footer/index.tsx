import type React from "react";
import { useCallback } from "react";
import { SITE } from "@/constants";
import IconMail from "~icons/material-symbols/mail";
import IconGithub from "~icons/simple-icons/github";
import IconWorld from "~icons/tabler/world";

const Footer: React.FC = () => {
  const handleBlur = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.blur();
  }, []);

  const linkClass =
    "inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <footer className="mt-3 mb-1 flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-1.5 px-3 text-xs sm:mt-4 sm:text-sm">
      <a
        aria-label="Go to GitHub project page"
        className={linkClass}
        href={SITE.github}
        onClick={handleBlur}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconGithub fontSize={15} />
      </a>
      <a
        aria-label={`Visit ${SITE.author}'s website`}
        className={linkClass}
        href={SITE.website}
        onClick={handleBlur}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconWorld fontSize={16} />
      </a>
      <a
        aria-label={`Send email to ${SITE.email}`}
        className={linkClass}
        href={`mailto:${SITE.email}`}
        onClick={handleBlur}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconMail fontSize={16} />
      </a>
      <a
        className="cursor-pointer rounded-md px-2 py-1.5 text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        href={SITE.website}
        onClick={handleBlur}
        rel="noopener noreferrer"
        target="_blank"
      >
        @{SITE.author}
      </a>
      <span className="hidden select-none rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs sm:inline">
        Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
      </span>
    </footer>
  );
};

export default Footer;
