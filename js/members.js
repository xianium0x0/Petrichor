/**
 * Petrich∅r - Members Renderer
 * js/members.js
 *
 * data/members.json を読み込み、ガラス風メンバーカードを描画する。
 * ─────────────────────────────────────────────
 * 【更新方法】
 *   data/members.json を編集するだけでメンバー情報が更新されます。
 *
 * 【画像の差し替え】
 *   members.json の各メンバーの:
 *     "photo"     → カード表面のシルエット背景画像（images/フォルダ内のパス）
 *     "photoBack" → カード裏面の画像（省略時は photo を使用）
 *   例: "photo": "images/mayo-front.jpg"
 * ─────────────────────────────────────────────
 */

const Members = (() => {

  const DATA_URL = 'data/members.json';

  // ── 安全なエスケープ ─────────────────────────────────────
  const esc = (str) =>
    String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ── カード 1枚分の HTML ──────────────────────────────────
  // photo は表面の背景シルエット画像（CSS背景として使用）
  // photoBack は裏面の画像
  const buildCard = (m, index) => {
    const frontBg = m.photo
      ? `style="--member-bg: url('${esc(m.photo)}');"`
      : '';
    const backImg = (m.photoBack || m.photo)
      ? `<img src="${esc(m.photoBack || m.photo)}" alt="${esc(m.name)}" class="member-back-img" loading="lazy">`
      : `<div class="member-back-initial">${esc(m.initial)}</div>`;

    return `
    <article
      class="member-card"
      tabindex="0"
      aria-label="${esc(m.name)}のプロフィール"
      style="animation-delay: ${index * 0.08}s"
    >
      <div class="member-card-inner">

        <!-- ── 表面 ── -->
        <div class="member-card-front" ${frontBg}>

          <!-- シルエット背景（photo指定時） -->
          <div class="member-card-silhouette" aria-hidden="true"></div>

          <!-- 下部グラデーションライン -->
          <div class="member-card-line" aria-hidden="true"></div>

          <!-- コンテンツ -->
          <div class="member-card-content">
            <p class="member-role">${esc(m.position)}</p>
            <h2 class="member-name">${esc(m.name)}</h2>
            <p class="member-name-en">${esc(m.nameEn)}</p>
            <p class="member-comment">${esc(m.comment)}</p>
          </div>

          <!-- クリックインジケーター -->
          <div class="member-card-indicator" aria-hidden="true">
            <span class="member-card-indicator-icon">＋</span>
            <span class="member-card-indicator-text">View Profile</span>
          </div>
        </div>

        <!-- ── 裏面 ── -->
        <div class="member-card-back">
          <div class="member-back-img-wrap">${backImg}</div>
          <div class="member-back-body">
            <p class="member-back-position">${esc(m.position)}</p>
            <h2 class="member-back-name">${esc(m.name)}</h2>
            <dl class="member-profile">
              <dt>誕生日</dt><dd>${esc(m.birthday)}</dd>
              <dt>出身</dt><dd>${esc(m.birthplace)}</dd>
              <dt>身長</dt><dd>${esc(m.height)}</dd>
              <dt>担当色</dt>
              <dd>
                <span class="member-color-dot" style="background:${esc(m.colorHex)}"></span>
                ${esc(m.colorLabel)}
              </dd>
              <dt>好きなもの</dt><dd>${esc(m.likes)}</dd>
            </dl>
            <div class="member-sns">
              ${m.twitter ? `
              <a href="${esc(m.twitter)}" class="member-sns-btn member-sns-btn--x"
                 target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>X
              </a>` : ''}
              ${m.youtube ? `
              <a href="${esc(m.youtube)}" class="member-sns-btn member-sns-btn--yt"
                 target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>YouTube
              </a>` : ''}
            </div>
          </div>
        </div>

      </div>
    </article>`;
  };

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

    grid.innerHTML = data.map((m, i) => buildCard(m, i)).join('');

    // ── フリップ制御 ─────────────────────────────────────
    grid.querySelectorAll('.member-card').forEach(card => {
      const toggle = () => card.classList.toggle('member-card--flipped');

      // クリック・タップ
      card.addEventListener('click', toggle);

      // キーボード操作
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });

      // 裏面のリンククリックが親のflipを起こさないよう制御
      card.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => e.stopPropagation());
      });
    });

    // スクロールリビール再バインド
    if (window.__petrichorRevealObserver) {
      grid.querySelectorAll('[data-reveal]').forEach(el => {
        window.__petrichorRevealObserver.observe(el);
      });
    }
  };

  return { render };
})();

export default Members;
