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
      content: nginxのconfで環境変数を使う方法

date: 2023-08-06
outline: deep

title: "nginxのconfで環境変数を使う方法"
---

# {{ $frontmatter.title }}

以前、Reactの学習の一環としてNature Remoのウェブアプリを作っていた。

https://github.com/skanehira/webremo

しばらく放置していたが、そろそろk8sにデプロイしてインターネットから使えるようにするため、nginx周りを整えていこうとしている。
Nature RemoのAPIはCORSがあるためブラウザから直接APIを叩くことができないので、nginxプロキシ機能を使ってAPIを叩くようにする。

## nginxのconfで環境変数を使う

本題だが、プロキシにtokenを付与した状態でAPIを叩くようにするため、`nginx.conf`に以下の設定をしている。

```
server {
	add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';

	location /api/ {
		proxy_pass https://api.nature.global/;
		proxy_set_header Authorization "Bearer ${TOKEN}";
	}
}
```

この`${TOKEN}`が環境変数だが、このままでは使えないので`envsubst`というのを使う。

compose.yamlに以下のような設定を行う。

```yaml
  reverse_proxy:
    image: nginx:1.25.1
    container_name: reverse_proxy
    ports:
      - 3000:80
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/nginx.conf.template
    command: bash -c "envsubst < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
    environment:
      TOKEN: ${TOKEN}
```

これで`.env`に`TOKEN=your_token`を設定した状態`docker compose up`すると環境変数の値が設定された状態のconfigが`/etc/nginx/conf.d/default.conf`に生成される。

```sh
$ curl -s localhost:3000/api/1/devices | jq   
[
  {
    "name": "Remo 3",
    "id": "e0e57791-b85c-42c6-8a5b-ee2286a07eaf",
    "created_at": "2021-07-09T10:32:58Z",
    "updated_at": "2023-08-06T12:07:51Z",
    "mac_address": "xxxxxxxxxxxxxxxxxx",
    "bt_mac_address": "xxxxxxxxxxxxxxx",
    "serial_number": "xxxxxxxxxxxxxxxxxxx",
    "firmware_version": "Remo/1.12.2",
    "temperature_offset": 0,
    "humidity_offset": 0,
    ...
  },
  ...
]
```

## 参考情報
- https://www.baeldung.com/linux/nginx-config-environment-variables
