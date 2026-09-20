import { SITE } from '@/constants'
import type React from 'react'
import IconMail from '~icons/material-symbols/mail'
import IconGithub from '~icons/simple-icons/github'
import IconWorld from '~icons/tabler/world'

const Footer: React.FC = () => {
  return (
    <footer
      className="mb-1 mt-3 flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 px-3 text-xs ease-in sm:mt-4 sm:text-sm"
      onClick={(e) => e.currentTarget.blur()}
    >
      <a href={SITE.github} target="_blank" rel="noreferrer" aria-label="Go to GitHub project page">
        <IconGithub fontSize={15} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100" />
      </a>
      <a href={SITE.website} target="_blank" rel="noreferrer" aria-label={`Visit ${SITE.author}'s website`}>
        <IconWorld fontSize={16} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
      </a>
      <a
        href={`mailto:${SITE.email}`}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.currentTarget.blur()}
        aria-label={`Send email to ${SITE.email}`}
      >
        <IconMail fontSize={16} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
      </a>
      <a
        className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        href={SITE.website}
        target="_blank"
        rel="noreferrer"
      >
        @ {SITE.author}
      </a>
      <span className="hidden select-none rounded bg-slate-200 px-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:inline">
        Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
      </span>
    </footer>
  )
}

export default Footer
