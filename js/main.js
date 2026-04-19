/**
 * Petrich∅r - Main Entry Point
 * js/main.js
 *
 * 各モジュールを正しい順序で呼び出します。
 * Loader → Layout → Effect の順。
 * Loader は同期で header/footer を DOM 挿入するため、
 * await 不要になりました。
 */

import Loader  from './loader.js';
import Layout  from './layout.js';
import Effect  from './effect.js';

const App = {
  init() {
    // 1. header / footer を DOM に挿入（同期）
    Loader.init();

    // 2. レイアウト系の挙動を初期化（header が DOM に存在することが前提）
    Layout.init();

    // 3. ビジュアルエフェクトを初期化
    Effect.init();

    // 4. ページ固有の Canvas エフェクト
    //    index.html のヒーロー背景雨粒
    if (document.getElementById('hero-canvas')) {
      Effect.initParticleRain('hero-canvas');
    }
    //    member.html のバナー背景雨粒
    if (document.getElementById('banner-canvas')) {
      Effect.initParticleRain('banner-canvas');
    }
  },
};

// DOM 構築完了後に起動
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
