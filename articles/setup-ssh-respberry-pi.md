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
      content: ラズパイのsshサーバー設定

date: 2023-07-01
outline: deep

---

# ラズパイのsshサーバー設定

以前に[4台のラズパイでk8sクラスタを組んだ](./raspberry-pi-cluster.md)際に、とりあえずsshはパスワードを使うようにしていたが、ちゃんと秘密鍵を使うように設定した方が良いので自分の備忘録用に設定手順を残していく。

## 環境情報

|           |                                                          |
|-----------|----------------------------------------------------------|
|OS         |Ubuntu Server 22.04.2 LTS(64bit)                          |
|ssh version|OpenSSH_8.9p1 Ubuntu-3ubuntu0.1, OpenSSL 3.0.2 15 Mar 2022|

## 流れ

以下の流れで設定をしていく。

1. 鍵を作成して、公開鍵をサーバーに登録
2. sshサーバーの設定
   - パスワードログインを無効化
   - rootログインを無効化
   - 空パスワード
   - 鍵認を証有効化

## 鍵作成と登録
[GitHubのドキュメント](https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)を参考に鍵を作成する。

```sh
$ ssh-keygen -t ed25519 -C "sho19921005@gmail.com" 
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/skanehira/.ssh/id_ed25519): /Users/skanehira/.ssh/pi1
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/skanehira/.ssh/pi1
Your public key has been saved in /Users/skanehira/.ssh/pi1.pub
...
```

公開鍵をサーバーに登録する。

```sh
# Client側で公開鍵の中身をコピー
$ pbcopy < ~/.ssh/pi1.pub 

# サーバー側でコピーした中身を`~/.ssh/authorized_keys`に追記
skanehira@pi1:~$ vim ~/.ssh/authorized_keys 

# パーミッションが600になっていることを確認、なっていなければchmodで変更する
skanehira@pi1:~$ ls -la ~/.ssh/authorized_keys 
-rw------- 1 skanehira skanehira 103 Jul  1 11:13 /home/skanehira/.ssh/authorized_keys
```

`~/.ssh/config`に鍵の設定を追加する。

```sh
Host pi1-local
  HostName pi1-local
  Port 22
  User skanehira
  UseKeychain yes
  IdentityFile ~/.ssh/pi1
```

試しにsshして、問題ないことを確認する。

```sh
$ ssh pi1-local
Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-1030-raspi aarch64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat Jul  1 11:30:42 JST 2023
...
```

## sshサーバーの設定
ラズパイで入れたUbuntuでは`cloud-init`を使っていて`/etc/ssh/sshd_config.d/50-cloud-init.conf`があるので、そちらの設定も変更していく。
といっても今回は`PasswordAuthentication no`に変えるだけ。

```diff
- PasswordAuthentication yes
+ PasswordAuthentication no
```

あとは`/etc/ssh/sshd_config`を変えていく。

```diff
- #PermitRootLogin prohibit-password
+ PermitRootLogin prohibit-password
- #PermitEmptyPasswords no
+ PermitEmptyPasswords no
```

`sshd`を再起動する。

```sh
root@pi1:/home/skanehira# systemctl restart sshd
```

パスワードでログインできないことを確認する。  
NOTE: `ssh pi1-local`だとsshの設定が効くのでip指定で確認を行う

```sh
$ ssh 192.168.3.16
skanehira@192.168.3.16: Permission denied (publickey).
```

## さいごに
今回は以下の理由で特にsshポートを変えなかった。ここらへんはど素人なので、セキュリティに詳しい人の意見を聞けたら嬉しいなと思うなどした。

- 家庭LANでしか使っていない（インターネットに露出していない）
- ポートを変えるのはお気持ち程度のもの、さほどセキュアにならないのではないかと思っている

## 参考記事
- [SSHの公開鍵ってなに?](https://qiita.com/angel_p_57/items/19eda15576b3dceb7608)
- https://zenn.dev/wsuzume/articles/26b26106c3925e
- https://docs.github.com/ja/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
