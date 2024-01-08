document.head.innerHTML += "<style> [data-message-id] {overflow-x: visible;} .math.math-inline {overflow-x: visible;} .katex {overflow-x: visible; padding: 3px; display: inline-block;} body:not(:has(#contextMenu)) .katex:hover {border: 1px solid #fff; filter: contrast(1.5); background: #0003; margin: -1px; cursor:pointer;} #contextMenu {position: absolute; display: flex; flex-direction: column; background-color: #22232a; border: 1px solid #434343; padding: 5px; box-shadow: 1px 1px 3px #0002;} #contextMenu > * {padding: 0 6px; cursor: pointer; display: flex; grid-gap: 6px;} #contextMenu > *:hover {background: #fff2;} </style>"

var contextMenu;

document.addEventListener("contextmenu", openContextMenu);
document.addEventListener("click", removeContextMenu);
document.addEventListener("onkeydown", removeContextMenu);
document.addEventListener("onresize", removeContextMenu);

function openContextMenu() {
  var mathElement = findMathElement(event.clientX, event.clientY);

  if (mathElement) {
    event.preventDefault();
    removeContextMenu()
    let contextMenuHTML = `
    <div id="contextMenu" style="left: ${event.clientX}px; top: ${event.clientY}px;">
      <div id="copyMathML"><img src="${chrome.runtime.getURL('word.svg')}"/> Copy for Word (MathML) </div>
      <div id="copyLaTeX"><img src="${chrome.runtime.getURL('latex.svg')}"/> Copy LaTeX </div>
    </div>`;

    contextMenu = document.createElement('div');
    contextMenu.innerHTML = contextMenuHTML;
    document.body.appendChild(contextMenu);

    // Add click event listeners to the custom context menu items
    document.getElementById("copyMathML").addEventListener("click", () => {
      checkAndCopy(mathElement, "copyMathML");
    });

    document.getElementById("copyLaTeX").addEventListener("click", () => {
      checkAndCopy(mathElement, "copyLaTeX");
    });
  }
}

function removeContextMenu() {
  if (contextMenu) contextMenu.remove();
}

function findMathElement(x, y) {
  var mathElements = document.getElementsByClassName("katex");

  for (var i = 0; i < mathElements.length; i++) {
    var element = mathElements[i];
    var rect = element.getBoundingClientRect();

    // Check if the mouse coordinates are within the bounding box of the katex element
    if (x >= rect.left - 1 && x <= rect.right + 1 && y >= rect.top - 1 && y <= rect.bottom + 1) {
      return element;
    }
  }

  return null;
}

function checkAndCopy(mathElement, type) {
  if (type === "copyMathML")
  copyToClipboard(mathElement.outerHTML);
  else if (type === "copyLaTeX") {
    copyToClipboard(mathElement.querySelector("semantics > annotation").textContent);
  }
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
