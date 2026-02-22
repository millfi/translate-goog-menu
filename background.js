const MENU_ID_PAGE = "open_translate_goog_page";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID_PAGE,
    title: "Google翻訳（translate.goog）で開く",
    contexts: ["page"]
  });
});

/**
 * 例:
 *   https://example.com/a/b?x=1#h
 * -> https://example-com.translate.goog/a/b?x=1&_x_tr_sl=auto&_x_tr_tl=ja&_x_tr_hl=ja&_x_tr_pto=wapp#h
 *
 * ポイント:
 * - translate.goog では元ドメインの '.' を '-' にするのが基本
 * - パス・クエリ・フラグメントは維持
 * - 翻訳パラメータ(_x_tr_*)は任意。無くても動く場合が多いですが、付けた方が安定します。
 */
function toTranslateGoogUrl(rawUrl) {
  const u = new URL(rawUrl);

  // chrome-extension:// や edge:// 等は対象外（必要ならここで弾く）
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;

  const domain = u.hostname.replaceAll(".", "-");
  const out = new URL(`https://${domain}.translate.goog${u.pathname}`);

  // クエリをコピー
  out.search = u.search;

  // 翻訳パラメータ（必要に応じて変更）
  const sp = out.searchParams;
  if (!sp.has("_x_tr_sl")) sp.set("_x_tr_sl", "auto");
  if (!sp.has("_x_tr_tl")) sp.set("_x_tr_tl", "ja"); // 翻訳先
  if (!sp.has("_x_tr_hl")) sp.set("_x_tr_hl", "ja");
  if (!sp.has("_x_tr_pto")) sp.set("_x_tr_pto", "wapp");

  // フラグメントを維持
  out.hash = u.hash;

  return out.toString();
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID_PAGE) return;
  const url = tab?.url;
  if (!url) return;

  const translated = toTranslateGoogUrl(url);
  if (!translated) return;

  chrome.tabs.create({ url: translated });
});