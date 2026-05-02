/**
 * Petrich∅r - Effects & Animations Scripts
 * js/effect.js
 *
 * Handles: scroll reveal, glitch effect, particle rain, cursor glow, parallax
 */

const Effect = (() => {

  // ── Scroll Reveal ──────────────────────────────────────────
  const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stagger children if data-stagger is set
          const stagger = entry.target.dataset.stagger;
          if (stagger) {
            entry.target.querySelectorAll('[data-reveal-child]').forEach((child, i) => {
              child.style.transitionDelay = `${i * parseFloat(stagger)}s`;
              child.classList.add('revealed');
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  };

  // ── Glitch Text Effect ─────────────────────────────────────
  const initGlitch = () => {
    document.querySelectorAll('[data-glitch]').forEach(el => {
      el.setAttribute('data-text', el.textContent);
    });
  };

  // ── Particle Rain (Canvas) ─────────────────────────────────
  const initParticleRain = (canvasId) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    // canvas は position:absolute で width:100%/height:100% のため
    // サイズは必ず親要素から取得する
    const getSize = () => {
      const parent = canvas.parentElement;
      return {
        w: parent ? parent.offsetWidth  : window.innerWidth,
        h: parent ? parent.offsetHeight : window.innerHeight,
      };
    };

    const resize = () => {
      const { w, h } = getSize();
      if (canvas.width === w && canvas.height === h) return; // 変化なし
      canvas.width  = w || window.innerWidth;
      canvas.height = h || 400;
      // リサイズ時はパーティクルをリセット
      particles = [];
      spawnParticles(70);
    };

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -100,
      length: Math.random() * 18 + 8,
      speed:  Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      width:  Math.random() * 1.2 + 0.3,
      hue: Math.random() > 0.5 ? 260 : 190,
    });

    const spawnParticles = (count) => {
      for (let i = 0; i < count; i++) particles.push(createParticle());
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.lineWidth = p.width;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.length * 0.15, p.y + p.length);
        ctx.stroke();
        p.y += p.speed;
        if (p.y > canvas.height + 20) particles[i] = createParticle();
      });
      animId = requestAnimationFrame(update);
    };

    // 親要素を監視してリサイズに追従
    const ro = new ResizeObserver(resize);
    const parent = canvas.parentElement;
    if (parent) ro.observe(parent);

    resize();
    update();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  };

  // ── Custom Cursor（DOM要素によるディレイ追随方式） ───────────
  // ドット（即時追随）＋リング（イージング遅延追随）の2層構造。
  // body の transform が除去済みのため position:fixed が正しく機能する。
  // タッチデバイスでは無効。
  const initCursorGlow = () => {
    if (window.matchMedia('(hover: none)').matches) return;

    // ドット（小・即時）
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    // リング（大・遅延）
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let mx = -300, my = -300; // マウス実座標
    let rx = -300, ry = -300; // リング追随座標
    let visible = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      // ドットは即時追随
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
        rx = mx; ry = my;
      }
    });

    document.addEventListener('mouseleave', () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    // リングはイージングでなめらかに追随（ディレイ演出）
    const animate = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(animate);
    };
    animate();

    // ホバー時にリング拡大・色変化
    const onEnter = () => {
      ring.classList.add('cursor-ring--hover');
      dot.classList.add('cursor-dot--hover');
    };
    const onLeave = () => {
      ring.classList.remove('cursor-ring--hover');
      dot.classList.remove('cursor-dot--hover');
    };

    // 動的に追加される要素にも対応するためdelegationで処理
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, [data-cursor-expand]')) onEnter();
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, [data-cursor-expand]')) onLeave();
    });
  };

  // ── Parallax ───────────────────────────────────────────────
  const initParallax = () => {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      els.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY) * speed;
        el.style.transform = `translateY(${offset * 0.15}px)`;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  };

  // ── Noise Overlay (SVG filter grain) ──────────────────────
  const initNoiseOverlay = () => {
    if (document.getElementById('noise-svg')) return;
    const svg = `<svg id="noise-svg" xmlns="http://www.w3.org/2000/svg" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;opacity:0.03;mix-blend-mode:overlay">
      <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
      <rect width="100%" height="100%" filter="url(#noise)"/>
    </svg>`;
    document.body.insertAdjacentHTML('beforeend', svg);
  };

  // ── Init All ───────────────────────────────────────────────
  const init = () => {
    initScrollReveal();
    initGlitch();
    initCursorGlow();
    initParallax();
    initNoiseOverlay();
  };

  return { init, initParticleRain, initScrollReveal };
})();

export default Effect;
