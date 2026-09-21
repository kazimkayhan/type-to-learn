import type React from "react";
import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { SITE } from "@/constants";

const Header: React.FC<PropsWithChildren> = ({ children }) => (
  <header className="container z-20 mx-auto w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-5">
    <div className="flex w-full flex-col items-center justify-between gap-3 xl:flex-row">
      <NavLink
        className="flex items-center rounded-lg font-bold text-indigo-500 text-xl no-underline hover:no-underline focus-visible:ring-2 focus-visible:ring-indigo-400 sm:text-2xl lg:text-3xl"
        to="/"
      >
        <img
          alt=""
          className="mr-2 h-10 w-10 sm:mr-3 sm:h-12 sm:w-12"
          height={48}
          src={logo}
          width={48}
        />
        <h1 className="text-wrap">{SITE.name}</h1>
      </NavLink>
      <nav className="my-card flex w-full max-w-full flex-wrap items-center justify-center gap-2 rounded-xl bg-white p-2 transition-colors duration-300 sm:gap-3 sm:p-3 xl:w-auto xl:justify-end dark:bg-gray-800">
        {children}
      </nav>
    </div>
  </header>
);

export default Header;
