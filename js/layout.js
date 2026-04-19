/**
 * Petrich∅r - Layout Scripts
 * js/layout.js
 *
 * Handles: sticky header, mobile nav toggle, scroll progress bar,
 *          smooth scroll, back-to-top button
 */

const Layout = (() => {

  // ── Sticky Header ──────────────────────────────────────────
  const initStickyHeader = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    let lastY = 0;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;

          if (currentY > 60) {
            header.classList.add('header--scrolled');
          } else {
            header.classList.remove('header--scrolled');
          }

          // Hide on scroll down, show on scroll up
          if (currentY > lastY && currentY > 120) {
            header.classList.add('header--hidden');
          } else {
            header.classList.remove('header--hidden');
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const initMobileNav = () => {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('site-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!toggle || !nav) return;

    const open = () => {
      toggle.classList.add('nav-toggle--active');
      nav.classList.add('site-nav--open');
      overlay?.classList.add('nav-overlay--active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    };

    const close = () => {
      toggle.classList.remove('nav-toggle--active');
      nav.classList.remove('site-nav--open');
      overlay?.classList.remove('nav-overlay--active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
    });

    overlay?.addEventListener('click', close);

    // Close on nav link click (mobile)
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', close);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  // ── Scroll Progress Bar ────────────────────────────────────
  const initScrollProgress = () => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  };

  // ── Smooth Scroll for Anchor Links ────────────────────────
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').slice(1);
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        const headerH = document.getElementById('site-header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  };

  // ── Back to Top ────────────────────────────────────────────
  const initBackToTop = () => {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ── Member Card Flip (member.html) ─────────────────────────
  const initMemberCards = () => {
    document.querySelectorAll('.member-card').forEach(card => {
      // Touch-friendly flip
      card.addEventListener('click', () => {
        card.classList.toggle('member-card--flipped');
      });
    });
  };

  // ── YouTube Embed Lazy Load ────────────────────────────────
  const initYouTubeFacade = () => {
    document.querySelectorAll('.yt-facade').forEach(facade => {
      const videoId = facade.dataset.videoId;
      // プレースホルダーや未設定の場合はスキップ
      if (!videoId || videoId === 'YOUR_VIDEO_ID_HERE') return;

      // サムネイル画像をフォールバック付きで設定
      const thumb = new Image();
      thumb.onload = () => {
        facade.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`;
      };
      thumb.onerror = () => {
        facade.style.backgroundImage = `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
      };
      thumb.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      const play = () => {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.className = 'yt-iframe';
        facade.replaceWith(iframe);
      };

      facade.addEventListener('click', play, { once: true });
      // キーボードアクセシビリティ
      facade.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
      }, { once: true });
    });
  };

  // ── Init All ───────────────────────────────────────────────
  const init = () => {
    initStickyHeader();
    initMobileNav();
    initScrollProgress();
    initSmoothScroll();
    initBackToTop();
    initMemberCards();
    initYouTubeFacade();
  };

  return { init };
})();

export default Layout;
