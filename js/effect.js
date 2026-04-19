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

  // ── Cursor Glow ────────────────────────────────────────────
  const initCursorGlow = () => {
    // Only on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = -200, my = -200;
    let cx = -200, cy = -200;
    let raf;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mx = -200; my = -200;
    });

    const animate = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Scale up on hoverable elements
    document.querySelectorAll('a, button, [data-cursor-expand]').forEach(el => {
      el.addEventListener('mouseenter', () => glow.classList.add('cursor-glow--expand'));
      el.addEventListener('mouseleave', () => glow.classList.remove('cursor-glow--expand'));
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
