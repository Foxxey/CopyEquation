chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var selectedElement = window.getSelection().focusNode.parentElement;
    var mathElement = findMathElement(selectedElement);
    
    if (mathElement) {
      checkAndCopy(mathElement, request.action);
    } else {
      mathElement = selectedElement.querySelector(".katex-mathml > math")
      if (mathElement) checkAndCopy(mathElement, request.action);
    }
});

function checkAndCopy(mathElement, type) {
  if (type === "copyMathML")
  copyToClipboard(mathElement.outerHTML);
  else if (type === "copyLaTeX") {
    copyToClipboard(mathElement.querySelector("semantics > annotation").textContent);
  }
}

function findMathElement(element) {
  if (!element || element.tagName.toLowerCase() == 'html')
  return null;
  if (element.className == 'katex')
  return element.querySelector(".katex-mathml > math");

  return findMathElement(element.parentElement);
}

function copyToClipboard(text) {
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = text;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}
