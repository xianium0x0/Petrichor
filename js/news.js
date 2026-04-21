/**
 * Petrich∅r - News Renderer
 * js/news.js
 *
 * data/news.json を読み込み、指定コンテナに描画する。
 * ─────────────────────────────────────────────
 * 【更新方法】
 *   data/news.json を編集するだけでニュースが更新されます。
 *   JSONの構造:
 *     date  : "YYYY-MM-DD"
 *     title : タイトル文字列
 *     text  : 本文（\n で改行可）
 *     tag   : タグ文字列（LIVE / RELEASE / MEDIA / INFO など）
 *     link  : リンクURL（不要なら null）
 * ─────────────────────────────────────────────
 */

const News = (() => {

  const DATA_URL = 'data/news.json';

  // ── 日付フォーマット (YYYY-MM-DD → YYYY.MM.DD) ──────────
  const formatDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return parts.join('.');
  };

  // ── 1件分の <li> HTML を生成 ────────────────────────────
  const buildItem = (item, extraClass = '') => {
    const date    = formatDate(item.date  || '');
    const title   = (item.title || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // \n → <br> に変換（JSON内の改行対応）
    const text    = (item.text  || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    const tag     = (item.tag   || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const hasLink = item.link && typeof item.link === 'string' && item.link.trim() !== '';

    const titleHtml = hasLink
      ? `<a href="${item.link}" class="news-title-link" target="_blank" rel="noopener noreferrer">${title}</a>`
      : `<span class="news-title-text">${title}</span>`;

    return `
      <li class="news-item ${extraClass}" data-reveal-child>
        <time class="news-date" datetime="${item.date || ''}">${date}</time>
        <span class="news-tag">${tag}</span>
        <p class="news-title">${titleHtml}</p>
        ${text ? `<p class="news-body">${text}</p>` : ''}
      </li>`;
  };

  // ── データ取得 ────────────────────────────────────────────
  const fetchNews = async () => {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('news.json: 配列形式ではありません');
      return data;
    } catch (err) {
      console.warn('[News] データ取得エラー:', err.message);
      return null; // エラー時は null を返す
    }
  };

  // ── トップページ用（最新 limit 件） ──────────────────────
  const renderTop = async (listSelector, limit = 3) => {
    const list = document.querySelector(listSelector);
    if (!list) return;

    const data = await fetchNews();

    if (!data || data.length === 0) {
      list.innerHTML = '<li class="news-empty">まだ情報はありません。</li>';
      return;
    }

    const items = data.slice(0, limit);
    list.innerHTML = items.map(item => buildItem(item)).join('');

    // data-reveal-child にアニメを適用（Effect が先に走っている場合の再適用）
    if (window.__petrichorRevealObserver) {
      list.querySelectorAll('[data-reveal-child]').forEach(el => {
        el.style.transitionDelay = '';
      });
    }
  };

  // ── news.html 用（全件） ──────────────────────────────────
  const renderAll = async (listSelector) => {
    const list = document.querySelector(listSelector);
    if (!list) return;

    const data = await fetchNews();

    if (!data || data.length === 0) {
      list.innerHTML = '<li class="news-empty">まだ情報はありません。</li>';
      return;
    }

    list.innerHTML = data.map(item => buildItem(item)).join('');
  };

  return { renderTop, renderAll };
})();

export default News;
