# partials フォルダ

ヘッダー・フッターの共通パーシャルHTML（参照用）です。

## 注意

実際のサイトでは `js/loader.js` が JavaScript でヘッダー・フッターを
DOM に直接挿入しています。これにより以下のメリットがあります：

- `file://` プロトコル（ダブルクリックでの直接起動）でも動作する
- サーバーなしでローカル確認が可能
- fetch の CORS エラーが発生しない

## カスタマイズ方法

ヘッダー・フッターの内容を変更する場合は `js/loader.js` の
`buildHeader()` / `buildFooter()` 関数を編集してください。

このフォルダ内の `header.html` / `footer.html` は
**サーバー環境で SSI (Server Side Includes) や PHP include を
使う場合の参考ファイル**として保存しています。
