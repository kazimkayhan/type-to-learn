# How to Import a New Dictionary 📚

Please note that our dictionaries mainly come from community contributions. If you would like to import a new dictionary, it is best to prepare the original source file so that we can better assist you.

## 0. Seek Help 🤝

### 0.1 If You Have No Programming Background 🚫💻

We recommend submitting a dictionary request through GitHub Issues. Describe the dictionary you need and provide its source. Our contributors will help you import the dictionary.

### 0.2 If You Know How to Use GitHub 🐙

We recommend creating an Issue with **"Dictionary Request"** in the title. Describe the dictionary you need and provide its source.

## 1. Do It Yourself! 🛠️

### 1.1 Target Dictionary File Format 📄

The dictionary file should be named `dictionary-name.json`, and its content should follow this structure:

```json
[
    {
        "name": "xxx",
        "trans": ["xxx", "xxx", ...]
    },
    ...
]
```

For example:

```json
[
  { "name": "file", "trans": ["n. file, filing cabinet, file tool, [Computer] file; vt. march in line, file, apply"] },

  {
    "name": "command",
    "trans": [
      "n. command, direction; headquarters, command post; [Computer] instruction; control; vt. direct, control, command; order; deserve, warrant; vi. give orders; command, instruct; adj. commanding, done by order (or request)"
    ]
  },

  { "name": "use", "trans": ["n. use, usage, right of use, applicability; vt. use, utilize, treat; vi. take drugs"] },

  { "name": "program", "trans": ["n. program, programme, procedure, plan; vt. plan, schedule, produce a program"] },

  { "name": "line", "trans": ["n. row, line, route, boundary line, wrinkle, family; vt. & vi. line, form a line, arrange in order; vi. form a line, arrange in order, draw a line on"] },

  { "name": "if", "trans": ["conj. if, whether, even if; n. condition, supposition"] }
]
```

#### 1.1.0 How Can I Convert the Dictionary Source File to the Target Format? 🔄

Since dictionary source files come from different sources and use different formats, we cannot provide one universal conversion method. However, here are some approaches you can try:

#### 1.1.1 Use ChatGPT or Other AI Tools 🤖

You can provide a portion of the original dictionary source file to ChatGPT and describe what you need. The AI can generate a conversion script or directly convert the data into the required format.

#### 1.1.2 Use Online Tools 🔧

You can also use online tools to convert your dictionary source file into the target format. For example:

https://csvjson.com/csv2json

#### 1.1.3 Convert It Manually ✍️

If the dictionary is not very large, you can manually convert the source file to the target format, or have an AI tool process it in bulk for you.

#### 1.1.4 If You Run Into Problems 🔄

If you encounter difficulties at this stage, go back to **Section 0** and seek help through GitHub Issues.

### 1.2 Dictionary File Location 📍

The target location for dictionary files is:

`public/dicts/`

Place the processed dictionary file in this directory.

### 1.3 Add the Dictionary Index 🔍

You need to add the dictionary metadata to:

`src/resources/dictionary.ts`

Use the following format:

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

For example:

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

The fields mean:

* `id` must be unique across all dictionaries.
* `name` is the dictionary name displayed to users.
* `description` is a description of the dictionary.
* `category` is the dictionary category. You can check the categories of existing dictionaries and choose an appropriate one for the new dictionary.
* `tags` are optional dictionary tags.
* `url` is the dictionary file path, relative to the `public/` directory.
* `length` is the number of words in the dictionary. You can calculate it automatically by running `scripts/update-dict-size.js`.
* `language` indicates the dictionary's language, such as `"en"`, `"ja"`, or `"zh"`.
* `languageCategory` indicates the language category of the dictionary.

### 1.4 Test 🧪

Install the dependencies and start the development server using:

```sh
pnpm install

pnpm dev
```

Open:

`http://localhost:5173`

If the dictionary has been imported successfully, you should see it in the dictionary list. 🎉

### 1.5 Submit a PR 📝

You can now submit a Pull Request! Please refer to the [Contribution Guidelines](./CONTRIBUTING.md) for instructions on how to submit your PR.

We will review your code as soon as possible. If everything looks good, your dictionary will be included in the next release. 🎉

## Don't Forget

If you encounter difficulties at any step, you can always seek help through GitHub Issues. We are a friendly community and warmly welcome your contributions! 🤝
