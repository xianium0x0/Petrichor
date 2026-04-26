/**
 * Petrich∅r - Members Renderer
 * js/members.js
 *
 * data/members.json を読み込み、メンバーカードを描画する。
 * ─────────────────────────────────────────────
 * 【更新方法】
 *   data/members.json を編集するだけでメンバー情報が更新されます。
 *   写真を追加する場合は images/member-{nameEn小文字}.jpg を配置し、
 *   JSON の "photo" フィールドにパスを指定してください（省略時はイニシャル表示）。
 * ─────────────────────────────────────────────
 */

const Members = (() => {

  const DATA_URL = 'data/members.json';

  // ── 安全なエスケープ ─────────────────────────────────────
  const esc = (str) =>
    String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ── 写真エリア HTML ──────────────────────────────────────
  const buildPhoto = (m) => {
    if (m.photo) {
      return `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">`;
    }
    return `<div class="member-photo-placeholder"><span class="member-initial">${esc(m.initial)}</span></div>`;
  };

  // ── カード 1枚分の HTML ──────────────────────────────────
  const buildCard = (m) => `
    <article class="member-card" data-reveal tabindex="0" aria-label="${esc(m.name)}のプロフィール">
      <div class="member-card-inner">
        <div class="member-card-front">
          <div class="member-photo-wrap">
            <div class="member-photo ${esc(m.colorClass)}">${buildPhoto(m)}</div>
            <div class="member-color-ring ${esc(m.colorRingClass)}"></div>
          </div>
          <div class="member-front-info">
            <p class="member-position">${esc(m.position)}</p>
            <h2 class="member-name">${esc(m.name)}</h2>
            <p class="member-name-en">${esc(m.nameEn)}</p>
            <div class="member-flip-hint">tap for profile ↓</div>
          </div>
        </div>
        <div class="member-card-back">
          <div class="member-back-header">
            <p class="member-back-position">${esc(m.position)}</p>
            <h2 class="member-back-name">${esc(m.name)}</h2>
          </div>
          <dl class="member-profile">
            <dt>誕生日</dt><dd>${esc(m.birthday)}</dd>
            <dt>出身</dt><dd>${esc(m.birthplace)}</dd>
            <dt>身長</dt><dd>${esc(m.height)}</dd>
            <dt>担当色</dt>
            <dd><span class="member-color-dot" style="background:${esc(m.colorHex)}"></span>${esc(m.colorLabel)}</dd>
            <dt>好きなもの</dt><dd>${esc(m.likes)}</dd>
          </dl>
          <p class="member-comment">"${esc(m.comment)}"</p>
          <div class="member-sns">
            ${m.twitter ? `<a href="${esc(m.twitter)}" class="member-sns-btn member-sns-btn--x" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X
            </a>` : ''}
            ${m.youtube ? `<a href="${esc(m.youtube)}" class="member-sns-btn member-sns-btn--yt" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              YouTube
            </a>` : ''}
          </div>
        </div>
      </div>
    </article>`;

  // ── データ取得 ────────────────────────────────────────────
  const fetchMembers = async () => {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('members.json: 配列形式ではありません');
      return data;
    } catch (err) {
      console.warn('[Members] データ取得エラー:', err.message);
      return null;
    }
  };

  // ── 描画 ─────────────────────────────────────────────────
  const render = async (gridSelector) => {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const data = await fetchMembers();

    if (!data || data.length === 0) {
      grid.innerHTML = '<p class="member-empty">メンバー情報を準備中です。</p>';
      return;
    }

    grid.innerHTML = data.map(buildCard).join('');

    // カードフリップイベントを再バインド（layout.js の initMemberCards と同処理）
    grid.querySelectorAll('.member-card').forEach(card => {
      card.addEventListener('click', () => card.classList.toggle('member-card--flipped'));
    });

    // スクロールリビール再バインド
    if (typeof Effect !== 'undefined' && Effect.initScrollReveal) {
      Effect.initScrollReveal();
    }
  };

  return { render };
})();

export default Members;
