<div align=center>
<img src="src/assets/logo.svg"/>
</div>

<h1 align="center">
  Type to Learn
</h1>

<p align="center">
  <a href="./docs/README_EN.md">English</a>
  <a href="./docs/README_JP.md">日本語</a>
</p>

<p align="center">
  English learning software designed for keyboard workers
</p>

<p align="center" style="display: flex; justify-content: center; gap: 10px;">
  <a href="https://github.com/kazimkayhan/type-to-learn/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kazimkayhan/type-to-learn" alt="License"></a>
  <a><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/></a>
  <a><img src="https://img.shields.io/badge/Powered%20by-React-blue"/></a>
  <a><img src="https://img.shields.io/github/stars/kazimkayhan/type-to-learn"/></a>
  <a><img src="https://img.shields.io/github/forks/kazimkayhan/type-to-learn"/></a>
</p>

<div align=center>
<img src="docs/Screenshot.png"/>
</div>

## 📸 Live Demo

**GitHub Pages**: <https://kazimkayhan.github.io/type-to-learn/>

<br />

## ✨ Design Philosophy

This software is designed for keyboard workers who use English as their primary working language. Many people experience faster typing speeds in their native language compared to English, because years of native language input have built strong muscle memory 💪, while English input muscle memory is relatively weaker, leading to "typing hesitation" when inputting English.

To consolidate English skills, continuous vocabulary memorization is necessary 📕. This software combines English word memorization with English keyboard input muscle memory training, allowing you to consolidate muscle memory while memorizing words.

To avoid forming incorrect muscle memory, the design requires users to re-enter words if they make mistakes, ensuring correct muscle memory is maintained.

The software is also helpful for people taking computer-based English exams.

**For Coders**:

Built-in dictionaries of commonly used programming words help you practice work-related vocabulary and improve input speed. It also includes APIs for various programming languages to help programmers quickly familiarize themselves with common APIs. More language APIs are being added continuously...

<div align=center>
<img src="docs/coder.png"/>
</div>

<br />
<br />

## 🛠 Features

### Dictionaries

Built-in common dictionaries including CET-4, CET-6, GMAT, GRE, IELTS, SAT, TOEFL, Graduate Entrance Exam English, TEM-4, TEM-8, as well as programmer common words and API dictionaries for multiple programming languages. The goal is to meet most users' vocabulary memorization needs. Community contributions of more dictionaries are welcome.
<br />
<br />

### Phonetic Display & Pronunciation

Helps users memorize pronunciation and phonetic symbols while memorizing words.

<div align=center>
<img src="docs/phonetic.jpeg"/>
</div>
<br />
<br />

### Dictation Mode

After completing a chapter, users are prompted to dictate the chapter to reinforce the learned words.

<div align=center>
<img src="docs/dictation.png"/>
</div>
<br />
<br />

### Speed & Accuracy Display

Quantifies user input speed and accuracy, allowing users to perceive their skill improvement.

<div align=center>
<img src="docs/speed.jpeg"/>
</div>
<br />
<br />

## How to Contribute

### Contributing Code

[Contribution Guidelines](./docs/CONTRIBUTING.md)

### Contributing Dictionaries

[Import Dictionaries](./docs/toBuildDict.md)

## Running the Project

This project is developed based on `React` and requires a Node.js environment to run.

### Environment Setup

1. NodeJS
2. Git
3. pnpm

> **Verify if you have the required environment**
>
> 1. Manual verification  
>    Execute the following commands in the command line to see if corresponding versions are output
>
>    ```sh
>    node --version
>    git --version
>    pnpm --version
>    ```

If any environment is missing, refer to the official documentation for installation:

