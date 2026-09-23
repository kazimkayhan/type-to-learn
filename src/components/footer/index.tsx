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

  return (
    <footer
      className="mt-3 mb-1 flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 px-3 text-xs ease-in sm:mt-4 sm:text-sm"
      onClick={handleBlur}
    >
      <a
        aria-label="Go to GitHub project page"
        href={SITE.github}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconGithub
          className="text-muted-foreground hover:text-foreground"
          fontSize={15}
        />
      </a>
      <a
        aria-label={`Visit ${SITE.author}'s website`}
        href={SITE.website}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconWorld
          className="text-muted-foreground hover:text-primary"
          fontSize={16}
        />
      </a>
      <a
        aria-label={`Send email to ${SITE.email}`}
        href={`mailto:${SITE.email}`}
        onClick={handleBlur}
        rel="noopener noreferrer"
        target="_blank"
      >
        <IconMail
          className="text-muted-foreground hover:text-primary"
          fontSize={16}
        />
      </a>
      <a
        className="cursor-pointer text-muted-foreground hover:text-foreground"
        href={SITE.website}
        rel="noopener noreferrer"
        target="_blank"
      >
        @{SITE.author}
      </a>
      <span className="hidden select-none rounded bg-muted px-1 text-muted-foreground text-xs sm:inline">
        Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
      </span>
    </footer>
  );
};

export default Footer;
