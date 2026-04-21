/**
 * Petrich∅r - Main Entry Point
 * js/main.js
 *
 * 初期化順序: Loader → Layout → Effect → ページ別データ描画
 *
 * 【コンテンツ更新方法】
 *   ニュース    : data/news.json を編集
 *   メンバー    : data/members.json を編集
 *   SNS・連絡先 : data/contact.json を編集
 */

import Loader  from './loader.js';
import Layout  from './layout.js';
import Effect  from './effect.js';
import News    from './news.js';
import Members from './members.js';
import Contact from './contact.js';

const App = {
  init() {
    // 1. header / footer を DOM に挿入（同期）
    Loader.init();

    // 2. レイアウト系の挙動を初期化
    Layout.init();

    // 3. ビジュアルエフェクトを初期化
    Effect.init();

    // 4. ページ固有の Canvas エフェクト
    if (document.getElementById('hero-canvas')) {
      Effect.initParticleRain('hero-canvas');
    }
    if (document.getElementById('banner-canvas')) {
      Effect.initParticleRain('banner-canvas');
    }

    // 5. ページ別データ描画（IDで該当ページを判定）
    // --- index.html: ニュース最新3件 ---
    if (document.getElementById('news-list-top')) {
      News.renderTop('#news-list-top', 3).then(() => {
        Effect.initScrollReveal(); // 描画後にリビール再登録
      });
    }

    // --- news.html: ニュース全件 ---
    if (document.getElementById('news-list-all')) {
      News.renderAll('#news-list-all').then(() => {
        Effect.initScrollReveal();
      });
    }

    // --- member.html: メンバーカード ---
    if (document.getElementById('member-grid')) {
      Members.render('#member-grid').then(() => {
        Effect.initScrollReveal();
      });
    }

    // --- contact.html: SNS・連絡先 ---
    if (document.getElementById('sns-grid')) {
      Contact.render().then(() => {
        Effect.initScrollReveal();
      });
    }
  },
};

// DOM 構築完了後に起動
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
