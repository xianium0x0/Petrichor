/**
 * Petrich∅r - Loader & Page Transition Scripts
 * js/loader.js
 *
 * Handles: page preloader, header/footer injection, page transitions
 *
 * NOTE: ヘッダー・フッターは fetch ではなく JS で DOM 生成しています。
 *       これにより file:// プロトコル（ローカル直接起動）でも動作します。
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
    <button class="nav-toggle" id="nav-toggle" aria-label="メニューを開く" aria-expanded="false">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="メインナビゲーション">
      <ul class="nav-list">
        <li class="nav-item"><a href="index.html"   class="nav-link">HOME</a></li>
        <li class="nav-item"><a href="member.html"  class="nav-link">MEMBER</a></li>
        <li class="nav-item"><a href="news.html" class="nav-link">NEWS</a></li>
        <li class="nav-item"><a href="contact.html" class="nav-link">CONTACT</a></li>
      </ul>
      <p class="nav-deco">Petrich&#x2205;r &mdash; underground idol</p>
    </nav>
    <div class="nav-overlay" id="nav-overlay"></div>
  </div>
  <div class="header-line"><div class="header-line-inner"></div></div>
</header>`;

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
  const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const minTime = 800;
    const startTime = Date.now();

    const hide = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      setTimeout(() => {
        preloader.classList.add('preloader--hidden');
        preloader.addEventListener('transitionend', () => {
          preloader.remove();
          document.body.classList.add('page-loaded');
        }, { once: true });
      }, remaining);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
    }
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
      setTimeout(() => { window.location.href = href; }, 400);
    });
  };

  // ── Init ───────────────────────────────────────────────────
  const init = () => {
    injectPartials();       // まず header/footer を DOM に挿入
    initPreloader();        // プリローダー制御
    initPageTransitions();  // ページ遷移エフェクト
    setActiveNavLink();     // 現在ページのナビリンクをアクティブに
  };

  return { init };
})();

export default Loader;
