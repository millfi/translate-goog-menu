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
 * -> https://example-com.translate.goog/a/b?x=1&_x_tr_sl=auto&_x_tr_tl=ja&_x_tr_hl=ja#h
 */

function toGoogleTranslateUrl(rawUrl) {
  const u = new URL("https://translate.google.com/translate");

  u.searchParams.set("sl", "auto");
  u.searchParams.set("tl", "ja");
  u.searchParams.set("u", rawUrl);

  return u.toString();
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID_PAGE) return;
  const url = tab?.url;
  if (!url) return;

  const translated = toGoogleTranslateUrl(url);
  if (!translated) return;

  chrome.tabs.create({ url: translated });
});