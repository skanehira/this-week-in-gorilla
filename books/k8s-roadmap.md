---
head:
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - property: og:site_name
      content: This Week in Gorilla
  - - meta
    - property: og:description
      content: 「Kubernetesの知識地図」を読んだ
  - - meta
    - property: og:title
      content: 「Kubernetesの知識地図」を読んだ
  - - meta
    - property: og:image
      content: http://image.gihyo.co.jp/assets/images/cover/2023/9784297135737.jpg

date: 2023-06-30
outline: deep

---

# 「Kubernetesの知識地図」を読んだ

<a href="https://gihyo.jp/book/2023/978-4-297-13573-7" target="_blank">
  <div align="center">
    <img src="http://image.gihyo.co.jp/assets/images/cover/2023/9784297135737.jpg" width=200>
  </div>
</a>

## はじめに
技術評論社から「Kubernetesの知識地図」という本が出て、著者の一人である[青山さん](https://twitter.com/amsy810)から献本を頂いた。

ちょうど個人で[4台のラズパイでk8sクラスタを組んだ](../articles/raspberry-pi-cluster.md)ばかりで、これからk8sちゃんと使っていくぞと思っていたので、とてもありがたかった。

ちなみに、自分のk8sレベルはだいたい以下の通り。ちょっとかじったことがある程度。

- 仕事でk8sを使ったことがない
- 去年の今ころに[Kubernetes完全ガイド 第2版](https://book.impress.co.jp/books/1119101148)を途中まで読んだ(記憶からだいぶ消えているけど)
- PodやDeployment、Serviceといった基礎的な概念は理解している
- k8s.vimというVimプラグインを作った
  - [発表スライド](https://skanehira.github.io/slides/vim-k8s-plugin/)
  - [プラグイン](https://github.com/skanehira/k8s.vim)
- ラズパイでk8sクラスタを構築した

それくらいのレベルの自分が読んだ感想を書いていく。誰かの役に立ったら嬉しいし、感想を書くのは献本を頂いたお礼と思っている。

本のボリュームはだいたい300ページほど。  
それなりの量なので、目次ごとに書いていく。  
目次は[こちら](https://gihyo.jp/book/2023/978-4-297-13573-7)で確認できる。

## 第1章：Kubernetesの基本
主に以下の内容が書かれていた。

- k8sとはなにか？
- k8sの環境
  - ローカル(kind)
  - マネージド(EKSやGKEなど)
- k8sの特徴
- kubectlやkrew

k8sについて軽く触れる程度の内容だった。

対象の読者は「k8sをこれから本格的につかっていく」エンジニアなので、さくっと改めて紹介する程度に留めているのだろう。
なので、まったくk8s触ったことがない人はまずKubernetes完全ガイドを読むと良さそう。章末にもそのようなことが書かれている。

## 第2章：Kubernetesにおけるアプリケーションの起動

### Dockerfileを書くポイントと注意点
本番で使うコンテナイメージをどのようにセキュアに保つか、サーバーサイドやフロントエンドのコンテナ化のノウハウ（ISRの場合の注意点など）について主に書かれていた。

内容的にk8sに限らず、コンテナを使う際に知っておいたほうが良いなといった感じだった。  

個人的にISRの存在を知らなかったのとそれをコンテナ化する際のk8sの設定ポイントを知れて勉強になった。

### プロダクションレディなアプリケーション運用の実現
本番での対障害性の向上や障害時の影響軽減のノウハウが主に書かれていた。

大まかな内容をまとめると以下のとおり。

- drainする際に可用性(アプリが止まらないように)を維持する方法
- Podの起動優先順位
- Podのヘルスチェック機能
- Pod配置の制御
  - `nodeAffinity`はどのノードに配置するかを制御
  - `podAffinity`はどのPodと同じノードに配置するかを制御
  - `podAntiAffinity`は`podAffinity`と逆で、条件と一致したPodがいないノードに配置
  - `topologySpreadConstraints`はゾーンごとにPodを配置

本章が個人的にとても知りたかった内容で、以下のことを学べたのはとても良かった。

- ノードをメンテする際は`drain`するだけだと最悪アプリが止まってしまうので、`PodDisruptionBudget`を設定したほうが良い
- ユースケースに応じたProbeを設定するのが良い
- ゾーンごとにPodを配置する方法
  - `topologySpreadConstraints`の課題については以下の記事を参照
  - [[Kubernetes] PodのAZ分散を実現するPod Topology Spread ConstraintsとDescheduler](https://zenn.dev/tmrekk/articles/07f30b09c26b50)

### Kubernetesにおけるバッチ処理

大まかな内容は以下のとおり。

- Jobのリトライ制御、一時停止
- Indexed Jobについて
  - **backoffLimitはジョブが失敗した場合に`backoffLimit-1`回リトライされるとあるが、-1回は間違いなので要注意**
- Jobの自動削除と失敗条件の設定、追跡
- CronJobについて

また、より柔軟にバッチ処理をしたい場合は[Argo Workflows](https://argoproj.github.io/argo-workflows/)を使うと良いとのこと。

`Arogo Workflows`について、主に以下の内容を書かれていた。

- Jobの並列化と依存定義
  - stepsを使う場合
  - withItemsを使う場合
  - DAGを使う場合
  - whenによる実行制御
- パラメータの参照
- Workflows終了時の制御
  - メール送信など

`Argo Workflows`の実用的な例が多く紹介されていて、k8s + Argo Workflowsをゴリゴリ使う環境だと結構活かせそうだなと感じた。
あと、`GitHub Actions`みがあるなぁと読みながら思った。CI/CDパイプラインを組むなら、大体こういう機能が必要になってくるから、結果的に似ているんだろうなぁって素人ながら思った。

### Kubernetesにおけるステートフルなコンテナ運用
DBなどの永続データの正しい扱い方について主に書かれていた。

- データベースのコンテナ化
  - リソース圧迫により、Podが他のノードにに退避される可能性がある
  - その対策として、OperatorまたはStatefulSetとPodDisruptionBudgetを使う方法がある
- ステートフルなワークロードはStatefulSetを使うのが一般的
  - StatefulSetで作ったPodはHeadless Serviceを使えるため、コンテナ同士が強調して動作するユースケースに適している
		- Podに一意のFQDNが割り当てられて、Pod同士はそれで通信できるという理解をした
		- Headless Serviceについては[こちら](https://eng-blog.iij.ad.jp/archives/9998#:~:text=options%20ndots%3A5-,%E3%83%98%E3%83%83%E3%83%89%E3%83%AC%E3%82%B9%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9,-Service%E3%83%AA%E3%82%BD%E3%83%BC%E3%82%B9%E3%81%AB)を読むと雰囲気をつかんだ
	- ノード障害時の注意点
		- Podは逐次、作成・削除される
		- PodがTerminating状態でスタックしてしまった場合は次の処理が始まらない
		- 紐付けられているPVも使えないので新しいPodを起動できない
		- その場合はPodを強制削除するか、[Non-Graceful Node Shutdown](https://kubernetes.io/blog/2022/12/16/kubernetes-1-26-non-graceful-node-shutdown-beta/)機能を使う
- ボリューム
	- PV、PVC、Ephemeral Volumeの紹介
	- ボリュームのバックアップ
	- ReadWriteOnceなどのアクセスモードについて

### Kubernetesにおける負荷分散

どのようなリソースを使ってリクエストの負荷分散をするか、について主に書かれていた。

- LBによるL4負荷分散
	- ClusterIPとNodePortはkube-proxyと連携してiptablesや[IPVS](https://www.designet.co.jp/faq/term/?id=TFZT)を使って負荷分散する
	- LBは自分で用意するか、クラウドプロバイダ(AWSやGCPなど)が用意している物を使うか
		- クラウドプロバイダの場合はLBの料金もかかるので要注意
	- オンプレだとMetalLBとoctavia-ingress-controllerを使える
	- 独自のLBも実装できる
		- https://github.com/kubernetes/cloud-provider で定義されているインターフェイスを満たすようにしてあげる必要がある
- IngressリソースによるL7負荷分散
	- Ingress NGINX Controller などのIngress LBがある
	- NGINXなどはPodとしてデプロイされるので、NodeSelectorやAffinityなどを使ってリソースが十分なノードにPodの配置するなど、考慮する必要がある
- Gateway APIの利用
	- k8s公式のIngress API、現時点ではベータ版
	- Gateway APIは以下の３つのリソースに分離されていて、各リソースは担当者(クラスタ管理者やアプリ開発)ごとに管理できるようになっていて疎結合
		- GatewayClass
		- Gateway
		- xRoute(xはHTTPやgRPCなどのプロトコル)
- 送信元のIPの固定
	- LBで負荷分散すると送信元のIPが変わることがあるので、それを回避する方法について

個人的に「なるほど！」と思ったのは以下の内容で、勉強になった。

- Ingressを使う際はPodとしてデプロイされること、Podの配置を考慮すべきことについてはとても勉強になった。
- gRPCを使った負荷分散の注意点
	- gRPCはHTTP/2なので、単一のTCPコネクションで複数の通信という流れなので、サーバーを増やしても接続済みのコネクションを使うので負荷分散されない
	- よって、HTTP/2に対応したLBを使う必要がある
- LBで負荷分散すると送信元のIPが変わることがある

## 第3章：KubernetesにおけるInfrastructure as Code

## 第4章：Kubernetesにおけるアプリケーション運用

## 全体の感想
全体通して、ザーッと以下のことを感じた。総合的に大満足な書籍だった。

- 良かった点
	- 全体通してインデックスを貼るような感覚だった、まさに「知識の地図」だった
		- ルートを示してるから、細かいところは実際に自分で歩いて確認してみてねってスタンスだと感じた
	- 詳細は基本的に公式のリンクを参照という感じで誘導しつつ、機能の紹介やユースケース、注意点やベストプラクティスなど、幅広く触れていた  
	- 自分のレベルではまだ知らないこと、良くわからない部分も多かったが、それらを知れたこと、それをきっかけに深掘りできた
- あると嬉しい点
	- 全体的に図がもう少しあると嬉しいかも？
		- 例えば、送信元IPアドレスの特定について説明するときに図があるとわかりやすかったかも？
	- 実行例がもう少しあると嬉しいかも？
		- マニフェストの説明があるけど、実際それを使って実行してみた結果や、説明した内容の確認方法などがあるとなおわかりやすいかも？
		- ただ、知識の地図というスタンスから離れてしまう感じもあるので、実行例を含めるのは少しやり過ぎなのかもしれない？

著者のみなさん、ありがとうございました&お疲れ様でした。

## 参考資料
- [[Kubernetes] PodのAZ分散を実現するPod Topology Spread ConstraintsとDescheduler](https://zenn.dev/tmrekk/articles/07f30b09c26b50)
- https://www.a10networks.co.jp/glossary/how-do-layer-4-and-layer-7-load-balancing-differ.html
- https://kubernetes.io/docs/reference/networking/virtual-ips/
- https://kubernetes.io/ja/docs/concepts/workloads/controllers/statefulset/
- https://eng-blog.iij.ad.jp/archives/9998
- https://qiita.com/ysakashita/items/ad1f13e2af99969c8e9e