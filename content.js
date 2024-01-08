document.head.innerHTML += "<style> [data-message-id] {overflow-x: visible;} .math.math-inline {overflow-x: visible;} .katex {overflow-x: visible; padding: 3px; position: relative; left: -3px; top: -3px; cursor:pointer;} body:not(:has(#contextMenu)) .katex:hover {border: 1px solid #fff; filter: contrast(1.5); background: #0003; margin-left: -1px; padding-right: 2.2px;} #contextMenu {position: absolute;  background-color: #22232a; border: 1px solid #434343; padding: 5px; box-shadow: 1px 1px 3px #0002;} #contextMenu > * {padding: 0 6px; cursor: pointer;} #contextMenu > *:hover {background: #fff2;} </style>"

var contextMenu;
document.addEventListener("contextmenu", openContextMenu);
document.addEventListener("click", openContextMenu);
document.addEventListener("click", removeContextMenu);
document.addEventListener("onkeydown", removeContextMenu);
document.addEventListener("onresize", removeContextMenu);

function openContextMenu() {
  var mathElement = findMathElement(event.clientX, event.clientY);

  if (mathElement) {
    event.preventDefault();
    removeContextMenu()
    document.body.innerHTML += `
      <div id="contextMenu" style="left: ${event.clientX}px; top: ${event.clientY}px;">
        <div id="copyMathML">Copy for Word (MathML)</div>
        <div id="copyLaTeX">Copy LaTeX</div>
      </div>
    `;

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
  contextMenu = document.getElementById("contextMenu")
  if (contextMenu) document.body.removeChild(contextMenu);
}

function findMathElement(x, y) {
  var mathElements = document.getElementsByTagName("math");

  for (var i = 0; i < mathElements.length; i++) {
    var element = mathElements[i];
    var rect = element.getBoundingClientRect();
    // Hack because both katex and math element rects behave weirdly
    var katex_rect = element.parentElement.parentElement.getBoundingClientRect();

    // Check if the mouse coordinates are within the bounding box of the math element
    if (x >= rect.left && x <= katex_rect.right && y >= rect.top && y <= rect.bottom) {
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
