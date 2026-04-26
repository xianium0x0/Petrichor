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
      </a>
    </div>
    <canvas class="header-rain-canvas" id="header-rain-canvas" aria-hidden="true"></canvas>
    <nav class="site-nav" id="site-nav" aria-label="メインナビゲーション">
      <ul class="nav-list">
        <li class="nav-item"><a href="index.html"   class="nav-link">Home</a></li>
        <li class="nav-item"><a href="member.html"  class="nav-link">Member</a></li>
        <li class="nav-item"><a href="news.html"    class="nav-link">News</a></li>
        <li class="nav-item"><a href="contact.html" class="nav-link">Contact</a></li>
      </ul>
    </nav>
  </div>
  <div class="header-line"><div class="header-line-inner"></div></div>
</header>`;

  // ── Footer: partials/footer.html を fetch で読み込む ──────
  // ★ フッターの編集は partials/footer.html を変更してください
  const loadFooter = async () => {
    const footerEl = document.getElementById('footer-placeholder');
    if (!footerEl) return;
    try {
      const res = await fetch('partials/footer.html');
      if (!res.ok) throw new Error('footer fetch failed');
      const html = await res.text();
      footerEl.outerHTML = html;
    } catch (e) {
      // fetchが失敗した場合（file://プロトコル等）はフォールバック
      footerEl.outerHTML = `<footer class="site-footer"><div class="footer-inner"><p class="footer-copy">&copy; 2026 Petrich&#x2205;r. All Rights Reserved.</p></div></footer>`;
    }
  };

  // ── Inject Partials into DOM ───────────────────────────────
  // ヘッダーは同期でDOM生成、フッターはfetchで読み込む
  const injectPartials = async () => {
    const headerEl = document.getElementById('header-placeholder');
    if (headerEl) headerEl.outerHTML = buildHeader();
    await loadFooter();
  };

  // ── Preloader ──────────────────────────────────────────────
  // 通常ロード時（ブックマーク・URL直打ち等）の全画面演出。
  const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // display:none のページ（index.html以外）では表示しない
    if (preloader.style.display === 'none') return;

    const minTime = 2500; // バーアニメ(1.2s) + ゆっくり表示
    const startTime = Date.now();

    // パーセント表示アニメーション
    const pctEl = preloader.querySelector('.preloader-progress-pct');
    if (pctEl) {
      let pct = 0;
      const countUp = setInterval(() => {
        pct = Math.min(pct + Math.floor(Math.random() * 18 + 6), 99);
        pctEl.textContent = pct + '%';
        if (pct >= 99) clearInterval(countUp);
      }, 120);
    }

    const hide = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minTime - elapsed);
      setTimeout(() => {
        // 完了時は100%にする
        if (pctEl) pctEl.textContent = '100%';
        setTimeout(() => {
          preloader.classList.add('preloader--hidden');
          preloader.addEventListener('transitionend', () => {
            preloader.remove();
            document.body.classList.add('page-loaded');
          }, { once: true });
          // フォールバック
          setTimeout(() => {
            if (preloader.isConnected) {
              preloader.remove();
              document.body.classList.add('page-loaded');
            }
          }, 900);
        }, 150);
      }, Math.max(remaining, 50));
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



  // ── ページ遷移（クリック→即遷移） ──────────────────────────
  const initPageTransitions = () => {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('https') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        link.target === '_blank'
      ) return;
      e.preventDefault();
      window.location.href = href;
    });
  };

  // ── Init ───────────────────────────────────────────────────
  const init = async () => {
    await injectPartials();  // まず header/footer を DOM に挿入
    initPreloader();         // トップページの全画面プリローダー（通常ロード）
    initPageTransitions();   // リンククリック → 遷移
    setActiveNavLink();      // 現在ページのナビリンクをアクティブに
  };

  return { init };
})();

export default Loader;
