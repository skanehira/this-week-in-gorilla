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

それくらいのレベルの自分が読んだ感想を書いていく。  
メモレベルの内容だけど、誰かの役に立ったら嬉しいし、これをざーと読んで気になる人はぜひ買って読んでほしい。

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

### 感想
個人的に「なるほど！」と思ったのは以下の内容で、勉強になった。

- Ingressを使う際はPodとしてデプロイされること、Podの配置を考慮すべきことについてはとても勉強になった。
- gRPCを使った負荷分散の注意点
	- gRPCはHTTP/2なので、単一のTCPコネクションで複数の通信という流れなので、サーバーを増やしても接続済みのコネクションを使うので負荷分散されない
	- よって、HTTP/2に対応したLBを使う必要がある
- LBで負荷分散すると送信元のIPが変わることがある

## 第3章：KubernetesにおけるInfrastructure as Code

IaCやCI/CDについて主に書かれてた。

### マニフェストの管理とGitOps
- マニフェストの管理はGitOpsを使うのが一般的
  - コンフィグとコードのリポジトリをそれぞれ用意する
  - コンフィグにはマニフェストを保管し、コンフィグ = クラスタの状態とする
  - コードはアプリのコードを保管し、CI(テストやイメージビルドなど)が通ってイメージがpushされたタイミングでコンフィグのマニフェストを書き換えてクラスタに適用する
