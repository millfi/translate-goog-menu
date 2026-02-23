const MENU_ID_PAGE = "open_translate_goog_page";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID_PAGE,
    title: "Google翻訳（translate.goog）で開く",
    contexts: ["page"],
  });
});

function toGoogleTranslateUrl(rawUrl) {
  const u = new URL("https://translate.google.com/translate");
  u.searchParams.set("sl", "auto");
  u.searchParams.set("tl", "ja");
  u.searchParams.set("u", rawUrl);
  return u.toString();
}

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID_PAGE) return;

  const url = info.pageUrl; // tab.url を読まない
  if (!url) return;

  chrome.tabs.create({ url: toGoogleTranslateUrl(url) });
});
