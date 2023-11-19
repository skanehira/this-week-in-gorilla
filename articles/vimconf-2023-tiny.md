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
      content: VimConf 2023 Tiny に参加&発表してきた

date: 2023-11-18
outline: deep

---

# VimConf 2023 Tiny に参加&発表してきた

4年ぶりにVimConfが開催され、参加&発表してきたので、雑に感想を書いていく。

### Bram Moolenaar the Creator of Vim

キーノートはmattnさんによるVimの作者のBram氏について振り返るセッション。
個人的に知らなかった話として、以下があったのが印象的だった。

- Vi IMmitation が使われていたのが2、3週間くらいだったそう
- Bramはとにかく手が早い

mattnさんに手が早いと言わせるのは、やはりすごいなと思った。

### Revolutionizing Vim/Neovim Plugin Development ~ An In-Depth Look into Denops	

ありすえさんによるVim/Neovimプラグインのエコシステムであるdenops.vimに関する発表だった。
Vimプラグイン200個くらい作っているらしく、驚いた。

TypeScriptでVim/Neovimプラグインを書けるのは革命的だったし、自分もそのビッグウェブに乗っかっていくつかプラグインを作った。
denopsはなぜかあんまり知名度がないという課題があると言っていたのは分かるなぁと思って聞いていた。
なんでだろうね:thinking:

最近は全くVim活できていないので、またdenopsでなにかを作りたいなって気持ちが出てきた。

### Developing a Vim plugin with Ruby, or when in Ruby do as the Rubyists do	

大倉さんによるRubyでVimプラグイン開発の話。
英語わからん過ぎて、ほとんど何を言っているのか分からなかったので、スライドを見返したい。

ただ、カーソルの今いる行のコンテキストを取得できるようなことをやっていたので、便利そうだなと思った。

## Modern techniques for implements insert mode plugins / Why use IME within text editor?	

kuuさんによる、skkeletonについての発表。
開発する際に課題とそれをどうやって解消したのか、について話していた。

個人的に、キーマッピングを復元するための`maparg()`/`mapset()`を知らなかったので勉強になった。

skk記法は送り仮名を覚えるのがとにかく大変で、それで思考が中断されるので3回くらいチャレンジしては諦めたけど、またチャレンジしようかなって気持ちが芽生えてきた。

個人的に、送り仮名を覚えなくて良いような仕組みがあるとskkeletonに乗り換えやすいなと思っているが、それは果たしてskkだろうかって気持ちもあるし、実現可能だろうかって疑問もある。

やはり慣れか？

## Boost your vimrc with some template techniques!	

あいやさんによるvimrc盆栽のテクニックの紹介とvital.vimの紹介だった。
発表でVimにテンプレート構文が入ったことを知って驚いた。未だにVim scriptが改善されているのを実感した。

後半は主にvital.vimの話だったが、個人的に一時期よく使わせてもらったので、便利だよなぁって思いながら聞いていた。

個人的にありすえさんが作った[vital-Whisky](https://github.com/lambdalisue/vital-Whisky)も結構便利なので、必要なモジュールがあったらぜひ使ってほしいなと思った。

## VimとVimConfの将来について

セッションとは関係ないが、VimConfに参加していて少し感じたことを。

自分もゴリラ.vimというイベントを運営しているので、運営側の大変さも知っているし、参加者として楽しさも知っている。
だからこそ、少しVimとVimConfの将来について少し考えさせられた部分もあった。

mattnさんの発表でBram氏が亡くなったあと、みんなでVimを守っていこうって気持ちがすごく伝わってきた。
そしてKoRoNさんを中心としたVimConfのスタッフたちもいつまでもVimConfを開催できないという現実がある。

次の世代である自分たちがそろそろ引き継いでいく必要があるのではないんだろうか？
そういう思いは以前からもあったが、より強まった日でもあった。

諸行無常という言葉の通り、不変なものは何一つない。だから大切だと思うものを守っていく必要がある。

これまでVim本体にはほぼ貢献してこなかったが、mattnさん発表を聞いて、今後はVimそのものにも貢献していこうと思った。
mattnさんに今後はVim本体に貢献していきたいこと、どこからやったらいいのかを相談したら、少しアドバイスをもらえた。
ので、コツコツやっていこうと思う。

## まとめ

少し暗い話をしてしまったかもしれないが、4年ぶりにVimConfに参加してやっぱり最高に楽しかった。
懇親会でいろんな人と話しできたし、LTも盛り上がっていた。

2次会では若い子たちと話し、 3次会では例年恒例の徹夜カラオケに少しだけ参加して、4次会はジムで筋トレて、これ以上にない最高の一日だった。

このような素晴らしい日を過ごせたこと、VimConfの運営スタッフの方々、参加者のみなさんには心から感謝を申し上げたい。
