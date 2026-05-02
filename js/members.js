/**
 * Petrich∅r - Members Renderer
 * js/members.js
 *
 * data/members.json を読み込み、ガラス風メンバーカードを描画する。
 * カードクリックで縦長モーダルを表示する。
 * ─────────────────────────────────────────────
 * 【更新方法】
 *   data/members.json を編集するだけでメンバー情報が更新されます。
 *
 * 【画像の差し替え】
 *   members.json の各メンバーの:
 *     "photo"     → カード表面のシルエット背景 & モーダルのメイン画像
 *     "photoBack" → モーダルの画像（省略時は photo を使用）
 *   例: "photo": "images/mayo-front.jpg"
 * ─────────────────────────────────────────────
 */

const Members = (() => {

  const DATA_URL = 'data/members.json';

  // ── 安全なエスケープ ─────────────────────────────────────
  const esc = (str) =>
    String(str || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ── カード HTML（表面のみ） ──────────────────────────────
  const buildCard = (m, index) => {
    const silhouetteBg = m.photo
      ? `style="background-image: url('${esc(m.photo)}');"`
      : '';

    return `
    <article
      class="member-card"
      tabindex="0"
      role="button"
      aria-label="${esc(m.name)}のプロフィールを開く"
      style="animation-delay: ${index * 0.08}s"
      data-member-id="${esc(String(m.id))}"
    >
      <div class="member-card-inner">
        <!-- シルエット背景 -->
        <div class="member-card-silhouette" aria-hidden="true" ${silhouetteBg}></div>

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
    </article>`;
  };

  // ── モーダル HTML ────────────────────────────────────────
  const buildModal = (m) => {
    const imgSrc = m.photoBack || m.photo;
    const imgHtml = imgSrc
      ? `<img src="${esc(imgSrc)}" alt="${esc(m.name)}" class="modal-img" loading="lazy">`
      : `<div class="modal-img-placeholder"><span>${esc(m.initial)}</span></div>`;

    const snsHtml = [
      m.twitter ? `
        <a href="${esc(m.twitter)}" class="member-sns-btn member-sns-btn--x"
           target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.262 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>X
        </a>` : '',
      m.youtube ? `
        <a href="${esc(m.youtube)}" class="member-sns-btn member-sns-btn--yt"
           target="_blank" rel="noopener noreferrer" aria-label="YouTube">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>YouTube
        </a>` : '',
    ].filter(Boolean).join('');

    return `
    <div class="modal-overlay" id="member-modal" role="dialog"
         aria-modal="true" aria-label="${esc(m.name)}のプロフィール">
      <div class="modal-panel">
        <!-- 閉じるボタン -->
        <button class="modal-close" aria-label="閉じる">
          <span aria-hidden="true">✕</span>
        </button>

        <!-- 画像エリア -->
        <div class="modal-img-wrap">
          ${imgHtml}
          <!-- 画像下部フェード -->
          <div class="modal-img-fade" aria-hidden="true"></div>
        </div>

        <!-- プロフィールエリア -->
        <div class="modal-body">
          <p class="modal-position">${esc(m.position)}</p>
          <h2 class="modal-name">${esc(m.name)}</h2>
          <p class="modal-name-en">${esc(m.nameEn)}</p>

          <p class="modal-comment">"${esc(m.comment)}"</p>

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

          ${snsHtml ? `<div class="member-sns">${snsHtml}</div>` : ''}
        </div>
      </div>
    </div>`;
  };

  // ── モーダル開閉 ─────────────────────────────────────────
  let currentData = null;

  const openModal = (m) => {
    // 既存モーダルを除去
    const old = document.getElementById('member-modal');
    if (old) old.remove();

    // モーダルをbodyに追加
    document.body.insertAdjacentHTML('beforeend', buildModal(m));
    document.body.style.overflow = 'hidden';

    const modal = document.getElementById('member-modal');

    // 1フレーム後にアニメーション開始
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add('modal-overlay--visible');
      });
    });

    // 閉じるボタン
    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    // モーダル全体（オーバーレイ・パネル問わず）のクリックで閉じる
    // リンク・ボタンのクリックは除外する
    modal.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      closeModal();
    });

    // フォーカス管理
    modal.querySelector('.modal-close').focus();
  };

  const closeModal = () => {
    const modal = document.getElementById('member-modal');
    if (!modal) return;

    modal.classList.remove('modal-overlay--visible');
    modal.classList.add('modal-overlay--closing');

    modal.addEventListener('transitionend', () => {
      modal.remove();
      document.body.style.overflow = '';
    }, { once: true });

    // フォールバック
    setTimeout(() => {
      if (modal.isConnected) {
        modal.remove();
        document.body.style.overflow = '';
      }
    }, 500);
  };

  // ── Escキーでモーダルを閉じる ────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('member-modal')) {
      closeModal();
    }
  });

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

    currentData = data;
    grid.innerHTML = data.map((m, i) => buildCard(m, i)).join('');

    // カードクリック → モーダル表示
    grid.querySelectorAll('.member-card').forEach(card => {
      const open = () => {
        const id = card.dataset.memberId;
        const m = currentData.find(x => String(x.id) === id);
        if (m) openModal(m);
      };

      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });
  };

  return { render };
})();

export default Members;
