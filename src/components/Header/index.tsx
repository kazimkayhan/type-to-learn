import logo from '@/assets/logo.svg'
import { SITE } from '@/constants'
import type { PropsWithChildren } from 'react'
import type React from 'react'
import { NavLink } from 'react-router-dom'

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="container z-20 mx-auto w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-6">
      <div className="flex w-full flex-col items-center justify-between gap-3 lg:flex-row lg:space-y-0">
        <NavLink
          className="flex items-center text-xl font-bold text-indigo-500 no-underline hover:no-underline sm:text-2xl lg:text-4xl"
          to="/"
        >
          <img src={logo} className="mr-2 h-10 w-10 sm:mr-3 sm:h-12 sm:w-12 lg:h-16 lg:w-16" alt={`${SITE.name} Logo`} />
          <h1>{SITE.name}</h1>
        </NavLink>
        <nav className="my-card flex w-full max-w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto rounded-xl bg-white p-2 transition-colors duration-300 dark:bg-gray-800 sm:w-auto sm:flex-wrap sm:justify-end sm:gap-3 sm:p-4">
          {children}
        </nav>
      </div>
    </header>
  )
}

export default Header
