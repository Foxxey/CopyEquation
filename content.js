let isChatGPT = location.host.includes('chat');

insertCSS('contextMenu');
insertCSS(isChatGPT ? 'chatgpt' : 'wikipedia');

function insertCSS(name) {
  link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(`css/${name}.css`);
  document.head.appendChild(link);
}

function fetchSVGContent(name, callback) {
  fetch(chrome.runtime.getURL(`svg/${name}.svg`))
    .then(response => response.text())
    .then(svgContent => callback(svgContent))
    .catch(error => console.error(`Error fetching SVG content: ${error}`));
}

// Experimental
function updateChat() {
  isChatLoaded = setInterval(() => {
    chat = document.getElementsByClassName("pb-9")[0]?.parentElement; 
    if (chat) {
      clearInterval(isChatLoaded);
      chat.addEventListener("scroll", removeContextMenu);
    }
  }, 10);
}

document.addEventListener("click", removeContextMenu);
document.addEventListener("keydown", removeContextMenu);
window.addEventListener("resize", removeContextMenu);
if (!isChatGPT) document.addEventListener("scroll", removeContextMenu);

let contextMenu, chat, isChatLoaded;

fetchSVGContent('word', function(wordSvgContent) {
  fetchSVGContent('latex', function(latexSvgContent) {
    document.addEventListener("contextmenu", openContextMenu);
    
    function openContextMenu(event) {
      removeContextMenu();
      if (isChatGPT) updateChat();
      let Element = (isChatGPT) ? findKatexElement(event.clientX, event.clientY) : findMweElement(event.clientX, event.clientY);
      if (Element) {
        event.preventDefault();

          // Use the fetched SVG content in your contextMenuHTML
          let contextMenuHTML = `
          <div id="contextMenu" style="left: ${event.clientX}px; top: ${event.clientY + window.pageYOffset}px;">
            <div id="copyMathML">${wordSvgContent} Copy for Word (MathML) </div>
            <div id="copyLaTeX">${latexSvgContent} Copy LaTeX </div>
          </div>`;

          contextMenu = document.createElement('div');
          contextMenu.innerHTML = contextMenuHTML;
          removeContextMenu();
          document.body.appendChild(contextMenu);

          // Add click event listeners to the custom context menu items
          document.getElementById("copyMathML").addEventListener("click", () => {
            checkAndCopy(Element, "copyMathML");
          });

          document.getElementById("copyLaTeX").addEventListener("click", () => {
            checkAndCopy(Element, "copyLaTeX");
          });
      }
    }
  })
})

function removeContextMenu() {
  if (isChatGPT) updateChat();
  [...document.querySelectorAll('div:has(#contextMenu)')].forEach((e)=>e.remove());
}

function isWithin(x, y, className, func) {
  let Elements = document.getElementsByClassName(className);
  for (const element of Elements) {
    let rect = element.getBoundingClientRect();

    if (x >= rect.left - 1 && x <= rect.right + 1 && y >= rect.top - 1 && y <= rect.bottom + 1)
      return func(element);
  }
  return null;
}

function findMweElement(x, y) {
  return(isWithin(x, y, "mwe-math-fallback-image-inline", (e)=>e.parentElement))
}

function findKatexElement(x, y) {
  return(isWithin(x, y, "katex", (e)=>e))
}

function checkAndCopy(Element, type) {
  if (type === "copyMathML")
    copyToClipboard(Element.querySelector("math").outerHTML);
  else if (type === "copyLaTeX") {
    let latex = Element.querySelector("annotation").textContent
    let matches = latex.match(/displaystyle (.*)}/s);
    copyToClipboard(matches ? matches[1] : latex)
  };
}

function copyToClipboard(text) {
  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}