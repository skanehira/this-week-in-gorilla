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
      content: k8sを操作するVimプラグインk8s.nvimを作った

date: 2026-01-06
outline: deep

---

# k8sを操作するVimプラグインk8s.nvimを作った

Noevimからk8sを操作する[k8s.nvim](https://github.com/skanehira/k8s.nvim)を作ったので紹介する。

UIはこんな感じでfloat windowでキーマップを使ってリソースを閲覧、操作できる。

![](https://i.gyazo.com/e50276c903e45ec2995d41f29f0e1d03.png)
![](https://i.gyazo.com/db6633005503eb3168e2cac63af093ea.png)

例えば`:K8s`で`Pod`一覧が表示され、`d`で`describe`できたら`<C-f>`でフィルタ、`p`でポートフォワードできる。
操作感は完全にTUIツールそのものとなっている。

TUIなら[k9s](https://github.com/derailed/k9s)でいいじゃんって言葉が聞こえてきそうだが、部分的にはそうだと思う。
しかし、自分は逆張りなところがあって`k9s`を使ったら負けだと思っているのと、`k9s`は自分のOSSではないので自分好みのUIや操作感ではないから自作することにした。

今ならAIを使えば昔よりもはるかに速く作れるし、実際に作れた。

そんなわけで、個自分的に推しポイントを書いておく

## ポートフォワード
`Service`や`Pod`一覧で`p`を押すとポートフォワードできる。
こんな感じでコンテナ側のポートを選択したあとホスト側のポートを入力する流れになっている。

[![Image from Gyazo](https://i.gyazo.com/21840480ad950892b13320d52e8017fc.png)](https://gyazo.com/21840480ad950892b13320d52e8017fc)

ポートフォワード一覧画面もあって、そこで`D`を押すと止まる。

[![Image from Gyazo](https://i.gyazo.com/38c123e6fb3fe8ed06e4e54601d67b04.png)](https://gyazo.com/38c123e6fb3fe8ed06e4e54601d67b04)

永続化はちょっと面倒そうなので実装していないため、Neovimを終了すると全部止まるようになっているので要注意。

## フィルタリング
`<C-f>`で`Pod`一覧などをフィルターリングできる。
さらに`/`で通常の検索もできる。

大枠絞り込んだあと、`/`で検索してカーソル移動できるので、高速に操作できる。

[![Image from Gyazo](https://i.gyazo.com/747e1d72d4985bb8d431bd7292701fb0.png)](https://gyazo.com/747e1d72d4985bb8d431bd7292701fb0)

## Podへのアタッチとpodのログ

`Pod`一覧で`e`でアタッチできたり、`l`でログを見れたりする。
これらは別タブのターミナルで実行されるようなっているので、複数のpodにアタッチしたりログを見たりできる。

k9sでは複数のpodのログを同時に見れないので、これは便利なのではないだろうか。

## キーマップの変更

こんな感じでユーザはキーマップを自由に変更できる。まぁプラグインなら当然ではあるが。
設定されたキーマップは`?`を押すとヘルプページにも表示される。

```lua
{
  "skanehira/k8s.nvim",
  dependencies = { "MunifTanjim/nui.nvim" },
  opts = {
    keymaps = {
      -- Global keymaps (all views)
      global = {
        quit = { key = "Q", desc = "Hide" },
      },
      -- Pod list view
      pod_list = {
        describe = { key = "K", desc = "Describe" },
      },
      -- Deployment list view
      deployment_list = {
        scale = { key = "S", desc = "Scale" },
      },
    },
  },
}
```

[![Image from Gyazo](https://i.gyazo.com/13c7bbd655068fc8145d4394339a7cf6.png)](https://gyazo.com/13c7bbd655068fc8145d4394339a7cf6)

## 画面切り替え

`<C-r>`でリソースを選択して画面を切り替えることができるが、複数の画面を行き来することを想定して`<C-h>`で前の画面、`<C-l>`で次の画面を切り替える事ができる。

undoとredoと同じような機能と思ってもらえればイメージしやすいと思う。

たとえば`Pod`画面から`Secrets`画面に遷移したあと、また`Pod`画面に戻りたくなったとき`<C-h>`だけでいけるし、`Pod`から`Secrets`に行きたいときは`<C-l>`でいける。

## さいごに

基本的にドッグフーディングしながら改善していく予定だけど、もしNeovimでk8sを操作したい人がいたらぜひ試してほしい。
