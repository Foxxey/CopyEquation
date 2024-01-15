let style = document.createElement('style');
style.innerHTML = "[data-message-id] {overflow-x: visible;} .math.math-inline {overflow-x: visible;} .katex {overflow-x: visible; padding: 3px; display: inline-block;} body:not(:has(#contextMenu)) .katex:hover {border: 1px solid #fff; filter: contrast(1.5); background: #0003; margin: -1px; cursor:pointer;} #contextMenu {position: absolute; display: flex; flex-direction: column; background-color: #22232a; border: 1px solid #434343; padding: 5px; box-shadow: 1px 1px 3px #0002;} #contextMenu > * {width: 210px; padding: 0 6px; cursor: pointer; display: flex; grid-gap: 6px;} #contextMenu > *:hover {background: #fff2;} #contextMenu img {height: 16px; margin-top: auto; margin-bottom: auto;}"
document.body.appendChild(style);

let contextMenu, chat, isChatLoaded;

document.addEventListener("contextmenu", openContextMenu);
document.addEventListener("click", removeContextMenu);
document.addEventListener("keydown", removeContextMenu);
window.addEventListener("resize", removeContextMenu);

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

function openContextMenu(event) {
  updateChat();
  let katexElement = findKatexElement(event.clientX, event.clientY);

  if (katexElement) {
    event.preventDefault();
    removeContextMenu()
    let contextMenuHTML = `
    <div id="contextMenu" style="left: ${event.clientX}px; top: ${event.clientY}px;">
      <div id="copyMathML"><img src="${chrome.runtime.getURL('svg/word.svg')}"/> Copy for Word (MathML) </div>
      <div id="copyLaTeX"><img src="${chrome.runtime.getURL('svg/latex.svg')}"/> Copy LaTeX </div>
    </div>`;

    contextMenu = document.createElement('div');
    contextMenu.innerHTML = contextMenuHTML;
    document.body.appendChild(contextMenu);

    // Add click event listeners to the custom context menu items
    document.getElementById("copyMathML").addEventListener("click", () => {
      checkAndCopy(katexElement, "copyMathML");
    });

    document.getElementById("copyLaTeX").addEventListener("click", () => {
      checkAndCopy(katexElement, "copyLaTeX");
    });
  }
}

function removeContextMenu() {
  updateChat();
  if (contextMenu) contextMenu.remove();
}

function findKatexElement(x, y) {
  let katexElements = document.getElementsByClassName("katex");

  for (const element of katexElements) {
    let rect = element.getBoundingClientRect();

    // Check if the mouse coordinates are within the bounding box of the katex element
    if (x >= rect.left - 1 && x <= rect.right + 1 && y >= rect.top - 1 && y <= rect.bottom + 1)
      return element;
  }

  return null;
}

function checkAndCopy(katexElement, type) {
  if (type === "copyMathML")
    copyToClipboard(katexElement.querySelector("math").outerHTML);
  else if (type === "copyLaTeX")
    copyToClipboard(katexElement.querySelector("annotation").textContent);
}

function copyToClipboard(text) {
  let dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
