/**
 * Temporarily highlight a text range with a visual effect using Selection API
 * The highlight fades out after 2 seconds
 */
export function highlightRange(range: Range): void {
  const selection = window.getSelection();
  if (!selection) return;

  // Add custom highlight style to the page if not already present
  let styleElement = document.getElementById("chatmark-highlight-style") as HTMLStyleElement;
  if (!styleElement) {
    styleElement = document.createElement("style");
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
  }

  // Select the range
  selection.removeAllRanges();
  selection.addRange(range);

  // Clear selection after 2 seconds
  setTimeout(() => {
    if (selection) {
      selection.removeAllRanges();
    }
  }, 4000);
}