- コンフィグ用リポジトリで実行するCIの内容
  - [kubeconform](https://github.com/yannh/kubeconform)を使ったマニフェストのチェック
  - [Open Policy Agent](https://www.openpolicyagent.org)などを使ったマニフェストのポリシーのチェック
  - [Pluto](https://github.com/FairwindsOps/pluto)を使った廃止・削除されたAPI Versionのチェック
- コードリポジトリで実行するCIの内容
  - 実行環境の影響を受けづらくするため、アプリのビルドもDockerfileでやったほうがよい
  - ベースイメージに入っているライブラリなどの影響で脆弱性を持つ場合があるので、Trivyなどを使って脆弱性診断するとよい
  - SBOM(go.modなど)を使った脆弱性スキャンを高速化する方法もある
- GitOpsにおける断続的CDとCIOps
- CIOpsはクラスタ外にあるコンフィグ用リポジトリに対してマージされたタイミングでCIジョブをトリガーしマニフェストをk8sクラスタに適用するやり方
  - これは基本的にアンチパターンとされていて、理由は以下とおり
    - すべてのNamespaceにマニフェストを適用するため強い権限をクラスタ外に用意しないといけない
    - クラスタ外からクラスタ操作をする必要があるので、グローバルIPを付与したりとCIからアクセスできるようにネットワークを構築するor露出する必要がある
    - 複数の環境(開発、プロダクションなど)があると、CIでデプロイ先の制御をしたりするため、管理が複雑になりがち
  - ただ、複数のクラスタを一元管理する場合はCIOpsのが適している場合もある
- GitOpsはクラスタ内にDeploy Agentを配置して、リポジトリからのマニフェストの取得とk8sクラスタの適用を実行するやり方
  - Agentがリポジトリに対するRead権限のみがあれば良い
  - Agentがクラスタ内でコンテナとして起動するため、ClusterIPを使ってクラスタに対してマニフェストを適用できる
    - 適用するクラスタに対する権限のみがあれば完結
- コンフィグ用リポジトリの環境ごと切り替える戦略について
  - 環境ごとにブランチを切り替える
    - developはステージング用、mainはプロダクション用
    - developでマニフェストを適用して動作確認してからmainにマージしてプロダクションに適用
  - ディレクトリごとにディレクトリを切り替える
    - stgとprdのディレクトリをそれぞれ用意する
    - 差分が発生した場合検知がしづらいデメリットがある
    - 共通のマニフェストをbaseディレクトリなどに分けて、環境差異の部分はstgとprdに配置してKustomizeを使ってマージするのがよい

### 効率的なマニフェスト管理
- Helmを使う
  - Helmはk8s上で動かすアプリケーションのパッケーマネージャー
  - Helmは2種類のバージョンがある
    - Chartのバージョンとアプリケーションのバージョン
    - Helmはマニフェストを生成してアプリケーションをk8sにデプロイする
    - `helm template`を使えばマニフェストを出力できる
- Kustomizeを使う
  - リソースを追加する`Generator`と変更する`Transformer`の2つの仕組みがある
    - 個人的によく見かける`resources`でマニフェストを結合するのが`Generator`だった
  - `Transformer`がよく使われている
    - 例えばNamespaceを書き換えたりなど一部のパラメータを環境に応じて変更する
    - ビルトインで提供されているもので`Strategic Merge Patch`と`JSONPatch`がある
    - `Strategic Merge Patch`は配列そのものを書き換えるが、`JSONPatch`を用意すれば配列の特定の要素を書き換えることができる
    - `Strategic Merge Patch`は`$patch: delete`でリソースの削除ができる
  - Helm Chartとの連携
    - `kustomize build --enable-helm`で連携できる
  - ディレクトリ構成は大きく`base`と`overlays`の2つ別れている(よく見るやつ)
    - `base`は共通のマニフェスト
    - `overlays`は環境ごとのマニフェスト(patch系もそこにおく)

### Argo CDによるGitOps
- Argo CDは非HA構成なので、一時停止を許容できない環境には非推奨
  - 疑問点として、基本クラスタはHA構成にすることが多いと思っていて、そうなるとArgo CDは基本非推奨になるんじゃないか？
- ブランチ戦略の場合の同期設定
  - Argo CDのAppliactionリソースを使う
  - フェッチするリポジトリと適用先のクラスタとNamespaceを指定する
- リポジトリと自動同期とリソースの自動削除
  - Appliactionリソースはデフォルトではクラスタの同期とリソースの削除の同期はされないで設定が必要
- 同期の順序制御と一時的なタスクの実行
  - 同期はいくつかフェーズがあって、各フェーズでフック処理ができる
- Appliactionリソース辞退もGitOpsで管理するのが一般的
- Argo CDはAppliactionリソースの状態を通知できる
  - 通知タイミングと通知内容のテンプレートを設定できる
- Argo CD AppliactionSet を使うと複数のAppliactionリソースを生成できる
  - つまり複数のリソースを効率よく管理できる

### External Secretsを用いた機密情報の管理

主に機密情報をk8sで管理できる`External Secrets`について書かれていた。

- `External Secrets Operator`はいくつかのカスタムリソースから成り立っている
  - `SecretsStore`や`ExternalSecrets`など
  - `SecretsStore`は機密情報を格納する場所で、プロバイダー(AWS Secrets Managerなど)として定義するリソース
  - `ExternalSecrets`は`SecretsStore`から参照、取得する機密情報を定義するリソース、取得した機密情報はSecretsに登録される
- templateを使って様々な形式のSecretsを生成できる
- `refreshInterval`の注意点
  - 外部プロバイダーはAPI呼び出し回数に応じた課金体系の場合がある
  - インターバルが短いとAPIの呼び出し回数が増えて金額も増えるので要注意

### ExternalDNSを使った外部DNSプロバイダとの連携

k8sクラスタでServiceなどを作るとIPが払い出されるけど、そのままだと扱いづらいので外部のDNSプロバイダと連携できる`ExternalDNS`について書かれてた。

- Service(LB)との連携
- Ingressとの連携
- DSNEndpointを使う
- セフルホストDNS(CoreDNS)を使う

DNSについて、昔勉強したけど何も覚えていないので内容は理解できなかったけど別途勉強する予定。

### CertManagerによる証明書の管理の自動化

主にk8s上で、アプリで使う証明書の管理をどのように自動化するのかについて書かれていた。

- `CertManager`を使って証明書の管理を自動化している
  - `CertManager`はRFC8555で標準化されているACMEのプロトコルを使っている
  - `HTTP-01`、`DNS-01`といった証明書発行を依頼したクライアントが証明書のドメインを所有しているかをチェックするチャレンジ方式がある
- 証明書の発行と更新について

### 感想
自宅k8sに乗せているアプリケーションのCDをどうやるのが良いのかについてちょうど考えていたところだったので、本章は非常に勉強になった。
特にGitOpsを使ったCDはとても有益な情報だった。

また、kustomizeの一般的なディレクトリ構成について知れたの大きかった。

一方で、複数クラスタの管理はCIOpsが良い場合もあると書いてあったが、具体例が少なかったのであんまりイメージできなかった。
ここはもうすこし解説があると自分みたいな初心者は嬉しいかも？

## 第4章：Kubernetesにおけるアプリケーション運用

k8sにアプリを乗せた際の注意点、課題や対処法などについて主に書かれてた。  
本書のメインと言ってよいほどのボリュームと内容で、k8sを運用する側として知っておきたいことがたくさんあった。  
この章を読むためにだけ買っても良いくらい価値があると思う。  

### アプリケーションのアップデート戦略

- ローリングアップデート
  - アプリのコンポーネントを段階的に更新していくことでダウンタイムを最小にする手法
- ブルーグリーンデプロイ
  - 新旧環境を1つずつ用意して、DNSやルーターで通信を切り替える
  - 新環境へのリクエストの割合を徐々に増やしていき、負荷や不具合を確認しつつ切り替えていく
  - ただ、リソースが2倍になるというデメリットがある
- カナリアリリース
  - 一定の割合のヘビーユーザに新環境を使い、負荷や機能のテストを行い、問題なければ段階的に新しい環境に切り替える
  - なにかモンd内がある場合はロールバック
- ServiceとDeploymentによるトラフィック制御について
  - 簡易なカナリアリリース、ブルーグリーンデプロイでは使えるが、細かな条件を設定するには向いていない
- `Istio`によるトラフィック制御
  - `Istio`を使うk8sのアプリケーション間の通信の管理下、制御、保護を中央集権的に管理できる
- `Argo Rollouts`による高度なデプロイ
  - `Argo Rollouts`を使ってブルーグリーンデプロイやカナリアリリースをやる方法

### アプリケーションのスケーリング戦略

アプリのスケーリングの方法について主に書かれていた。

- HPAによる水平スケーリング(要はスケールイン/スケールアウト)
  - CPU/メモリ使用率をスケール指標として使える
  - Prometheusを導入することで、CPUやメモリ以外のリソースを指標にできる
- VPAによる垂直スケーリング(要はスケールアップ/スケールダウン)
  - VPAは`Recommender`、`Updater`、`Admission Controller`の3つのコンポーネントから成り立っている
  - `Recommender`は推奨リソース量を計算するやつ
  - `Updater`は計算された値をもとに対象Podを排除する
    - Podの作成はDeploymentなどに行われるので、削除だけ
  - Podが削除されるので、場合によってはアプリがダウンにつながる可能性があるので、PodDisruptionBudgetなど活用するとよい
  - ちなみに、今はPodを削除せずin-placeな更新のVPA実装が進んでいるとのこと
- MPAによる多次元スケーリング
  - HPAとVPAを組み合わせたスケーリング
  - HPAとVPAは非同期で動くので、単純にHPAとMPAを組み合わせると計算のタイミングによっては水平・垂直スケーリングが同時に実行されてしまうことがある
  - のでMPAはCPUメトリクスに基づいた水平スケーリング、メモリに基づいた垂直スケーリングをいい感じに組み合わせている
    - 個人的に、CPU/メモリが両方がしきい値を超えてスケーリングする場合、同様の問題が起きるのではないのか？という疑問がある
- Cluster Autoscalerによるクラスタのスケーリング
  - 要はノードのスケーリング

### kubernetesバージョンのアップグレード戦略

kubernetesのバージョンアップに伴うAPIの変更の対応などについて書かれた。

- Kubernetesがセマンティックバージョンニング
  - 各クラウドは異なるので要注意
- Kubernetesは`Group`、`Version`、`Kind`の3つのリソース種別がある
  - マニフェストに書く`apiVersion`は`Group`と`Version`を組み合わせたもの
- 削除されるリソースへの対応
  - kubernetesの公式マイグレーションガイドを確認する
  - kube-apiserverに直接問い合わせる
- Feature Gateを使ってAlphaとBetaの機能の有効化/無効化ができる

### 組織とNamespaceとクラスタの分離戦略

- Namespaceの概要
  - CPUやメモリ、NetworkPolicyなどのリソースを論理的に分離できる
- Namespaceの分け方と単位
  - サービスやチーム単位で切るとよい
  - ステージングとプロダクションで切るのは良くない
    - クラスタアップグレードするときに本番に影響が発生する可能性がある
    - マニフェストの管理が煩雑になる
  - Hierarchical Namespaceで階層構造を作れる
  - マルチクラスタ・クラウドで分ける

### 認可処理と監査ログ

- 認可処理は4種類がある
  - Node、Webhook、ABAC、RBAC
  - ABACは属性ベースの認可、 RBACはロールベースの認可、Webhookは外部に移譲できる
  - RBACの4つのリソースについて
    - Role/ClusterRole: どのようなリクエストを許可するかを定義する
    - RoleBinding/ClusterRoleBinding: 定義したロールをユーザ、グループ、ServiceAccountに紐付ける
- 監査ログについて
  - k8sは監査ログを出力する機能がある
  - 監査ポリシーのレベルがある
  - 監査バックエンドがログ出力先(ファイル出力またはWebhook)を指定する
  - 監査ログはDatadogなどを使って分析できる

### Kubernetsにおける通信制御の手法

- `NetworkPolicy`リソースでの制御
  - `NetworkPolicy`はPodのインバウンド・アウトバウンド通信を許可/遮断できる
  - `NetworkPolicy`の機能自体はCNIプラグインに実装を移譲しているため、使っているプラグインが対応していない場合もある
  - Ciliumは`NetworkPolicy`シミュレーターを提供しているので、ポリシーの適用結果を視覚で確認できたりする
- `Service`リソースで制御
  - CIDRを使うことで、アクセス元のIPアドレス範囲を制限できる
- `Ingress`リソースで制御
  - アノテーションや設定ファイルを使ってアクセス元のIPアドレスを制限できる

### 外部IPプロバイダとの連携

- OIDCを使って外部IDプロバイダに移譲できる
  - Googleを使った例を紹介されている
- OAuth2 ProxyによるIngressのアクセス制限
  - アプリにアクセスする前段にOAuth2による認証の例が紹介されている

### マニフェストの検査
マニフェストのフィールドの組み合わせが多岐にわたるので、ベストプラクティスになっているかを確認する手段について書かれた。

- `Open Policy Agent`
  - ポリシーをコード化
  - 独自の宣言型のクエリ言語Regoを使って実現している
- ポリシー検査ツールである`Conftest`
  - YAMLやJSONなどの構造化データに対してテストできるツール
  - ポリシーの設定例など
- `Gatekeeper`によるポリシーの強制
  - `Gatekeeper`は`Admission Controller`として動作して、デプロイの際にマニフェストを検査する
  - マニフェストを適用する際にポリシーに違反している場合はエラーになる
  - 制約を課する対象のリソース種別やNamespaceを制御できる
- `gator`でCIやローカル環境で制約の動作検証ができる
- `Konstrain`による制約の生成
  - `Conftest`と`Gatekeeper`は形式が異なるので、両方を使う場合ポリシーの管理が面倒
  - `Konstrain`はそれぞれのポリシーの形式を生成できるので、この問題を回避できる
- `Pod Security Admission`を使った検査
  - v1.23から提供されるようになった機能
  - 3つのポリシーがある
    - Privileged
    - Baseline
    - Restricted
  - Deploymentなどのリソースの場合、Pod作成時に検査が実行される
    - 例えばポリシーに反する場合、Deploymentの作成は成功するが、Pod作成は失敗し、Replicasetのイベントでエラーになる

### アプリケーションの可観測性と監視

- 可観測性の3つの柱
  - トレース: あるリクエストがどのようにアプリケーション間で伝搬されているかを追跡できるデータ
    - トレースデータを収集する代表的なツールとしてZipkinがある
    - 他にもIstioやKumaがある
  - メトリクス: 変化するシステムの状態(CPU、メモリ、ストレージI/Oなど)を表した時系列データ
    - 代表的なソフトウェアにPrometheusがある
  - ログ: 一般的にタイムスタンプとともに出力される文字列
    - コンテナログはコンテナが消されると消えるので、永続化しておく必要がある
    - Fluentd/FluentdBitをDaemonSetとして各ノードの動作させておくというやり方がある
- データの可視化
  - Grafanaを使って収集した複数のデータをまとめて観察できる
  - データを収集するツール各自でそれぞれ定義したデータ構造を標準化したOpenTelemetryがあるので、これに従うと実装コストが下げられる
- 監視
  - 収集した各種のデータを参照して、移譲が検知されたらアラートを通知することが「監視」
  - Prometheusには監視機能がある
  - ランタイムレベルで監視できるFalcoがある
    - Falcoはシステムコールを分析して意図しないプロセスやファイルの生成などを検知できる


なんとなく雰囲気で理解していた可観測性について割りやすく書かれていたのが良かった。  
1点気になるところは、Falcoを使う場合はその分パフォーマンスも下がるので、使うときはどれくらいパフォーマンスが下がるを調査して許容範囲内かどうかを見ておくと良いと思った。

## 全体の感想
全体通して、ザーッと以下のことを感じた。総合的に大満足な書籍だった。

- 良かった点
	- 全体通してインデックスを貼るような感覚だった、まさに「知識の地図」だった
	- 詳細は基本的に公式のリンクを参照という感じで誘導しつつ、機能の紹介やユースケース、注意点やベストプラクティスなど、幅広く触れていた  
  - 単純な機能などの紹介だけじゃなくて、なぜそうしたいのかといったユースケースも添えて説明しているのが非常にわかりやすかった
	- 自分のレベルではまだ知らないこと、良くわからない部分も多かったが、それらを知れたこと、それをきっかけに深掘りできた
  - 想像以上にk8sのエコシステムがすごくて、至り尽くせりだなと知ることができた
    - k8s自体がオーケーストレーションの理想形という感がある(小並感)
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
