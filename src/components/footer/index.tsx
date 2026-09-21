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
          className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
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
          className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400"
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
          className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400"
          fontSize={16}
        />
      </a>
      <a
        className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        href={SITE.website}
        rel="noopener noreferrer"
        target="_blank"
      >
        @{SITE.author}
      </a>
      <span className="hidden select-none rounded bg-slate-200 px-1 text-slate-600 text-xs sm:inline dark:bg-slate-800 dark:text-slate-400">
        Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
      </span>
    </footer>
  );
};

export default Footer;
