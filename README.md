# Petrich∅r 公式サイト — 編集ガイド

このドキュメントはサイト管理者向けの更新手順をまとめたものです。
**基本的にJSONファイルとindex.htmlを編集するだけで、コンテンツを更新できます。**

---

## ファイル構成

```
petrichor/
├── index.html          # トップページ（YouTube動画IDはここに記載）
├── member.html         # メンバーページ
├── news.html           # ニュース一覧ページ
├── contact.html        # コンタクトページ
├── style.css           # 全ページ共通スタイル
├── data/               # ★ コンテンツ更新はここを編集するだけ
│   ├── news.json       #   ニュース・お知らせ
│   ├── members.json    #   メンバー情報
│   └── contact.json    #   SNSリンク・連絡先
├── js/                 # スクリプト（通常は編集不要）
├── css/                # ページ別スタイル（通常は編集不要）
├── images/             # 画像ファイルを格納する
└── partials/           # ヘッダー・フッターの参照用HTML（SSI用）
```

---

## 1. ニュース・お知らせを更新する

**対象ファイル:** `data/news.json`

項目を追加・削除・並び替えるだけで自動反映されます。
**配列の先頭が最新記事**として扱われます。

```json
[
  {
    "date": "2024-12-01",      // 日付 (YYYY-MM-DD形式)
    "title": "タイトル",       // タイトル
    "text":  "本文。\n改行も使えます。", // 本文（\n で改行）
    "tag":   "RELEASE",        // タグ（LIVE / RELEASE / MEDIA / INFO など）
    "link":  null              // 関連URLがあれば記載、なければ null
  },
  ...
]
```

**表示件数について:**
- トップページ: 最新3件のみ表示
- ニュースページ (news.html): 全件表示

---

## 2. メンバー情報を更新する

**対象ファイル:** `data/members.json`

```json
[
  {
    "name":          "真夜 詩音",       // 表示名（日本語）
    "nameEn":        "Mayo Shion",      // 表示名（英語）
    "position":      "Vocal / Leader",  // 担当
    "initial":       "詩",             // 写真がない場合に表示されるイニシャル
    "photo":         "images/mayo.jpg", // 写真のパス（省略するとイニシャル表示）
    "colorClass":    "member-photo--1", // カードの色クラス（1〜5、変更不要）
    "colorRingClass":"member-color-ring--1", // リングの色クラス（変更不要）
    "colorHex":      "#9b5de5",        // 担当色（HEXカラー）
    "colorLabel":    "深紫",           // 担当色の名前
    "birthday":      "3月 ●日",        // 誕生日
    "birthplace":    "東京都",          // 出身地
    "height":        "158 cm",          // 身長
    "likes":         "雨音、古書",      // 好きなもの
    "comment":       "コメント文"       // メンバーコメント
  },
  ...
]
```

**メンバー写真を追加する場合:**
1. `images/` フォルダに写真ファイルを入れる（例: `mayo.jpg`）
2. `members.json` の `"photo"` に `"images/mayo.jpg"` と記載する

---

## 3. SNS・連絡先を更新する

**対象ファイル:** `data/contact.json`

3つのセクションがあります。

### 公式SNS (`officialSns`)
```json
{
  "platform": "X (Twitter)",       // 表示名
  "handle":   "@petrichor_idol",   // アカウント名
  "desc":     "ライブ情報・日常更新", // 説明文
  "url":      "https://x.com/...", // リンク先URL（#はプレースホルダー）
  "type":     "x"                  // アイコン種別（x / ig / yt / tt）
}
```

### メンバーSNS (`memberSns`)
```json
{
  "name": "真夜 詩音",
  "role": "Vocal / Leader",
  "accounts": [
    { "type": "x",  "handle": "@mayo_shion", "url": "https://x.com/..." },
    { "type": "ig", "handle": "@mayo_ig",    "url": "https://instagram.com/..." }
  ]
}
```

### 業務連絡先 (`business`)
```json
{
  "title": "メール",
  "label": "一般・業務お問い合わせ",
  "icon":  "✉",
  "value": "info@example.jp",
  "url":   "mailto:info@example.jp"
}
```

---

## 4. ヒーロー（トップページ最上段）の背景画像を差し替える

**対象ファイル:** `images/hero-bg.jpg`

1. **1920×1080px（フルHD）推奨**の画像を用意する
2. ファイル名を `hero-bg.jpg` にして `images/` フォルダに入れる
3. ブラウザを更新すると反映される

ファイル名・形式を変える場合は `css/index.css` の `.hero::before` 内の
`url('../images/hero-bg.jpg')` を変更してください。

> **注意:** 画像が存在しない場合は黒背景のまま表示されます。

---

## 5. YouTube動画を設定する

**対象ファイル:** `index.html`

`data-video-id` の値をYouTubeの動画IDに変更してください。

```html
<!-- 変更前 -->
<div class="yt-facade" data-video-id="YOUR_VIDEO_ID_HERE" ...>

<!-- 変更後（例） -->
<div class="yt-facade" data-video-id="dQw4w9WgXcQ" ...>
```

**動画IDの確認方法:**
YouTubeのURLが `https://www.youtube.com/watch?v=dQw4w9WgXcQ` の場合、
動画IDは `?v=` 以降の `dQw4w9WgXcQ` です。

---

## 6. 画像を追加・変更する

画像ファイルは `images/` フォルダに入れてください。

| 用途 | 推奨ファイル名 | サイズ目安 |
|---|---|---|
| メンバー写真 | `member-{名前}.jpg` | 400×400px 以上、正方形推奨 |
| OGP画像 | `og-image.jpg` | 1200×630px |
| ファビコン | `favicon.ico` | 32×32px |

---

## 7. ローカルで確認する場合の注意

JSONファイルの読み込みには **Webサーバーが必要**です。
ファイルをダブルクリックで開く（`file://`）場合はJSONが読み込まれず、
ニュース・メンバー・コンタクト情報が表示されません。

**簡単なローカルサーバーの起動方法（要Python）:**
```bash
cd petrichor/
python3 -m http.server 8080
# ブラウザで http://localhost:8080 を開く
```

---

## 注意事項

- `style.css` と `js/` フォルダは通常編集不要です
- JSONの編集後は必ずブラウザでキャッシュをクリアして確認してください
- `partials/` フォルダのHTMLはSSI用の参照ファイルです。ヘッダー・フッターを変更する場合は `js/loader.js` の `buildHeader()` / `buildFooter()` 関数を編集してください
