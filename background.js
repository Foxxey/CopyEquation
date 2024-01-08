chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        title: "Copy for Word (MathML)",
        id: "copyMathML",
        contexts: ["all"]
    });

    chrome.contextMenus.create({
        title: "Copy LaTeX",
        id: "copyLaTeX",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "copyMathML")
    chrome.tabs.sendMessage(tab.id, { action: "copyMathML" });
    else if (info.menuItemId === "copyLaTeX")
    chrome.tabs.sendMessage(tab.id, { action: "copyLaTeX" });
});
