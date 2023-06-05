---
head:
  - - meta
    - name: twitter:card
      content: summary
  - - meta
    - property: og:site_name
      content: This Week in Gorilla
  - - meta
    - property: og:title
      content: Software Designで連載した「Denoで始める サーバサイドTypeScript開発」を振り返る
  - - meta
    - property: og:image
      content: https://i.gyazo.com/d2e57d56dbc524c1c8b068a97f89cdd0.png
---

# Software Designで連載した「Denoで始める サーバサイドTypeScript開発」を振り返る

<a href="https://gihyo.jp/magazine/SD/archive/2023/202307" target="_blank">
  <div align="center">
    <img src="http://image.gihyo.co.jp/assets/images/cover/2023/642307.jpg" width=300>
  </div>
</a>

## はじめに
[Software Design 2023年3月号](https://gihyo.jp/magazine/SD/archive/2023/202303) 〜 [7月号](https://gihyo.jp/magazine/SD/archive/2023/202307)までDenoの連載をしたので、それを振り返っていく。

この連載はDenoの良さとは何か？何ができるのか？といった内容を実際にDenoを使ってものづくりをしながら紹介している。
わかりやすく、そして楽しめるように書いたつもりなので、興味ある人はぜひ買ってみ読んでみてほしい。

## きっかけ
連載の話自体は[deno-jp](https://deno-ja.deno.dev)のSlackで[kt3kさん](https://twitter.com/kt3k)が募集していた。
技術評論社の[栗木さん](https://twitter.com/g_krk3)からkt3kさんへの執筆依頼があったが手が空いていなかったため、募集していたとのことだった。
Software Designで連載を持ちたい夢があったので迷わず手を上げて、他にやりたい人もいなかったため決まった。

最初は自分が知っている程度のDenoの知識で大丈夫だろうか？という不安があったが、
Deno社員であるkt3kさんと[まぐろさん](https://twitter.com/yusuktan)が監修についてくれたのが心強かった。

そんな不安と楽しみがありつつも連載を開始した。

## テーマについて
「DenoではじめるサーバーサイドTypeScript開発」というテーマは最初から決まっていて、ターゲット層は次としていた。

- JavaScript/TypeScript開発者
- サーバーサイドエンジニア
- 現在Node.jsを利用している人

上記を踏まえて、スクショの様な感じで詳細な内容を自分が考え提案していた。

![](https://i.gyazo.com/6a490e2afbc67a3309c64935686aaa85.png)

おおよそ毎月何を書くかは最初からある程度の構成は考えていて、あとは実際に書きつつ調整していた。

元々3回の連載だったが、自分の書きたいこともたくさん書かせてもらえたことで5回まで伸びた。ありがたい。

## 第1回 Denoの良さを体験する
初回ということで、だいたい次の内容をコンパクトにまとめつつ丁寧に説明した。

1. Denoとは
2. DenoとNode.jsとの主な違い
    - Node.jsにおける課題と、その課題をDenoではどのように改善したのか
3. Denoの特徴
    - DXの良さ(LinterやLSなど)
4. Denoを体験
    - 簡易なgrepコマンドを実装

個人的に初回はかなり大事だと思っていたので、「Denoってめっちゃ便利そうじゃん」と思ってもらえるように丁寧に書いた。
そして読むだけでは眠くなるので、実際に簡易なgrepコマンドを実装してDenoでの開発の流れを体験してもらえるようにした。

自分でいうのもあれだけど、割とよく書けていたと思うので、興味ある人はぜひ読んでみてほしい。

## 第2回 モジュールの作り方と公開する方法と利用する方法
2回目は、Denoでモジュールシステムを主眼において、以下のことを解説した。

1. Denoのモジュールの作り方と公開方法
2. npm specifier機能を使用したマークダウンプレビューCLIの作り方

モジュールの作り方と公開する方法について理解できるように、CSVからテキスト表に変換する簡易なモジュール作ってそれを https://deno.land/x に公開する方法を説明した。

![](https://i.gyazo.com/e0e32cf8d1906c06d1c0eda98a4fd4fc.png)

そして、作ったモジュールを利用したマークダウンプレビューCLIを作って、実際にモジュールの使い方を説明した。

ただのマークダウンプレビューを作るだけだとあんまりDenoの面白みを感じないと思ったので、
npm specifier で markdown-it を使いつつ、Denoのファイル監視機能を使ってリアルタイムレンダリングできるCLIにした。

少しでもDenoの便利さを感じてもらえたら嬉しいなという気持ちから生まれたアイディアだったが、結果的に実用性を読者に感じてもらえたので嬉しかった。

## 第3~4回 Deno Deploy でWeb APIを公開する方法
3〜4回は、Deno Deploy周りを解説した。

Deno Deploy自体はDeno Runtimeを中心に作られているサーバレスサービスなのでDenoのコードが動く。
ちなみに、最近になってnpm specfierも対応されたのでNodeもジュールも動く。

そしてGitHubと連携もできるので、pushしたらそのままデプロイされるし、履歴ごとの環境は全部残るのでデバッグもしやすい。

Deno Deployの良さを読者に体験してもらえるように、食事を記録するAPIを作ってデプロイして公開する方法を解説した。

簡単なTodoでも良かったけど、もう少し実用的なものを作ったほうが読者の記憶にも残りやすいだろうし、その方面白いと思ってレコーディングダイエットするためのAPIを作ることにした。
まだ読者の感想を見れていないのでわからないけど、楽しんでもらえたら嬉しい。

## 第5回 ほかの言語の資産を利用する方法
最終回は応用編としてDenoのFFIとWasmの機能を使った次の例を解説した。

1. Rust + Wasm + Deno でQRコード生成CLIを実装する
2. Rust + FFI + Deno でOCR（画像からテキストを読み取るやつ）のCLIを実装する

上記のCLIは2つとも比較的に実用性がある例かなと思っていて、自分もサンプルを実装していて面白かった。
Denoってこんな事もできるんだと感じてもらえるんじゃないかなと思っている。

Rustがわからない人が躓かないように、なるべくシンプルに実装できるようにwasmbuildといった周辺ツールを活用したので、おそらく大丈夫と思われる。
もしよくわからないところがあれば、[twitter](https://twitter.com/gorilla0513)で聞いてくれたらいつでも答えるので遠慮なく。

全然関係ないけど、連載中にRustで[Wasm Runtimeを書いた](https://zenn.dev/skanehira/articles/2023-04-23-rust-wasm-runtime)ので、その知識が少し連載に活かせたのも良かった。

## さいごに
夢のひとつであったSoftware Designでの連載できたことがとても嬉しかった。
この機会を与えてくれたkt3kさん、栗木さん、そして監修してくれたまぐろさんに改めて感謝を申し上げたい。

連載はなかなか労力と時間を要するが、その分たくさん学べた。
今はとりあえずひと休憩してネタをためてまたいつか連載をしたいと思っている。
