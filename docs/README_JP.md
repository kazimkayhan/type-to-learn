<div align=center>
<img src="../src/assets/logo.svg"/>
</div>

<h1 align="center">
  Type to Learn
</h1>

<p align="center">
  <a href="../README.md">中文</a>
  <a href="./README_EN.md">English</a>
  <a href="./README_JP.md">日本語</a>
</p>

<p align="center">
  キーボードワーカーのために設計された単語記憶と英語筋肉記憶トレーニングソフトウェア
</p>

<p align="center">
  <a href="https://github.com/kazimkayhan/type-to-learn/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kazimkayhan/type-to-learn" alt="License"></a>
  <a><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"/></a>
  <a><img src="https://img.shields.io/badge/Powered%20by-React-blue"/></a>
</p>

<div align=center>
<img src="../docs/Screenshot.png"/>
</div>

## 📸 オンラインアクセス

**GitHub Pages**: <https://kazimkayhan.github.io/type-to-learn/>

<br />

## ✨ 設計思想

このソフトウェアは、英語を主要な作業言語として使用するキーボードワーカーを対象としています。一部の人々は、母国語を入力する際の打鍵速度が英語よりも速いことがあります。これは、長年の母国語入力によって非常に強固な筋肉記憶が形成されているためです 💪。一方、英語入力の筋肉記憶は比較的弱く、英語を入力する際に「ペンを持つと忘れる」現象が発生しやすいです。

同時に、英語のスキルを強化するためには、単語の暗記を継続する必要があります 📕。このソフトウェアは、英語の単語記憶と英語キーボード入力の筋肉記憶のトレーニングを組み合わせており、単語を暗記しながら筋肉記憶を強化することができます。

誤った筋肉記憶を形成しないようにするために、設計上、ユーザーが単語を間違って入力した場合、単語を再入力する必要があります。これにより、ユーザーが正しい筋肉記憶を維持することができます。

このソフトウェアは、英語のコンピュータベースの試験を受ける必要がある人々にも役立ちます。

**For Coder**：

プログラマーが仕事でよく使う単語の辞書が内蔵されており、仕事でよく使う単語を練習し、入力速度を向上させることができます。また、多くのプログラミング言語の API の練習も内蔵されており、プログラマーが一般的な API に迅速に慣れるのに役立ちます。さらに多くの言語の API が順次追加されています...

<div align=center>
<img src="https://github.com/kazimkayhan/type-to-learn/blob/master/docs/coder.png"/>
</div>

<br />
<br />

## 🛠 機能一覧

### 辞書

CET-4、CET-6、GMAT、GRE、IELTS、SAT、TOEFL、大学院英語、専門英語 4 級、専門英語 8 級などの一般的な辞書が内蔵されています。また、プログラマーがよく使う英単語や多くのプログラミング言語の API の辞書も内蔵されています。できる限り多くのユーザーの単語記憶のニーズを満たすよう努めており、コミュニティからのさらなる辞書の貢献も歓迎します。
<br />
<br />

### 音声記号表示、発音機能

単語を記憶する際に、発音と音声記号を同時に記憶するのに役立ちます。

<div align=center>
<img src="https://github.com/kazimkayhan/type-to-learn/blob/master/docs/phonetic.jpeg"/>
</div>
<br />
<br />

### 書き取りモード

ユーザーが章の練習を完了した後、その章を暗記するかどうかのオプションが表示されます。これにより、ユーザーがその章で学んだ単語を強化するのに役立ちます。

<div align=center>
<img src="https://github.com/kazimkayhan/type-to-learn/blob/master/docs/dictation.png"/>
</div>
<br />
<br />

### 速度、正確性の表示

ユーザーの入力速度と正確性を定量化し、ユーザーが自分のスキルの向上を実感できるようにします。

<div align=center>
<img src="https://github.com/kazimkayhan/type-to-learn/blob/master/docs/speed.jpeg"/>
</div>
<br />
<br />

## 貢献方法

### コードの貢献

[貢献ガイドライン](./docs/CONTRIBUTING.md)

### 辞書の貢献

[辞書のインポート](./docs/toBuildDict.md)

## プロジェクトの実行

このプロジェクトは `React` をベースに開発されており、実行には node 環境が必要です。

### 手動インストール

