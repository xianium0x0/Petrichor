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

  // ページ遷移フラグキー（sessionStorage用）
  const TRANSITION_KEY = 'petrichor_transition';

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
        <li><a href="index.html"   class="footer-nav-link">Home</a></li>
        <li><a href="member.html"  class="footer-nav-link">Member</a></li>
        <li><a href="news.html"    class="footer-nav-link">News</a></li>
        <li><a href="contact.html" class="footer-nav-link">Contact</a></li>
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
  // 通常ロード時（ブックマーク・URL直打ち等）の全画面演出。
  // 遷移経由の場合は initTransitionLoader が担うためここでは何もしない。
  const initPreloader = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // 遷移経由の場合は initTransitionLoader に任せる（フラグが存在すれば）
    if (sessionStorage.getItem(TRANSITION_KEY)) return;

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

  // ── ページ遷移オーバーレイ ────────────────────────────────
  // 【遷移元】リンククリック時: 全画面オーバーレイを即表示 → 遷移
  // 【遷移先】#preloader が全ページに存在するため、
  //           sessionStorage のフラグを見て短縮タイマーでフェードアウト
  // JS が失敗しても e.preventDefault() より前にエラーが出れば通常遷移する。

  // オーバーレイ HTML（遷移元クリック時にJS生成）
  // ※ CSSアニメーションクラス（preloader-logo等）は使わない。
  //   それらはDOMに追加された瞬間に始まるため、display:none中でも
  //   タイマーが進んでしまい、表示時にはアニメが終わっている。
  //   代わりに専用クラス（page-overlay-*）でJSからスタイルを制御する。
  const buildOverlay = () => {
    const el = document.createElement('div');
    el.id = 'page-overlay';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="po-corners">
        <div class="po-corner po-corner--tl"></div>
        <div class="po-corner po-corner--tr"></div>
        <div class="po-corner po-corner--bl"></div>
        <div class="po-corner po-corner--br"></div>
      </div>
      <div class="po-inner">
        <p class="po-logo">Petrich<span class="po-symbol">&#x2205;</span>r</p>
        <p class="po-sub">underground idol</p>
        <div class="po-bar-area">
          <div class="po-bar-header">
            <span class="po-bar-label">LOADING</span>
            <span class="po-bar-pct" id="overlay-pct">0%</span>
          </div>
          <div class="po-bar-track">
            <div class="po-bar-fill" id="overlay-bar"></div>
          </div>
        </div>
      </div>`;
    return el;
  };

  // ── 遷移先ローダー制御 ───────────────────────────────────────
  // 遷移経由フラグ(TRANSITION_KEY)の値で演出を切り替える。
  //   'full'  → index.html への遷移: #preloader をフル表示（アニメリセット）
  //   'slim'  → 他ページへの遷移  : 簡易オーバーレイ（バーのみ）を表示
  // 通常ロード（直打ち等）はフラグなし → initPreloader が担う。
  const initTransitionLoader = () => {
    const mode = sessionStorage.getItem(TRANSITION_KEY);
    if (!mode) return; // 遷移経由でなければ何もしない
    sessionStorage.removeItem(TRANSITION_KEY);

    if (mode === 'full') {
      // ── フル演出: #preloader をアニメリセットして再生 ──────
      const preloader = document.getElementById('preloader');
      if (!preloader) return;

      const bar  = preloader.querySelector('.preloader-bar');
      const logo = preloader.querySelector('.preloader-logo');
      const sub  = preloader.querySelector('.preloader-sub');
      const wrap = preloader.querySelector('.preloader-progress-wrap');
      const pctEl = preloader.querySelector('.preloader-progress-pct');

      // animation: none → reflow → 再設定 で最初から再生
      [bar, logo, sub, wrap].forEach(el => { if (el) el.style.animation = 'none'; });
      preloader.offsetHeight; // reflow強制
      [bar, logo, sub, wrap].forEach(el => { if (el) el.style.animation = ''; });

      if (pctEl) {
        pctEl.textContent = '0%';
        let p = 0;
        const t = setInterval(() => {
          p = Math.min(p + Math.floor(Math.random() * 8 + 5), 99);
          pctEl.textContent = p + '%';
          if (p >= 99) clearInterval(t);
        }, 100);
      }

      const hidePreloader = () => {
        if (pctEl) pctEl.textContent = '100%';
        setTimeout(() => {
          preloader.classList.add('preloader--hidden');
          preloader.addEventListener('transitionend', () => {
            preloader.remove();
            document.body.classList.add('page-loaded');
          }, { once: true });
          setTimeout(() => {
            if (preloader.isConnected) { preloader.remove(); document.body.classList.add('page-loaded'); }
          }, 900);
        }, 150);
      };
      setTimeout(hidePreloader, 1800);

    } else if (mode === 'slim') {
      // ── 簡易演出: バーのみのオーバーレイを表示してフェードアウト ──
      // #preloader はすぐ非表示にして、代わりに slim オーバーレイを出す
      const preloader = document.getElementById('preloader');
      if (preloader) { preloader.remove(); } // HTMLのpreloaderは即除去

      const slim = document.createElement('div');
      slim.id = 'slim-overlay';
      slim.setAttribute('aria-hidden', 'true');
      slim.innerHTML = `<div class="slim-bar" id="slim-bar"></div>`;
      document.body.appendChild(slim);

      // バーをJSで進める
      const slimBar = slim.querySelector('#slim-bar');
      let p = 0;
      requestAnimationFrame(() => {
        slim.classList.add('slim-overlay--visible');
        const t = setInterval(() => {
          p = Math.min(p + Math.floor(Math.random() * 12 + 8), 99);
          if (slimBar) slimBar.style.width = p + '%';
          if (p >= 99) clearInterval(t);
        }, 40);
      });

      // 800ms後にフェードアウトして除去
      setTimeout(() => {
        if (slimBar) slimBar.style.width = '100%';
        setTimeout(() => {
          slim.classList.add('slim-overlay--hidden');
          slim.addEventListener('transitionend', () => slim.remove(), { once: true });
          setTimeout(() => { if (slim.isConnected) slim.remove(); }, 500);
          document.body.classList.add('page-loaded');
        }, 100);
      }, 800);
    }
  };

  // ── 遷移元: クリック → フラグセット → 即遷移 ────────────────
  // 演出は遷移先の initTransitionLoader が担う（2重表示を防ぐため）。
  // index.html への遷移は 'full'、それ以外は 'slim' フラグをセット。
  const initPageTransitions = () => {
    document.addEventListener('click', (e) => {
      try {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');

        // 外部・アンカー・メール・電話・新規タブは除外
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

        // 遷移先が index.html かどうかでフラグを切り替える
        const dest = href.replace(/^\.\//, '');
        const mode = (dest === 'index.html' || dest === '') ? 'full' : 'slim';
        sessionStorage.setItem(TRANSITION_KEY, mode);

        // 遷移先で演出するため、遷移元では即遷移
        window.location.href = href;

      } catch (err) {
        console.warn('[Loader] transition error:', err);
      }
    });
  };

  // ── Init ───────────────────────────────────────────────────
  const init = () => {
    injectPartials();        // まず header/footer を DOM に挿入
    initPreloader();         // トップページの全画面プリローダー（通常ロード）
    initTransitionLoader();  // 遷移経由ページのプリローダー短縮制御
    initPageTransitions();   // リンククリック → オーバーレイ → 遷移
    setActiveNavLink();      // 現在ページのナビリンクをアクティブに
  };

  return { init };
})();

export default Loader;
