# images フォルダ

このフォルダにサイトで使用する画像を格納します。

## 推奨ファイル名

| ファイル名 | 用途 |
|---|---|
| `og-image.jpg` | OGP画像 (1200×630px) |
| `favicon.ico` | ファビコン |
| `member-mayo.jpg` | 真夜 詩音 プロフィール写真 |
| `member-nagi.jpg` | 蒼井 凪 プロフィール写真 |
| `member-rei.jpg` | 黒羽 れい プロフィール写真 |
| `member-tsuki.jpg` | 星宮 つき プロフィール写真 |
| `member-mio.jpg` | 緋色 みお プロフィール写真 |

## メンバー写真の差し替え方法

`member.html` の各 `.member-photo` 要素内に `<img>` タグを追加してください。

```html
<div class="member-photo member-photo--1">
  <img src="images/member-mayo.jpg" alt="真夜 詩音">
</div>
```

`.member-photo-placeholder` の `<div>` は削除してください。
