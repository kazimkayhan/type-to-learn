import type React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
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
  <div className="flex min-h-dvh w-full flex-col bg-background pb-[env(safe-area-inset-bottom)]">
    <header className="flex items-center justify-between border-border/60 border-b px-4 py-4 sm:px-6">
      <Link
        className="flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-ring"
        to="/"
      >
        <img alt="" className="h-10 w-10" height={40} src={logo} width={40} />
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-primary tracking-tight">
            {SITE.name}
          </span>
          <span className="text-muted-foreground text-xs">
            by {SITE.author}
          </span>
        </div>
      </Link>
      <Link
        className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground text-sm transition-colors duration-150 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to="/"
      >
        Start practicing
      </Link>
    </header>

    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12 sm:py-16">
      <p className="font-semibold text-primary text-sm tracking-tight">
        {SITE.name}
      </p>
      <h1 className="mt-3 text-pretty font-bold text-4xl text-foreground tracking-tight sm:text-5xl">
        English practice for people who type all day
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        Type to Learn combines vocabulary review with keyboard muscle memory.
        Mistyped words must be retyped so you keep building the right habit.
      </p>
      <Link
        className="mt-8 inline-flex min-h-12 w-fit cursor-pointer items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        to="/"
      >
        Open the practice app
      </Link>

      <section className="mt-16 grid gap-8 sm:grid-cols-2 sm:gap-10">
        {features.map((item) => (
          <article className="min-w-0" key={item.title}>
            <h2 className="font-semibold text-foreground text-lg">
              {item.title}
            </h2>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </main>

    <footer className="px-6 py-8 text-center text-muted-foreground text-sm">
      <a
        className="rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
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
