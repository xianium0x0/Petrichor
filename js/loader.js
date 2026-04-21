/**
 * Petrich∅r - Loader & Page Transition Scripts
 * js/loader.js
 *
 * Handles: page preloader, header/footer injection, page transitions
 *
 * NOTE: ヘッダー・フッターは fetch ではなく JS で DOM 生成しています。
 *       これにより file:// プロトコル（ローカル直接起動）でも動作します。
 *       partials/ フォルダの header.html / footer.html は SSI 用参照ファイルです。
 */

const Loader = (() => {

  // ── Header HTML ────────────────────────────────────────────
  const buildHeader = () => `
<header class="site-header" id="site-header">
  <div class="header-inner">
    <div class="header-logo">
      <a href="index.html" class="logo-link">
        <span class="logo-text">Petrich<span class="logo-symbol">&#x2205;</span>r</span>
        <span class="logo-tagline">underground idol</span>
      </a>
    </div>
  </div>
  <div class="header-line"><div class="header-line-inner"></div></div>
</header>
<!-- ハンバーガーボタン: ヘッダーとは独立したfixed要素でスクロール追従 -->
<button class="nav-toggle" id="nav-toggle" aria-label="メニューを開く" aria-expanded="false">
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
  <span class="hamburger-line"></span>
</button>
<nav class="site-nav" id="site-nav" aria-label="メインナビゲーション">
  <ul class="nav-list">
    <li class="nav-item"><a href="index.html"   class="nav-link">Home</a></li>
    <li class="nav-item"><a href="member.html"  class="nav-link">Member</a></li>
    <li class="nav-item"><a href="news.html"    class="nav-link">News</a></li>
    <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
  </ul>
  <p class="nav-deco">Petrich&#x2205;r &mdash; underground idol</p>
</nav>
<div class="nav-overlay" id="nav-overlay"></div>`;

  // ── Footer HTML ────────────────────────────────────────────
  const buildFooter = () => `
<footer class="site-footer">
  <div class="footer-bg-decor">
    <div class="footer-circle footer-circle--1"></div>
    <div class="footer-circle footer-circle--2"></div>
  </div>
  <div class="footer-inner">
    <div class="footer-logo-area">
      <p class="footer-logo-text">Petrich<span class="logo-symbol">&#x2205;</span>r</p>
      <p class="footer-tagline">— where rain meets asphalt —</p>
    </div>
    <nav class="footer-nav" aria-label="フッターナビゲーション">
      <ul class="footer-nav-list">
        <li><a href="index.html"   class="footer-nav-link">HOME</a></li>
        <li><a href="member.html"  class="footer-nav-link">MEMBER</a></li>
        <li><a href="news.html" class="footer-nav-link">NEWS</a></li>
        <li><a href="contact.html" class="footer-nav-link">CONTACT</a></li>
      </ul>
    </nav>
    <div class="footer-divider"></div>
    <p class="footer-copy">&copy; 2024 Petrich&#x2205;r. All Rights Reserved.</p>
  </div>
</footer>`;

  // ── Inject Partials into DOM ───────────────────────────────
  const injectPartials = () => {
    const headerEl = document.getElementById('header-placeholder');
    const footerEl = document.getElementById('footer-placeholder');
    if (headerEl) headerEl.outerHTML = buildHeader();
    if (footerEl) footerEl.outerHTML = buildFooter();
  };

  // ── Preloader ──────────────────────────────────────────────
  // index.html専用の全画面ローディング演出。
  // minTime を必ず待つことでバーアニメーション(1.2s)が必ず見える。
  const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const minTime = 1500; // バーアニメ(1.2s) + フェード余裕
    const startTime = Date.now();

    const hide = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      // remaining が 0 でも必ず次のマクロタスクで実行（即時消去を防ぐ）
      setTimeout(() => {
        preloader.classList.add('preloader--hidden');
        preloader.addEventListener('transitionend', () => {
          preloader.remove();
          document.body.classList.add('page-loaded');
        }, { once: true });
        // transitionend が発火しない環境向けフォールバック
        setTimeout(() => {
          if (preloader.isConnected) {
            preloader.remove();
            document.body.classList.add('page-loaded');
          }
        }, 800);
      }, Math.max(remaining, 50));
    };

    // readyState に関わらず常に load イベントを待ってから計測
    if (document.readyState === 'complete') {
      // 既にロード済みでも minTime は必ず待つ
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }
  };

  // ── ページ遷移ローディング（他ページ用・軽微） ────────────
  // 遷移先ページの <body> に .page-enter クラスを付け
  // CSSでフェードイン＋細いバーを表示する。
  const initTransitionLoader = () => {
    // 遷移先でのフェードインバー
    const bar = document.createElement('div');
    bar.id = 'transition-bar';
    document.body.appendChild(bar);

    // アニメーション開始
    requestAnimationFrame(() => {
      bar.classList.add('transition-bar--run');
    });

    // 完了後に除去
    bar.addEventListener('transitionend', () => {
      setTimeout(() => bar.remove(), 100);
    }, { once: true });
  };

  // ── Active Nav Link ────────────────────────────────────────
  const setActiveNavLink = () => {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    const normalized = current === '' ? 'index.html' : current;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === normalized) {
        link.classList.add('nav-link--active');
      }
    });
  };

  // ── Page Transition Out ────────────────────────────────────
  const initPageTransitions = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        link.target === '_blank'
      ) return;

      e.preventDefault();
      document.body.classList.add('page-transitioning');
      setTimeout(() => { window.location.href = href; }, 350);
    });
  };

  // ── Init ───────────────────────────────────────────────────
  const init = () => {
    injectPartials();        // まず header/footer を DOM に挿入
    initPreloader();         // index.html 全画面プリローダー
    initTransitionLoader();  // 他ページ遷移時の軽微ローディングバー
    initPageTransitions();   // ページ遷移エフェクト
    setActiveNavLink();      // 現在ページのナビリンクをアクティブに
  };

  return { init };
})();

export default Loader;
