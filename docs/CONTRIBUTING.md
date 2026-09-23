# Contributing to Type to Learn

Thank you for your interest in contributing to **Type to Learn**! 🎉

Type to Learn is an open-source English learning application that combines vocabulary practice with English typing training. Contributions of all sizes are welcome, including code, dictionaries, documentation, bug reports, feature ideas, and improvements to the user experience.

Our goal is to keep the project useful, maintainable, accessible, and welcoming to contributors of all experience levels.

---

## Table of Contents

* [Ways to Contribute](#ways-to-contribute)
* [Before You Start](#before-you-start)
* [Development Environment](#development-environment)
* [Getting the Project Running](#getting-the-project-running)
* [Making Changes](#making-changes)
* [Code Style](#code-style)
* [Adding a Dictionary](#adding-a-dictionary)
* [Testing Your Changes](#testing-your-changes)
* [Submitting a Pull Request](#submitting-a-pull-request)
* [Pull Request Guidelines](#pull-request-guidelines)
* [Reporting Bugs](#reporting-bugs)
* [Suggesting Features](#suggesting-features)
* [Dictionary Requests](#dictionary-requests)
* [Using AI Tools](#using-ai-tools)
* [Licensing and Content](#licensing-and-content)
* [Community Guidelines](#community-guidelines)
* [Getting Help](#getting-help)

---

## Ways to Contribute

There are many ways to help Type to Learn:

* 🐛 **Report bugs** and help us reproduce problems
* 💡 **Suggest features** and improvements
* 💻 **Contribute code** and fix existing issues
* 📚 **Add dictionaries** and vocabulary resources
* 📝 **Improve documentation**
* 🎨 **Improve the UI/UX**
* ♿ **Improve accessibility**
* 🌍 **Improve localization and language support**
* 🧪 **Add or improve tests when appropriate**
* 🔍 **Review existing Pull Requests**

Small contributions matter too. Fixing a typo, improving an explanation, or correcting a dictionary entry can be just as useful as a large code change.

---

## Before You Start

For larger changes, please open or join a GitHub Issue before starting development.

This helps us:

* discuss the proposed approach;
* make sure the change fits the project's goals;
* avoid duplicate work;
* identify technical considerations early.

For small fixes such as typos, documentation improvements, or straightforward bug fixes, you may open a Pull Request directly.

Please check the existing Issues and Pull Requests before starting work.

---

## Development Environment

Type to Learn is built with:

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Jotai**
* **Dexie**
* **pnpm**

### Requirements

You will need:

* **Node.js 26 or newer**
* **pnpm**
* **Git**

The repository currently uses `pnpm@12.4.2`.

You can verify your environment with:

```sh
node --version
pnpm --version
git --version
```

---

## Getting the Project Running

Fork the repository to your GitHub account and clone your fork:

```sh
git clone https://github.com/YOUR_USERNAME/type-to-learn.git
cd type-to-learn
```

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Vite will provide a local URL, typically:

```text
http://localhost:5173/type-to-learn/
```

The `/type-to-learn/` path is important because the application is deployed under that base path on GitHub Pages.

---

## Making Changes

Create a dedicated branch for your work.

For example:

```sh
git checkout -b feat/add-new-practice-mode
```

Other examples:

```sh
git checkout -b fix/incorrect-word-display
git checkout -b docs/update-contributing-guide
git checkout -b dict/add-business-english
```

Please do not commit directly to `master`.

Keep each branch focused on one logical change. Avoid mixing unrelated refactoring, formatting changes, feature work, and bug fixes in the same Pull Request unless they are directly related.

---

## Code Style

Please follow the existing code style and project conventions.

Before submitting your Pull Request, run:

```sh
pnpm check
```

To automatically fix supported formatting and style issues:

```sh
pnpm fix
```

You can also format the project with:

```sh
pnpm prettier
```

The repository uses automated tooling, including ESLint, Ultracite, Prettier, Husky, and lint-staged. Please allow these tools to format and validate your changes rather than manually introducing a different style.

### General coding guidelines

* Prefer clear and readable TypeScript.
* Reuse existing components and utilities when appropriate.
* Avoid unnecessary duplication.
* Keep components focused and maintainable.
* Avoid introducing dependencies unless they provide meaningful value.
* Preserve existing functionality unless the change intentionally modifies it.
* Consider keyboard users and accessibility when changing the interface.
* Keep user-facing text clear and consistent.
* Avoid unrelated changes in the same Pull Request.

---

## Adding a Dictionary

Dictionary contributions are especially welcome. 📚

Please read the dedicated guide before adding a dictionary:

**[How to Import a New Dictionary](./toBuildDict.md)**

In general, dictionaries should:

1. Use the required JSON structure.
2. Be placed in `public/dicts/`.
3. Be registered in `src/resources/dictionary.ts`.
4. Have a unique dictionary `id`.
5. Have accurate metadata.
6. Contain valid JSON.
7. Be tested locally before submitting the Pull Request.

The expected dictionary format is:

```json
[
  {
    "name": "example",
    "trans": ["definition"]
  }
]
```

Before contributing a dictionary, make sure you have the legal right to redistribute its contents.

Do **not** add copyrighted dictionary data that you do not have permission to redistribute.

When possible, include the original dictionary source and relevant licensing information in the Pull Request description.

---

## Testing Your Changes

Before opening a Pull Request, make sure the project builds successfully:

```sh
pnpm check
pnpm build
```

Then run the application locally:

```sh
pnpm dev
```

Manually verify the areas affected by your changes.

For UI changes, check at least:

* normal usage;
* keyboard interaction;
* responsive layouts;
* light and dark themes when relevant;
* existing functionality that could be affected.

For dictionary changes, verify:

* the dictionary appears in the dictionary list;
* the correct word count is shown;
* words can be loaded and practiced;
* chapters behave correctly;
* pronunciation or related metadata still works when applicable.

### Current test command

The repository currently does not contain an automated test suite. The `pnpm test` script is therefore not a substitute for manual verification.

When adding meaningful functionality, contributors are encouraged to add automated tests when the project architecture supports them.

---

## Submitting a Pull Request

Once your changes are ready:

### 1. Make sure your branch is up to date

```sh
git fetch origin
git rebase origin/master
```

Resolve any conflicts and verify the project still works.

### 2. Commit your changes

Use clear and descriptive commit messages.

Examples:

```text
feat: add business English dictionary
fix: correct chapter progress calculation
docs: improve dictionary contribution guide
refactor: simplify vocabulary loading
```

### 3. Push your branch

```sh
git push origin feat/add-new-practice-mode
```

### 4. Open a Pull Request

Create a Pull Request against the repository's:

```text
master
```

branch.

### 5. Describe your change clearly

Please explain:

* what you changed;
* why you changed it;
* which Issue it addresses, if applicable;
* how you tested it;
* any limitations or follow-up work.

For example:

```text
Fixes #123
```

or:

```text
Closes #123
```

When appropriate, use a **Draft Pull Request** early for larger changes so that implementation details can be discussed before the work is finalized.

---

## Pull Request Guidelines

A good Pull Request should be:

### Focused

Keep the PR about one feature, bug, dictionary, or documentation improvement whenever possible.

### Understandable

Explain the problem and the solution clearly.

### Tested

Include the commands you ran and describe important manual testing.

### Minimal

Avoid unrelated formatting changes, file renaming, or large refactors unless they are necessary for the change.

### Reviewable

Large changes should be split into smaller logical commits or Pull Requests when practical.

---

## Reporting Bugs

Before opening a bug report:

1. Check whether the problem has already been reported.
2. Make sure you are using a current version.
3. Try to reproduce the issue consistently.

A useful bug report should include:

* a clear description of the problem;
* steps to reproduce it;
* expected behavior;
* actual behavior;
* browser and operating system information when relevant;
* screenshots or recordings when useful;
* console errors or other relevant logs.

Example:

```text
### Bug

Words disappear after switching dictionaries.

### Steps to Reproduce

1. Open the Dictionaries page.
2. Select Dictionary A.
3. Start a chapter.
4. Switch to Dictionary B.
5. Return to the previous chapter.

### Expected Behavior

The previous chapter should retain its progress.

### Actual Behavior

The chapter starts from the beginning.
```

---

## Suggesting Features

Feature requests are welcome.

Before proposing a feature, consider whether it supports the core purpose of Type to Learn: combining vocabulary learning with accurate English typing practice.

A useful feature request should explain:

* the problem you are trying to solve;
* who would benefit from the feature;
* how you expect it to work;
* possible alternatives;
* screenshots or examples when useful.

For larger features, opening an Issue for discussion before implementation is strongly recommended.

---

## Dictionary Requests

Need a dictionary but do not know how to add it yourself?

Open a GitHub Issue with:

```text
Dictionary Request: [Dictionary Name]
```

Please include:

* dictionary name;
* language;
* intended audience or purpose;
* source;
* download or reference link;
* licensing information when available.

If you have the original source file, attach it to the Issue when possible.

Contributors can then help convert and integrate the dictionary into the project.

---

## Using AI Tools

AI-assisted development is allowed and can be useful for:

* understanding unfamiliar code;
* generating boilerplate;
* converting dictionary data;
* improving documentation;
* debugging;
* exploring implementation ideas.

However, contributors are responsible for everything they submit.

Before opening a Pull Request:

* review all AI-generated code;
* verify that it is correct;
* understand the changes you are submitting;
* check for fabricated APIs, dependencies, or documentation;
* ensure that generated content does not violate copyright or licensing requirements;
* run the project's formatting, validation, and build checks.

Do not submit large amounts of unreviewed AI-generated code simply to increase the size of a contribution.

The contributor remains responsible for the final result.

---

## Licensing and Content

Type to Learn is released under the **GPL-3.0** license.

By contributing code or other material, you agree that your contribution may be distributed as part of the project under the applicable project license.

For third-party content such as dictionaries, pronunciation resources, word lists, images, audio, or other datasets, you must have the necessary rights or permission to contribute that material.

When third-party content has specific licensing requirements, document those requirements clearly in your Pull Request.

When you are unsure whether a resource can legally be included, do not submit it until its licensing status has been verified.

---

## Community Guidelines

Please help keep Type to Learn welcoming and productive.

We expect contributors to:

* treat other contributors with respect;
* communicate professionally;
* welcome different levels of experience;
* accept constructive feedback;
* focus discussions on the project;
* explain disagreements respectfully;
* avoid personal attacks, harassment, or insulting language;
* avoid deliberately destructive or malicious contributions.

A technical disagreement is normal. Personal attacks are not.

---

## Getting Help

You do not need to be an expert to contribute.

For questions, ideas, or difficulties:

* open a GitHub Issue;
* comment on an existing Issue;
* participate in Pull Request discussions.

When asking for help, provide enough context for others to understand the problem, including relevant error messages, commands, screenshots, or code excerpts when appropriate.

---

## A Simple Contribution Workflow

For most contributions, the process looks like this:

```text
Fork
  ↓
Clone
  ↓
Create a branch
  ↓
Make your changes
  ↓
Test locally
  ↓
pnpm check
  ↓
pnpm build
  ↓
Commit
  ↓
Push
  ↓
Open Pull Request
  ↓
Review
  ↓
Address feedback
  ↓
Merge 🎉
```

---

## Thank You ❤️

Every contribution helps make Type to Learn better.

Whether you submit a one-line documentation fix, a new dictionary, a bug fix, an accessibility improvement, or a major feature, your effort is appreciated.

Thank you for helping build Type to Learn with the open-source community! 🚀
