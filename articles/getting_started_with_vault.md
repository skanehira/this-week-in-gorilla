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
      content: おうちk8sクラスタにVaultを構築する
  - - meta
    - property: og:image
      content: https://raw.githubusercontent.com/skanehira/this-week-in-gorilla/main/assets/img/HashiCorp_PrimaryLogo_Black_RGB.png

date: 2023-06-25
outline: deep

---

# Vaultに入門する

先日[おうちk8sクラスタにVaultを構築](./build-vault-on-k8s.md)したので、Vaultを完全理解するため入門する。

https://github.com/hashicorp-japan/vault-workshop-jp をベースにやっていく。

## Vault CLIのインストール
[公式ドキュメント](https://developer.hashicorp.com/vault/tutorials/getting-started/getting-started-install)に沿ってインストールする。

```sh
$ brew tap hashicorp/tap
$ brew install hashicorp/tap/vault
$ vault --version
Vault v1.14.0 (13a649f860186dffe3f3a4459814d87191efc321), built 2023-06-19T11:40:23Z
```

## Hello Vault
Vaultサーバーにログインする。tokenは構築時にメモしたRoot Tokenを使う。
問題なければtokenなどが表示される。

```sh
$ export VAULT_ADDR=http://pi1:30820
$ vault login                       
Token (will be hidden): 
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                xxxxxxxxxxxxxxxxxx
token_accessor       xxxxxxxxxxxxxxxx
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]
```

[こちら](https://github.com/hashicorp-japan/vault-workshop-jp/blob/master/contents/token.md#root-token)によると、Root Tokenは最初の設定に使ったあとに破棄して新しいtokenを作ったほうが良いらしいが、一旦後回し。

現在有効になっているシークレットエンジンを確認する。

```sh
$ vault secrets list
Path          Type         Accessor              Description
----          ----         --------              -----------
cubbyhole/    cubbyhole    cubbyhole_f62d42bd    per-token private secret storage
identity/     identity     identity_c3977962     identity store
sys/          system       system_4095113b       system endpoints used for control, policy and debugging
```

::: info シークレットエンジンとは

[公式ドキュメント](https://developer.hashicorp.com/vault/docs/secrets)を読むと、エンジンは以下のことをするようだ  
名前の通りって感じ

- データを保存、生成、暗号化する
- シークレットエンジンはReidsなどのようなKVから
  他のサービスなどに接続して動的クレデンシャルを生成するするものがある
- Vaultへのリクエストがシークレットエンジンに転送され処理される
- シークレットエンジンは仮想ファイルシステムに似た振る舞い（読み書きなど）をする

:::

これで準備は整ったので簡単なkvから触ってみる。  
[こちら](https://github.com/hashicorp-japan/vault-workshop-jp/blob/master/contents/kv.md)に沿ってやってみる。

```sh
# KVのシークレットエンジンを有効化
$ vault secrets enable -path=kv -version=2 kv
Success! Enabled the kv secrets engine at: kv/

# バージョンニングを有効にする
$ vault kv enable-versioning kv
Success! Tuned the secrets engine at: kv/

# データを保存
$ vault kv put kv/iam name=kabu password=passwd
== Secret Path ==
kv/data/iam

======= Metadata =======
Key                Value
---                -----
created_time       2023-06-25T09:01:32.457141967Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

# 保存したデータを取得
$ vault kv get kv/iam
== Secret Path ==
kv/data/iam

======= Metadata =======
Key                Value
---                -----
created_time       2023-06-25T09:01:32.457141967Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

====== Data ======
Key         Value
---         -----
name        kabu
password    passwd
```

## ポリシーを使ってアクセスを制御する
[こちら](https://github.com/hashicorp-japan/vault-workshop-jp/blob/master/contents/policy.md)に沿ってやっていく。

最初にトークンについて以下の説明があった。

> ここまでRoot Tokenを利用して様々なシークレットを扱ってきましたが、実際の運用では強力な権限を持つRoot Tokenは保持をせずに必要な時のみ生成します。通常、最低限の権限のユーザを作成しVaultを利用していきます。また認証も直接トークンで行うのではなく信頼できる認証プロバイダに委託することがベターです。

基本的に認証プロバイダに委託してトークンをもらい、それを使うのが一般的らしい。

早速ポリシーについて確認する。

```sh
# ポリシー一覧
$ vault list sys/policy
Keys
----
default
root

# defaultのポリシーのcapabilitiesを確認
$ vault read sys/policy/default
Key      Value
---      -----
name     default
rules    # Allow tokens to look up their own properties
path "auth/token/lookup-self" {
    capabilities = ["read"]
}

# Allow tokens to renew themselves
path "auth/token/renew-self" {
    capabilities = ["update"]
}
...
```

各endpointにcapabilitiesがあって、それがどんな権限があるかを表している。

試しにdefaultのポリシーのtokenを発行してさっき作ったkvにアクセスできるかを確認する。

```sh
$ vault token create -policy=default
Key                  Value
---                  -----
token                xxxxxxxxxxx
token_accessor       xxxxxxxxxxx
token_duration       768h
token_renewable      true
token_policies       ["default"]
identity_policies    []
policies             ["default"]
$ export DEFAULT_TOKEN=xxxxxxxxxxxx
$ export ROOT_TOKEN=xxxxxxxxxx

$ VAULT_TOKEN=$DEFAULT_TOKEN vault kv get kv/iam
Error making API request.

URL: GET http://pi1:30820/v1/sys/internal/ui/mounts/kv/iam
Code: 403. Errors:

* preflight capability check returned 403, please ensure client's policies grant access to path "kv/iam/"
```

新しくポリシーを作って、tokenを作ってkvにアクセスできるようにしてみる。

```sh
$ nvim my-kv-policy.hcl
path "kv/*" {
  capabilities = ["read", "list"]
}

# ポリシーを作成
$ VAULT_TOKEN=$ROOT_TOKEN vault policy write my-kv-policy my-kv-policy.hcl 
Success! Uploaded policy: my-kv-policy

# 作成されたことを確認する
$ vault policy read my-kv-policy
path "kv/*" {
  capabilities = ["read", "list"]
}

# ポリシーに紐付けられたtokenを発行する
$ VAULT_TOKEN=$ROOT_TOKEN vault token create -policy=my-kv-policy
Key                  Value
---                  -----
token                hvs.CAESIAnw8Nr1R88ZrRXOSdLP6crtbQzJfTsjiwRy2471eJ1-Gh4KHGh2cy5wejI4M1dNWENEdnZtZE9jM1NaT0o3YkI
token_accessor       xj6liTAQe4g65uaAPNm8ZasN
token_duration       768h
token_renewable      true
token_policies       ["default" "my-kv-policy"]
identity_policies    []
policies             ["default" "my-kv-policy"]

# tokenwを使ってkvからデータ取れることを確認
$ VAULT_TOKEN=$MY_TOKEN vault kv get kv/iam
== Secret Path ==
kv/data/iam

======= Metadata =======
Key                Value
---                -----
created_time       2023-06-25T09:01:32.457141967Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

====== Data ======
Key         Value
---         -----
name        kabu
```

最後に[こちら](https://developer.hashicorp.com/vault/docs/commands/token/revoke)をみて、払い出したtokenを無効化しておく。

```sh
$ vault token revoke $DEFAULT_TOKEN
$ VAULT_TOKEN=$DEFAULT_TOKEN vault kv get kv/iam
Error making API request.

URL: GET http://pi1:30820/v1/sys/internal/ui/mounts/kv/iam
Code: 403. Errors:

$ vault token revoke $MY_TOKEN              
Success! Revoked token (if it existed)
$ VAULT_TOKEN=$MY_TOKEN vault kv get kv/iam 
Error making API request.

URL: GET http://pi1:30820/v1/sys/internal/ui/mounts/kv/iam
Code: 403. Errors:

* permission denied
```

## さいごに
とりあえず簡単なKVとポリシーについては理解した。
次は認証プロバイダからtokenを払い出し、そのtokenを使ってシークレットにアクセスできるようにするのをやってみる予定。

最終的には、以下の要件を満たすような構成を作れれば良さそう。

- 認証済みのアカウントがシークレットを制御する
- 以下のシークレットをローテーションさせる
	- SSH鍵
	- GitHubのPAT

## 参考資料
- https://github.com/hashicorp-japan/vault-workshop-jp
- https://developer.hashicorp.com/vault/docs/commands/token/revoke
