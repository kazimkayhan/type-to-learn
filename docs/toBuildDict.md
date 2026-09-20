# 如何导入新的词典 📚

注意，我们的词典主要来源于社区贡献。当你想要导入新的词典时，最好准备好词典的源文件，以便我们能够更好地帮助你。

## 0. 寻求帮助 🤝

### 0.1 如果你没有任何编程基础 🚫💻

我们推荐你通过 GitHub Issues 提出词典需求，描述你需要的词典并提供词典来源，我们的贡献者会帮助你导入词典。

### 0.2 如果你会使用 GitHub 🐙

我们推荐你以 "Dictionary Request" 为标题发起 Issue，描述你的词典需求并提供词典来源。

## 1. 亲自动手！🛠️

### 1.1 词典的目标文件格式 📄

词典的文件格式是 `词典名.json`，其内容结构应当是：

```json
[
    {
        "name" : "xxx" ,
        "trans" : ["xxx", "xxx",...]
    },
    ...
]
```

例如：

```json
[
  { "name": "file", "trans": ["n. 档案,公文箱,锉刀,[计算机] 文件 vt. 列队行进,归档,申请"] },
  {
    "name": "command",
    "trans": [
      "n.命令，指挥； 司令部，指挥部； [计算机]指令； 控制力 vt.指挥，控制，命令； 命令； 应得，值得 vi.给出命令； 命令，指令 adj.指挥的，根据命令（或要求）而作的"
    ]
  },
  { "name": "use", "trans": ["n. 运用,用法,使用权,适用 vt. 使用,利用,对待 vi. 吸毒"] },
  { "name": "program", "trans": ["n. 节目(单),程序,计划 vt. 规划,拟定计划,制作节目"] },
  { "name": "line", "trans": ["n. 行,线,航线,场界,皱纹,家族 vt. &vi. 用做衬里,排成一行,顺...排列 vi. 排成一行,顺...排列,划线于"] },
  { "name": "if", "trans": ["conj. 如果，是否，即使 n. 条件,设想"] }
]
```

#### 1.1.0 如何将词典的源文件转换为目标文件格式？🔄

由于词典的源文件格式、来源各异，我们无法为你提供统一的转换方法，但是我们可以提供一些思路：

#### 1.1.1 使用 ChatGPT 或其他 AI 工具 🤖

你可以将部分词典源文件的内容发送给 ChatGPT 并描述需求，让 AI 生成转换脚本或直接转换格式。

#### 1.1.2 使用在线工具 🔧

你也可以使用在线工具将词典源文件转换为目标文件格式，例如 <https://csvjson.com/csv2json>

#### 1.1.3 手动转换 ✍️

如果内容不多，你也可以手动将词典源文件转换为目标文件格式，或批量交给 AI 工具生成。

#### 1.1.4 如果遇到困难 🔄

如果你在这一步遇到困难，可以回到第 0 部分，通过 GitHub Issues 寻求帮助。

### 1.2 词典的目标文件位置 📍

词典的目标文件位置是 `public/dicts/`，请将处理好的词典文件放置在该目录下。

### 1.3 词典的索引建立 🔍

词典的索引需要在 `src/resources/dictionary.ts` 中添加，格式如下：

```typescript
{
  id: "xxx",
  name: "xxx",
  description: "xxx",
  category: "xxx",
  url: "/dicts/xxx.json",
  length: xxx,
  language: "en",
  languageCategory: "en",
}
```

例如：

```typescript
{
  id: "cet4",
  name: "CET-4",
  description: "College English CET-4 Dictionary",
  category: "China Exams",
  tags: ["College English"],
  url: "/dicts/CET4_T.json",
  length: 2607,
  language: "en",
  languageCategory: "en",
},
{
  id: "cet6",
  name: "CET-6",
  description: "College English CET-6 Dictionary",
  category: "China Exams",
  tags: ["College English"],
  url: "/dicts/CET6_T.json",
  length: 2345,
  language: "en",
  languageCategory: "en",
}
```

其中：
- `id` 需要是所有词典中唯一的
- `name` 是展示给所有用户的词典名
- `description` 是词典描述
- `category` 是词典分类（你可以查看已存在的词典分类，为新词典选择合适的分类）
- `tags` 是词典标签（可选）
- `url` 是词典的文件路径（相对于 `public/` 目录）
- `length` 是词典的单词数量（可以通过运行脚本 `scripts/update-dict-size.js` 来自动计算）
- `language` 表示词典的语言（如 "en", "ja", "zh" 等）
- `languageCategory` 表示词典的语言类别

### 1.4 测试 🧪

使用以下命令安装依赖并启动开发服务器：

```sh
pnpm install
pnpm dev
```

访问 `http://localhost:5173`，如果你的词典已经成功导入，你将在词典列表中看到它。🎉

### 1.5 提交 PR 📝

现在你可以提交 PR 了！请参考 [贡献准则](./CONTRIBUTING.md) 了解如何提交。

我们会尽快 review 你的代码，如果一切顺利，你的词典将会在下一个版本中发布。🎉

## 别忘了

在任何步骤遇到困难时，你都可以通过 GitHub Issues 寻求帮助。我们是一个友好的社区，随时欢迎你的加入！🤝

---

## How to Import a New Dictionary 📚 (English)

Note: Our dictionaries mainly come from community contributions. When you want to import a new dictionary, it's best to prepare the source file so we can better help you.

## 0. Seek Help 🤝

### 0.1 If You Have No Programming Background 🚫💻

We recommend you submit a dictionary request via GitHub Issues, describing the dictionary you need and providing its source. Our contributors will help you import it.

### 0.2 If You Know How to Use GitHub 🐙

We recommend you create an Issue with "Dictionary Request" in the title, describing your needs and providing the dictionary source.

## 1. Do It Yourself! 🛠️

### 1.1 Target File Format 📄

The dictionary file format is `dictionary-name.json`, with this structure:

```json
[
    {
        "name" : "xxx" ,
        "trans" : ["xxx", "xxx",...]
    },
    ...
]
```

### 1.2 Target File Location 📍

Place dictionary files in `public/dicts/`.

### 1.3 Dictionary Index 🔍

Add dictionary metadata to `src/resources/dictionary.ts`:

```typescript
{
  id: "unique-id",
  name: "Display Name",
  description: "Description",
  category: "Category Name",
  url: "/dicts/filename.json",
  length: 1000,
  language: "en",
  languageCategory: "en",
}
```

### 1.4 Test 🧪

Install dependencies and start the dev server:

```sh
pnpm install
pnpm dev
```

Visit `http://localhost:5173` to see your dictionary. 🎉

### 1.5 Submit a PR 📝

Submit your Pull Request following the [Contribution Guidelines](./CONTRIBUTING.md).

We'll review your code and if everything looks good, your dictionary will be published in the next release! 🎉

## Remember

If you encounter difficulties at any step, you can seek help via GitHub Issues. We're a friendly community and welcome you anytime! 🤝
