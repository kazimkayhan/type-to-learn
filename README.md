<div align=center>
<img  src="src/assets/logo.svg"/>
</div>

<h1 align="center">
  Type to Learn
</h1>

<p align="center">
  <a href="./docs/README_EN.md">English</a>
  <a href="./docs/README_JP.md">日本語</a>
</p>

<p align="center">
  为键盘工作者设计的单词记忆与英语肌肉记忆锻炼软件
</p>

<p align="center" style="display: flex; justify-content: center; gap: 10px;">
  <a href="https://github.com/kazimkayhan/type-to-learn/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kazimkayhan/type-to-learn" alt="License"></a>
  <a><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/></a>
  <a><img src="https://img.shields.io/badge/Powered%20by-Vite-646CFF"/></a>
</p>

<div align=center>
<img  src="docs/Screenshot.png"/>
</div>

## 📸 在线访问

**GitHub Pages**: <https://kazimkayhan.github.io/type-to-learn/>

<br />

## ✨ 设计思想

软件设计的目标群体为以英语作为主要工作语言的键盘工作者。部分人会出现输入母语时的打字速度快于英语的情况，因为多年的母语输入练就了非常坚固的肌肉记忆 💪，而英语输入的肌肉记忆相对较弱，易出现输入英语时“提笔忘字”的现象。

同时为了巩固英语技能，也需要持续的背诵单词 📕，本软件将英语单词的记忆与英语键盘输入的肌肉记忆的锻炼相结合，可以在背诵单词的同时巩固肌肉记忆。

为了避免造成错误的肌肉记忆，设计上如果用户单词输入错误则需要重新输入单词，尽可能确保用户维持正确的肌肉记忆。

软件也对需要机考英语的人群有一定的帮助。

**For Coder**：

内置了程序员工作常用单词的词库，方便练习工作中常用的单词、提高输入速度。也内置了诸多语言的 API 的练习，帮助以程序员快速熟悉常用的 API，更多语言的 API 正在逐步添加中...

<div align=center>
<img  src="https://github.com/Realkai42/qwerty-learner/blob/master/docs/coder.png"/>
</div>

<br />
<br />

## 🛠 功能列表

### 词库

内置了常用的 CET-4 、CET-6 、GMAT 、GRE 、IELTS 、SAT 、TOEFL 、考研英语、专业四级英语、专业八级英语，也有程序员常见英语单词以及多种编程语言 API 等词库。 尽可能满足大部分用户对单词记忆的需求，也非常欢迎社区贡献更多的词库。
<br />
<br />

### 音标显示、发音功能

方便用户在记忆单词时，同时记忆读音与音标。

<div align=center>
<img  src="https://github.com/Realkai42/qwerty-learner/blob/master/docs/phonetic.jpeg"/>
</div>
<br />
<br />

### 默写模式

在用户完成一个章节的练习后，会弹出选项是否默写本章，方便用户巩固本章学习的单词。

<div align=center>
<img  src="https://github.com/Realkai42/qwerty-learner/blob/master/docs/dictation.png"/>
</div>
<br />
<br />

### 速度、正确率显示

量化用户输入的速度和输入的正确率，让用户有感知的了解自己技能的提升

<div align=center>
<img  src="https://github.com/Realkai42/qwerty-learner/blob/master/docs/speed.jpeg"/>
</div>
<br />
<br />

## 如何贡献

### 贡献代码

[贡献准则](./docs/CONTRIBUTING.md)

### 贡献词库

[导入词典](./docs/toBuildDict.md)

## 运行项目

本项目使用 **Vite + React + TypeScript + Tailwind CSS + shadcn/ui** 构建，需要 Node.js 和 pnpm 环境来运行。

### 环境要求

- **Node.js**: >=26
- **pnpm**: >=9 (推荐使用 pnpm@12.4.2)
- **Git**

> **验证环境**
>
> 在命令行下执行以下命令，查看是否有对应版本输出：
>
> ```sh
> node --version
> git --version
> pnpm --version
> ```

如果环境缺失，可以参考以下官方文档进行安装：

- [NodeJS](https://nodejs.org/en/download)
- [Git](https://git-scm.com/downloads)
- [pnpm](https://pnpm.io/installation)

### 安装与运行

1. 克隆项目到本地：
   ```sh
   git clone https://github.com/kazimkayhan/type-to-learn.git
   cd type-to-learn
   ```

2. 安装依赖：
   ```sh
   pnpm install
   ```

3. 启动开发服务器：
   ```sh
   pnpm start
   # 或
   pnpm dev
   ```

4. 在浏览器中打开 `http://localhost:5173/` 访问项目

### 构建部署

构建 GitHub Pages 版本：
```sh
pnpm build
```

构建输出将生成在 `dist/` 目录，并自动配置基础路径为 `/type-to-learn/`

## 📕 词库列表

本项目内置了丰富的词库，包括但不限于：

### 英语学习
- CET-4、CET-6（大学英语四六级）
- GMAT、GRE、IELTS、SAT、TOEFL（留学考试）
- 考研英语、专四、专八
- 高考、中考英语
- 商务英语、BEC
- 新概念英语系列

### 编程相关
- 程序员常用词汇
- JavaScript、Node.js、Java、C#、Go、Python、Rust 等语言 API
- Linux 命令

### 其他语言
- 日语词汇（N1-N5）
- 哈萨克语基础词汇
- 德语、印尼语等

完整词库列表请查看应用内的词典选择界面，或访问 `src/resources/dictionary.ts` 文件。

如果您需要其他词库，欢迎通过 GitHub Issues 提出或贡献词典。

<br />

## 🏄‍♂️ 贡献指南

如果您对本项目感兴趣，我们非常欢迎您的贡献！您可以通过以下方式参与：

- 提交 Issue 报告 bug 或提出功能建议
- 提交 Pull Request 改进代码或添加新功能
- 贡献新的词库（参见 [导入词典](./docs/toBuildDict.md)）

贡献前请阅读 [贡献准则](./docs/CONTRIBUTING.md)。

<br />

## 📄 开源协议

本项目采用 [GPL-3.0](./LICENSE) 协议开源。

## 🙏 致谢

本项目是 [qwerty-learner](https://github.com/RealKai42/qwerty-learner) 的一个分支（fork），感谢原作者及所有贡献者的优秀工作。

## 👤 作者

**Kazim Kayhan**

- 网站: [kazimjan.com](https://kazimjan.com)
- GitHub: [@kazimkayhan](https://github.com/kazimkayhan)
- Email: email4kazim@gmail.com
