# images フォルダ

このフォルダにサイトで使用する画像を格納します。

## メンバー写真の差し替え方法

写真は `data/members.json` の各メンバーの `photo`（表面）・`photoBack`（裏面）フィールドに
`images/` フォルダ内のファイルパスを指定してください。

```json
{
  "name": "真夜 詩音",
  "photo":     "images/mayo-front.jpg",
  "photoBack": "images/mayo-back.jpg",
  ...
}
```

- `photo` — カード表面に表示される写真
- `photoBack` — カード裏面（プロフィール画面）に表示される写真
- どちらも `null` のままにするとイニシャルが表示されます
- `photoBack` が `null` の場合、表面の `photo` が裏面にも使用されます

## 推奨ファイル名・サイズ

| 用途 | 例 | 推奨サイズ |
|---|---|---|
| メンバー表面写真 | `mayo-front.jpg` | 400×400px、正方形推奨 |
| メンバー裏面写真 | `mayo-back.jpg` | 400×400px、正方形推奨 |
| ヒーロー背景 | `hero-bg.jpg` | 1920×1080px |
| OGP画像 | `og-image.jpg` | 1200×630px |
| ファビコン | `favicon.ico` | 32×32px |