> - [NodeJS](https://nodejs.org/en/download)
> - [Git](https://git-scm.com/downloads)
> - [pnpm](https://pnpm.io/installation)

### Manual Installation

1. Execute `git clone https://github.com/kazimkayhan/type-to-learn.git` in the command line to pull the project locally
2. Execute `cd type-to-learn` in the command line to enter the project root directory, then execute `pnpm install` to download dependencies
3. Execute `pnpm start` to start the project. The default project address is `http://localhost:5173/`
4. Open `http://localhost:5173/` in your browser to access the project

<br />

## 📕 Dictionary List

- CET-4
- CET-6
- GMAT
- GRE
- IELTS
- SAT
- TOEFL
- Graduate Entrance Exam English
- TEM-4 English
- TEM-8 English
- Coder Dict - Programmer common words
- High School Entrance Exam
- College Entrance Exam
- Business English
- BEC
- PEP English Grades 3-9
- IELTS Wang Lu Listening Corpus [@Saigyouji_WKKun](https://github.com/ggehuliang)
- Japanese common words, N1 ~ N5 [@xiaojia](https://github.com/wetery)
- Kazakh Basic 3000 words (Hapin version) source from [@Elgar](https://github.com/Elgar17) supported by [@Herbert He](https://github.com/HerbertHe) through [Hapin](https://ha-pin.js.org) technology

If you need to memorize other dictionaries, please submit an Issue

<br />
<br />

## 📗 API Dictionaries

- JavaScript API. [@sdu-gyf](https://github.com/sdu-gyf)
- Node.js API. [@chrysalis1215](https://github.com/chrysalis1215)
- Java API. [@darkSheep](https://github.com/darkSheep404)
- Linux Command. [@归谜](https://github.com/vhxubo)
- C#: List API [@nidbCN](https://github.com/nidbCN)

API dictionaries currently depend mainly on community contributions. If you want to contribute your own API dictionary, please refer to the contribution guidelines.

<br />
<br />

## 🎙 Features & Suggestions

The project is in active development with new features being continuously added. If you have any feature requests or suggestions, please submit them in Issues.

If you like the design philosophy of this software, contributions via pull requests are welcome. Thank you for your support!
<br />
<br />

## 🏄‍♂️ Contribution Guide

If you're interested in this project, contributions are very welcome. We will provide as much help as possible.

Before contributing, we hope you read our development plans in the Issues to understand our current direction. We welcome you to work on planned tasks, work labeled "Help Wanted" in Issues, or implement your own ideas.

If you've decided on work you want to contribute, please submit a draft PR after making basic progress so we can discuss it and gather feedback from other collaborators.

Thank you again for your contribution! 🎉

<br />

## 👨‍💻 Contributors

<a href="https://github.com/kazimkayhan/type-to-learn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kazimkayhan/type-to-learn" />
</a>

## 🎁 Acknowledgments

### Inspiration

[Keybr](https://www.keybr.com/)
A typing website known for its algorithm that generates "pseudo-English" based on user accuracy and speed for each letter, helping users focus on practicing slower letters. It can generate complete analysis reports based on user input history.

This is the core inspiration for this project. While Keybr is more targeted at native English speakers, I felt that while practicing with Keybr, the generated pseudo-English could practice typing individual letters and syllables, but didn't improve word mastery for non-native speakers, which led to this project.

[Typing Academy](https://www.typing.academy)
An excellent typing practice website. Its excellent UI style and display of speed and accuracy greatly influenced this project's UI design.

[react-code-game](https://github.com/webzhd/react-code-game)
A very cool open-source project implemented in TypeScript, allowing practice of JavaScript built-in APIs while practicing typing. The idea of adding code API practice came from this project.
<br/><br/>

### Open Source Projects

[React](https://github.com/facebook/react) & [CRA](https://github.com/facebook/create-react-app)
Complete and detailed documentation that is very beginner-friendly. React documentation is the best I've read during my self-learning journey, solving most problems encountered. Thank you to React for its contributions to the open-source world, building a great foundation for beginners to create excellent software.

[Tailwindcss](https://tailwindcss.com/docs)
Without Tailwind, this project would have been delayed even longer. Tailwind's design philosophy solves the fear CSS beginners have of writing complex CSS, allowing newcomers to design UI in a very comfortable way.
<br/><br/>

### Data Sources

Dictionary data from [kajweb](https://github.com/kajweb/dict), a project that crawled common dictionaries, which gave hope for implementing this project.

Voice data from [Youdao Dictionary](https://www.youdao.com/) open API. Thanks to Youdao for allowing small projects like this to use professional pronunciation resources. Thanks to the Youdao team and Kao Shen team for their important contributions to Chinese education and international exchange.

JS API from [react-code-game](https://github.com/webzhd/react-code-game). Thanks to the project for crawling and preprocessing JS APIs.
<br/><br/>

### Project Icon

Thanks to [libregd](https://github.com/libregd) for providing icon designs, contributing multiple beautiful icon design options to the project, and providing design, suggestions, future planning and many other supports during the project.

## 🌟 Stargazers over time

[![Stargazers over time](https://starchart.cc/kazimkayhan/type-to-learn.svg)](https://starchart.cc/kazimkayhan/type-to-learn)

---

## 📝 License & Attribution

This project is a fork based on [Qwerty Learner](https://github.com/RealKai42/qwerty-learner) by [Kaiyi](https://github.com/RealKai42). The original project is licensed under the GPL-3.0 license. This fork maintains the same license and acknowledges the original authors' work.

**Original Project**: [RealKai42/qwerty-learner](https://github.com/RealKai42/qwerty-learner)
**This Fork**: [kazimkayhan/type-to-learn](https://github.com/kazimkayhan/type-to-learn)
**Maintained by**: Kazim Kayhan
**Website**: [kazimjan.com](https://kazimjan.com)
**Contact**: email4kazim@gmail.com
