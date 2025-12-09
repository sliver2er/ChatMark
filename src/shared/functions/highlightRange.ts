/**
 * Temporarily highlight a text range with a visual effect using Selection API
 * The highlight fades out after 2 seconds
 */
export function highlightRange(range: Range): void {
  const selection = window.getSelection();
  if (!selection) return;

  const styleElement = document.createElement("style");
  styleElement.id = "chatmark-highlight-style";
  styleElement.textContent = `
    ::selection {
      background-color: #81c147 !important;
      color: inherit !important;
    }
    ::-moz-selection {
      background-color: #81c147 !important;
      color: inherit !important;
    }
  `;
  document.head.appendChild(styleElement);
  selection.removeAllRanges();
  selection.addRange(range);
  setTimeout(() => {
    if (selection) {
      selection.removeAllRanges();
    }
    styleElement.remove();
  }, 2000);
}
