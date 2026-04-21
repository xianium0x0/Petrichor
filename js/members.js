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