1. NodeJS をインストールします。参考：[公式ドキュメント](https://nodejs.org/en/download)
2. `git clone https://github.com/kazimkayhan/type-to-learn.git` を使用してプロジェクトをローカルにダウンロードします。git を使用しない場合、依存関係が不足して実行できない可能性があります。
3. コマンドラインを開き、プロジェクトのルートディレクトリで `pnpm install` を実行して依存関係をダウンロードします。
4. `pnpm start` を実行してプロジェクトを起動します。プロジェクトのデフォルトアドレスは `http://localhost:5173/` です。
5. ブラウザで `http://localhost:5173/` を開いてプロジェクトにアクセスします。

## 📕 辞書リスト

- CET-4
- CET-6
- GMAT
- GRE
- IELTS
- SAT
- TOEFL
- 大学院英語
- 専門英語 4 級
- 専門英語 8 級
- Coder Dict プログラマーがよく使う単語
- 高考
- 中考
- ビジネス英語
- BEC
- 人教版英語 3-9 年級
- 王陆雅思王听力語料庫 [@Saigyouji_WKKun](https://github.com/ggehuliang)
- 日本語常用単語、N1 ～ N5 [@xiaojia](https://github.com/wetery)
- カザフ語基礎 3000 語（ハピン版） [@Elgar](https://github.com/Elgar17) 提供、[@Herbert He](https://github.com/HerbertHe) による [ハピン](https://ha-pin.js.org) 技術サポート

他の辞書を暗記する必要がある場合は、Issue で提案してください。

<br />
<br />

## 📗 API 辞書

- JavaScript API. [@sdu-gyf](https://github.com/sdu-gyf)
- Node.js API. [@chrysalis1215](https://github.com/chrysalis1215)
- Java API. [@darkSheep](https://github.com/SFAfreshman)
- Linux Command. [@归谜](https://github.com/vhxubo)
- C#: List API [@nidbCN](https://github.com/nidbCN)

現在、API 関連の辞書は主にコミュニティの貢献に依存しています。自分の必要な API 辞書を貢献したい場合は、貢献ガイドラインを参照してください。

<br />
<br />

## 🎙 機能と提案

現在、プロジェクトは開発初期段階にあり、新機能が継続的に追加されています。ソフトウェアに関する機能や提案がある場合は、Issues で提案してください。

このソフトウェアの設計思想が気に入った場合は、pr を提出してください。ご支援いただき、誠にありがとうございます！
<br />
<br />

## 🏄‍♂️ 貢献ガイドライン

このプロジェクトに興味がある場合、貢献を歓迎します。できる限りのサポートを提供します。

貢献する前に、現在の開発計画を理解することをお勧めします。計画中の作業や Issue 区の "Help Wanted" ラベルの付いた作業に参加することをお勧めします。もちろん、完全に新しい機能やアイデアを実現することも歓迎しますが、それには時間がかかるかもしれません。

参加したい作業が決まったら、基本的な進捗があった後に draft pr を提出することをお勧めします。これにより、draft pr で議論を行い、他のコラボレーターの意見を聞くことができます。

プロジェクトへの貢献に感謝します！🎉

<br />

## 👨‍💻 貢献者

<a href="https://github.com/kazimkayhan/type-to-learn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=kazimkayhan/type-to-learn" />
</a>

## 🎁 大感謝

### インスピレーションの源

[Keybr](https://www.keybr.com/)
アルゴリズムで有名な、非常に完成度の高いタイピングサイトです。ユーザーの各文字の入力の正確性と速度に基づいて「擬似英語」を生成し、ユーザーが入力の遅い個々の文字に集中してトレーニングできるようにします。また、ユーザーの入力履歴データから詳細な分析レポートを生成します。

このプロジェクトの核心的なインスピレーションの源でもあります。Keybr は主に英語を母国語とするユーザーを対象としています。Keybr を使用してタイピングを練習しているとき、生成された擬似英語が個々の文字の入力を練習するのに役立つ一方で、非母国語ユーザーの単語の習得にはあまり効果がないと感じました。そのため、このプロジェクトを立ち上げました。

[Typing Academy](https://www.typing.academy)
非常に優れたタイピング練習サイトです。その優れた UI スタイルと速度、正確性の表示がこのプロジェクトの UI デザインに大きな影響を与えました。

[react-code-game](https://github.com/webzhd/react-code-game)
非常にクールなオープンソースプロジェクトで、TypeScript で実装されています。タイピングを練習しながら JavaScript の内蔵 API を練習できるプロジェクトです。このプロジェクトからコード API を追加するアイデアが生まれました。
<br/><br/>

### オープンソースプロジェクト

[React](https://github.com/facebook/react) & [CRA](https://github.com/facebook/create-react-app)
詳細で包括的なドキュメントは初心者に非常に優しく、React のドキュメントは私が自学中に読んだ中で最も優れたドキュメントです。使用中のほとんどの問題を解決してくれます。React のオープンソース世界への貢献に感謝し、初心者でも非常に優れたソフトウェアを構築できる基盤を提供してくれました。

[Tailwindcss](https://tailwindcss.com/docs)
Tailwind がなければ、このプロジェクトはさらに遅れることになったでしょう。Tailwind の設計思想は、複雑な CSS を書くことへの恐怖を解消し、新しい方法で UI を設計するのに役立ちました。
<br/><br/>

### データソース

辞書データは [kajweb](https://github.com/kajweb/dict) から提供されています。このプロジェクトは一般的な辞書を収集しており、このプロジェクトの実現の希望を見せてくれました。

音声データは [有道辞書](https://www.youdao.com/) のオープン API から提供されています。小規模なプロジェクトでも非常に専門的な発音リソースを利用できるようにしてくれた有道に感謝します。有道チームと考神チームの中国教育と中外交流への重要な貢献に感謝します。

JS API は [react-code-game](https://github.com/webzhd/react-code-game) から提供されています。JS API の収集と前処理に感謝します。
<br/><br/>

### プロジェクトアイコン

[libregd](https://github.com/libregd) に感謝します。プロジェクトに複数の素晴らしいアイコンデザインを提供し、プロジェクトの進行中にデザイン、提案、将来の計画など多くのサポートを提供してくれました。

## 🌟 時間経過によるスターゲイザー

[![Stargazers over time](https://starchart.cc/kazimkayhan/type-to-learn.svg)](https://starchart.cc/kazimkayhan/type-to-learn)

---

## 📝 ライセンスと帰属

このプロジェクトは [Kaiyi](https://github.com/RealKai42) による [Qwerty Learner](https://github.com/RealKai42/qwerty-learner) をベースにしたフォークです。元のプロジェクトは GPL-3.0 ライセンスの下でライセンスされています。このフォークは同じライセンスを維持し、元の作者の作品を認めています。

**元のプロジェクト**: [RealKai42/qwerty-learner](https://github.com/RealKai42/qwerty-learner)  
**このフォーク**: [kazimkayhan/type-to-learn](https://github.com/kazimkayhan/type-to-learn)  
**メンテナ**: Kazim Kayhan  
**ウェブサイト**: [kazimjan.com](https://kazimjan.com)  
**連絡先**: email4kazim@gmail.com
