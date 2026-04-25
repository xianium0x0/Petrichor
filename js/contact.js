/**
 * Petrich∅r - Contact Renderer
 * js/contact.js
 *
 * data/contact.json を読み込み、contact.html の各セクションを描画する。
 * ─────────────────────────────────────────────
 * 【更新方法】
 *   data/contact.json を編集するだけで SNS リンク・連絡先が更新されます。
 *   officialSns / memberSns / business の3セクションが対象です。
 * ─────────────────────────────────────────────
 */

const Contact = (() => {

  const DATA_URL = 'data/contact.json';

  const esc = (str) =>
    String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ── SVGアイコン（type 別） ───────────────────────────────
  const SNS_ICONS = {
    x: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    note: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h12v2H3v-2zm0 4h18v2H3v-2zm0 4h12v2H3v-2z"/></svg>`,
    gmail: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>`,
    ig: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    yt: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    tt: `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>`,
  };

  // SNSリンク（小アイコン用）
  const SNS_ICONS_SM = {
    x:  `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    ig: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  };

  // ── データ取得 ────────────────────────────────────────────
  const fetchContact = async () => {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('[Contact] データ取得エラー:', err.message);
      return null;
    }
  };

  // ── 公式SNS 描画 ─────────────────────────────────────────
  const renderOfficialSns = (items, selector) => {
    const grid = document.querySelector(selector);
    if (!grid) return;

    if (!items || items.length === 0) {
      grid.innerHTML = '<p class="contact-empty">情報を準備中です。</p>';
      return;
    }

    grid.innerHTML = items.map(s => `
      <a class="sns-card sns-card--${esc(s.type)}" href="${esc(s.url)}"
         target="_blank" rel="noopener noreferrer"
         aria-label="${esc(s.platform)}アカウントを開く" data-reveal-child>
        <div class="sns-icon">${SNS_ICONS[s.type] || ''}</div>
        <div class="sns-info">
          <p class="sns-platform">${esc(s.platform)}</p>
          <p class="sns-handle">${esc(s.handle)}</p>
          <p class="sns-desc">${esc(s.desc)}</p>
        </div>
        <div class="sns-arrow">→</div>
      </a>`).join('');
  };

  // ── メンバーSNS 描画 ──────────────────────────────────────
  const renderMemberSns = (items, selector) => {
    const list = document.querySelector(selector);
    if (!list) return;

    if (!items || items.length === 0) {
      list.innerHTML = '<p class="contact-empty">情報を準備中です。</p>';
      return;
    }

    list.innerHTML = items.map(m => `
      <div class="member-sns-row" data-reveal-child>
        <div class="member-sns-name">
          <p class="member-sns-jp">${esc(m.name)}</p>
          <p class="member-sns-role font-mono text-muted">${esc(m.role)}</p>
        </div>
        <div class="member-sns-links">
          ${(m.accounts || []).map(a => `
          <a href="${esc(a.url)}" target="_blank" rel="noopener"
             class="member-sns-link member-sns-link--${esc(a.type)}"
             aria-label="${esc(m.name)} ${esc(a.type)}">
            ${SNS_ICONS_SM[a.type] || ''}
            ${esc(a.handle)}
          </a>`).join('')}
        </div>
      </div>`).join('');
  };

  // ── 業務連絡先 描画 ──────────────────────────────────────
  const renderBusiness = (items, selector) => {
    const cards = document.querySelector(selector);
    if (!cards) return;

    if (!items || items.length === 0) {
      cards.innerHTML = '<p class="contact-empty">情報を準備中です。</p>';
      return;
    }

    cards.innerHTML = items.map(b => `
      <div class="contact-card card" data-reveal-child>
        <div class="contact-card-icon" aria-hidden="true">${esc(b.icon)}</div>
        <h3 class="contact-card-title">${esc(b.title)}</h3>
        <p class="contact-card-label font-mono text-muted">${esc(b.label)}</p>
        <a href="${esc(b.url)}" class="contact-card-value">${esc(b.value)}</a>
      </div>`).join('');
  };

  // ── 一括描画（contact.html 用） ──────────────────────────
  const render = async () => {
    const data = await fetchContact();

    if (!data) {
      // 取得失敗時は各コンテナに空メッセージを表示
      ['#sns-grid', '#member-sns-list', '#business-cards'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.innerHTML = '<p class="contact-empty">情報を読み込めませんでした。</p>';
      });
      return;
    }

    renderOfficialSns(data.officialSns, '#sns-grid');
    renderMemberSns(data.memberSns,     '#member-sns-list');
    renderBusiness(data.business,       '#business-cards');
  };

  return { render };
})();

export default Contact;
