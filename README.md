<div align="center">
  <img src="src/assets/logo.svg" alt="Type to Learn logo" width="96" />
</div>

<h1 align="center">Type to Learn</h1>

<p align="center">
  <strong>Memorize vocabulary while building English typing muscle memory.</strong><br />
  Built for keyboard workers who think in another language and type in English.
</p>

<p align="center">
  <a href="https://kazimkayhan.github.io/type-to-learn/"><strong>Live demo</strong></a>
  ·
  <a href="#features">Features</a>
  ·
  <a href="#dictionaries">Dictionaries</a>
  ·
  <a href="#getting-started">Getting started</a>
  ·
</p>

<p align="center">
  <a href="https://github.com/kazimkayhan/type-to-learn/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kazimkayhan/type-to-learn" alt="License" /></a>
  <a href="https://github.com/kazimkayhan/type-to-learn/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## Why Type to Learn?

If English is not your first language, you may type fluently in your native language but hesitate in English. Years of native-language input build strong [muscle memory](https://en.wikipedia.org/wiki/Muscle_memory); English often does not.

Type to Learn combines two habits that usually compete for your time:

1. **Vocabulary practice** — learn and review words in focused chapters  
2. **Typing practice** — reinforce correct finger patterns while you learn

If you mistype a letter, you must re-enter the whole word. That constraint is intentional: it protects correct muscle memory instead of letting errors stick.

It is especially useful for:

- People who write English on a keyboard every day  
- Candidates for computer-based exams (TOEFL, GRE, IELTS, and similar)  
- Developers who want faster, more accurate English (and API) typing  

## Features

### Built-in dictionaries

Hundreds of word lists covering exams, school English, professional vocab, and coding APIs. Switch dictionaries and chapters from an in-app gallery.

### IPA and pronunciation

See [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet) where available and play pronunciation while you practice spelling.

### Dictation mode

After you finish a chapter, practice the same words with the spelling hidden to lock in recall.

### Speed and accuracy

Live WPM, accuracy, and input stats so progress is visible, not guessed.

### Error book and review

Mistyped words are collected so you can review weak spots and run dedicated error-review sessions.

### Dark mode and shortcuts

Dark theme, keyboard shortcuts, sound feedback, loop-word practice, and a chapter word list drawer — tuned for long practice sessions.

## Dictionaries

Examples of what ships in the app:

| Area | Examples |
| --- | --- |
| **China exams** | CET-4, CET-6, TEM-4, TEM-8, postgraduate English |
| **International exams** | TOEFL, IELTS, GRE, GMAT, SAT, BEC, PTE, TOEIC |
| **Youth / school** | Gaokao lists, New Concept English, textbook series |
| **Coding** | Common programmer English, JS / Node / Java / C# / Go / Python / Rust APIs, Linux commands |
| **Other languages** | Japanese (N1–N5), German, Indonesian, Kazakh |

Browse everything in the app’s **Dictionaries** gallery, or inspect the catalog in [`src/resources/dictionary.ts`](./src/resources/dictionary.ts).

Need a list that is not included? Open an [issue](https://github.com/kazimkayhan/type-to-learn/issues) or contribute a dictionary — see [Adding dictionaries](./docs/toBuildDict.md).

## Tech stack

- **Vite** + **React 19** + **TypeScript**  
- **Tailwind CSS** + **Base UI / shadcn-style** components  
- **Jotai** for client state (with local persistence)  
- **Dexie** for local progress / error history  
- Deployed to **GitHub Pages** from `master`

## Getting started

### Requirements

- Node.js **≥ 26**  
- pnpm **≥ 9** (this repo uses `pnpm@12.4.2`)  
- Git  

```sh
node --version
pnpm --version
git --version
```

Install tools if needed: [Node.js](https://nodejs.org/en/download) · [pnpm](https://pnpm.io/installation) · [Git](https://git-scm.com/downloads)

### Install and run

```sh
git clone https://github.com/kazimkayhan/type-to-learn.git
cd type-to-learn
pnpm install
pnpm dev
```

Open the URL Vite prints (typically **`http://localhost:5173/type-to-learn/`**).  
The `/type-to-learn/` path is the GitHub Pages base path and is used in local development as well.

### Useful scripts

| Command | Description |
| --- | --- |
| `pnpm dev` / `pnpm start` | Start the Vite dev server |
| `pnpm build` | Production build for GitHub Pages (`base=/type-to-learn/`) |
| `pnpm check` | Lint / format check via Ultracite |
| `pnpm fix` | Auto-fix Ultracite issues |

Build output goes to the `build/` directory.

## Contributing

Contributions are welcome — code, dictionaries, docs, and bug reports.

1. Read the [contribution guidelines](./docs/CONTRIBUTING.md)  
2. Discuss larger changes in a GitHub Issue first  
3. Fork, branch, and open a pull request against `master`  
4. To add a word list, follow [Adding dictionaries](./docs/toBuildDict.md)

```sh
pnpm check
pnpm build
```

## License

This project is released under the [GPL-3.0](./LICENSE) license.

## Author

**Kazim Kayhan**

- Website: [kazimjan.com](https://www.linkedin.com/in/kazimkayhan)  
- GitHub: [@kazimkayhan](https://github.com/kazimkayhan)  
- Email: [email4kazim@gmail.com](mailto:email4kazim@gmail.com)

---

<p align="center">
  If Type to Learn helps you, consider starring the repo — it helps others find the project.
</p>
