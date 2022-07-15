# 🏃‍♀️ 実行手順

サーバを起動

```
node server.js
```

ターミナルに`🚀 app started. port:3000`と表示されたら OK

### 🔐 暗号化する

クエリパラメータ `text`に暗号化したい文字列を入れて、cURL やブラウザでリクエスト

```
curl 'http://localhost:3000/encrypt?text=apple'
```

実行すると暗号化されたテキストが返却される

```
yZzoNKpuTZS0YfvsBxSOMQ==
```

### 🔓 複合する

クエリパラメータ`encrypted_text`に複合したい文字列を入れて、cURL でリクエスト

```
curl 'http://localhost:3000/decrypt?encrypted_text=yZzoNKpuTZS0YfvsBxSOMQ=='
```

※URL セーフではないので、ブラウザでは実行できない。<br>

実行すると複合されたテキストが返却される

```
apple
```

### 🎫 URL セーフなトークンを発行する

ブラウザで以下にアクセス

```
http://localhost:3000/authorize?user_id=1
```

画面にトークンの値が返却される<br>
また、my_token という名前でトークンが cookie に保存される<br>
この状態で以下にアクセス

```
http://localhost:3000/verify
```

トークンの中身が解析された結果が返却される<br>
<img width="1168" alt="image" src="https://user-images.githubusercontent.com/44778704/179172508-78f70332-9cb1-4881-92b7-c302d98fc36c.png">
※トークンは cookie に入っているので、クエリパラメータで渡す必要はない<br>
※トークンの有効期限は 5 分にしているので `/atuhorize` してから 5 分以内に `/verify` を実行すること<br>
