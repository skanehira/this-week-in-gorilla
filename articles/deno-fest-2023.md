---
head:
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - property: og:site_name
      content: This Week in Gorilla
  - - meta
    - property: og:title
      content: Deno Fest 2023で発表してきた
  - - meta
    - property: og:image
      content: https://i.gyazo.com/534f8a74f25578d35ad14a07f80d6d87.png

date: 2023-10-20
outline: deep

title: "Deno Fest 2023で発表してきた"
---

# {{ $frontmatter.title }}

[Deno Fest](https://deno-fest-2023.deno.dev)に参加&発表してきました！  
最高でした！  
スタックの皆さん、ありがとうございました！

## 基調講演： deno ♥️ npm: Bridging the Gap Between Node and Deno

- homebrew版Denoを使っていた
- JavaScript Runtimeを作って10年以上立っている
- JavaScriptは方向性？言語ではない？
- Denoは次世代Javascript Runtime
  - 主にDenoの特徴についての話し
- node:fs の readFileSync でもパーミッションが動く
- chalkのデモでなぜか色が変わらなかった
- deno compile --target でクロスコンパイルできる
  - その際に、Denoがダウンロードされる

## セッション 1：JavaScript Server Runtime History

- JSConf JPが開催予定
- Node学園祭でライアンの話を聞いて、人生が変わった
- `<SERVER>`タグないでJSをかく
  - それがサーバー側でバイトコードにコンパイルされ実行される
  - これが初めてのserver runtime？
- 2009年にNodeJSが誕生
  - 初期はnet v8？という名前
- nodejsがforkされ、io.jsが生まれた？
  - io.jsにコミッターたちが移行していった
  - 結局2つが融合して、開発者コミュニティ主導になった

## セッション 2：開発チームに聞こうのコーナー1

- denoを社内で広める際に、おすすめの機能
  - シンプルさ
  - 機能の豊富さ
- npmサポートでどれくらい複雑度が上がったか
  - 内部はかなり上がったが、ユーザ側は特に気にすることはない
- 教育に結構力を入れているように見える
  - 大学でもDenoを使ってもらえるように進めたり、jupiterサポートしたりしている
- Deno DeployはGoogle Cloudでデプロイされている
  - 使う側は特に気にしなくてOK
- stdの1.0リリースに向かって、いま大変なことはなに？
  - 一部はすでに1.0になる
  - 一部はunstableなので、本質的に1.0にならない
  - CLIの秘密の機能が次の四半世紀で出る予定
    - それによってブロックされている

## セッション 3：The state of Fresh

https://fresh.deno.dev/docs/concepts/partials#enabling-partials

fresh についての話だった（英語何もわからんかった）

## セッション 4：SupabaseのAI検索機能

- SupabaseはBaas
- 裏はGPT
- 独自のプロンプトを作ってGPTに投げている
- 質問をベクトル化して、supabaseのDBから類似情報を検索する
  - 類似情報はGPTのEmbedを使って情報をベクトル化して保存している？
  - これを補足情報としてプロンプト追加

## セッション 5：中止

## セッション 6：金曜 DENO DE SHOW

作っているモジュールの紹介

- msg pack ２種類ある
  - GoライクなAPIを使っている版がその一つ
- vim_channel_command はVimコマンドを実行するやつ
- workerio
- unknownutil

## セッション 7：The power of Web-standards

- Honoはウェブ標準APIのみを使ったwebフレームワーク
  - 最初はCloudflare Workerで動かすために作った
    - そのあとDenoなどをサポートした
  - いろんなエッジやランタイムをサポートしている
- 標準ではないものは環境変数とファイルシステム
  - WinterCGが定義したランタイムキーを使って、ランタイムごとの環境変数を取得している

## セッション 8：The state of web frameworks in Deno

Denoでいろんなフレームワークが動く例としてクイズ大会が始まった

## セッション 9：Civic Tech by Open ESM in Pure JavaScript

Denoでも動くいろんなモジュールの紹介

## セッション 10：Deno KV でログを永続化する

- 時系列データをDeno KVに入れる話
- std/ulid
  - 時系列順にソートできるuuidモジュール？

## セッション 11：Deno KV で投稿系サイトを作ってみた話

- 万華鏡作って共有できるサイトの話
- jsonを編集しながら、リアルタイムで万華鏡を確認できる
- パスキー対応
  - どういう仕組なんだろ？
- 認証、データ、サムネイルをすべてDeno KV内で賄っている
- 簡単にデプロイできるの便利
  - 小規模なものなら、Deno Deploy + Deno KVは良い選択肢という話

## セッション 12：Contributing to Deno is fun!

- コントリビュートの手順が紹介されていた
  - good first issue がオススメ
  - lint.js format.js などがあるからそれを実行してから出すと良い

## セッション 13：Software DesignでDenoの短期連載したお話し

https://speakerdeck.com/skanehira/deno-fest-2023

## セッション 14： Blazing fast FFI in Deno

- v8 fast api call でFFIがめっちゃ速くなる話
- 実際にアセンブリを比較すると命令数が減っている
- ベンチマーク結果を見ると、BunFFIより速い

## セッション 15：FreshでちゃんとWebアプリを作ってみる

- セッション管理はDeno KV
- webフレームワークはfresh
- prismaはマイグレーションのみ
  - deno run で prisma を使える
- クエリ処理はすべて手書き
- Deno KVのベストプラクティスがほしい

## セッション 16：開発チームに聞こうのコーナー2

- wasmの対応について
  - wasm を普通にimportできないのが不便だけど、直接importできるプロポーザルが出ている
- Denoで使えるバンドルツールは何がおすすめか
  - esbuildがオススメ（相性が良いらしい）

あと何個かあったが知識足りずに理解出来かなった
