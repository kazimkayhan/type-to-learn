import type React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";
import { SITE } from "@/constants";

const features = [
  {
    description:
      "See IPA and hear pronunciation while you type, so spelling and sound stick together.",
    title: "Phonetics and pronunciation",
  },
  {
    description:
      "After each chapter, dictate the same words to lock them in without looking.",
    title: "Dictation mode",
  },
  {
    description:
      "Track WPM, accuracy, and progress so you can see improvement over time.",
    title: "Live speed and accuracy",
  },
  {
    description:
      "Practice CET, IELTS, TOEFL, GRE, and developer dictionaries from one place.",
    title: "Exam and developer dictionaries",
  },
];

const MobilePage: React.FC = () => (
  <div className="flex min-h-dvh w-full flex-col bg-white pb-[env(safe-area-inset-bottom)]">
    <header className="flex items-center justify-between border-gray-100 border-b px-4 py-4 sm:px-6">
      <Link className="flex items-center gap-3" to="/">
        <img alt="" className="h-10 w-10" height={40} src={logo} width={40} />
        <div className="flex flex-col">
          <span className="font-semibold text-indigo-500 text-lg tracking-tight">
            {SITE.name}
          </span>
          <span className="text-gray-500 text-xs">by {SITE.author}</span>
        </div>
      </Link>
      <Link
        className="flex min-h-11 items-center rounded-xl bg-gray-900 px-4 py-2.5 font-medium text-sm text-white hover:bg-gray-800"
        to="/"
      >
        Start practicing
      </Link>
    </header>

    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
      <h1 className="text-pretty font-bold text-4xl text-gray-900 tracking-tight sm:text-5xl">
        English practice for people who type all day
      </h1>
      <p className="mt-5 max-w-2xl text-gray-600 text-lg leading-relaxed">
        Type to Learn combines vocabulary review with keyboard muscle memory.
        Mistyped words must be retyped so you keep building the right habit.
      </p>
      <Link
        className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800"
        to="/"
      >
        Open the practice app
      </Link>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        {features.map((item) => (
          <article
            className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
            key={item.title}
          >
            <h2 className="font-semibold text-gray-900 text-lg">
              {item.title}
            </h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </main>

    <footer className="px-6 py-8 text-center text-gray-500 text-sm">
      <a
        className="hover:text-gray-800"
        href={SITE.github}
        rel="noopener noreferrer"
        target="_blank"
      >
        View on GitHub
      </a>
    </footer>
  </div>
);

export default MobilePage;
