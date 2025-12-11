export function scrollToRange(range: Range, fallbackElement: HTMLElement) {
  const scrollTarget = range.startContainer.nodeType === Node.TEXT_NODE
    ? range.startContainer.parentElement
    : range.startContainer as HTMLElement;

  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior: 'instant', block: 'center' });
  } else {
    fallbackElement.scrollIntoView({ behavior: 'instant', block: 'center' });
  }
}

export function scrollToElement(element: HTMLElement) {
  element.scrollIntoView({ behavior: 'instant', block: 'center' });
}

export function selectElement(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  selection.removeAllRanges();
  const messageRange = document.createRange();
  messageRange.selectNodeContents(element);
  selection.addRange(messageRange);

  setTimeout(() => {
    selection.removeAllRanges();
  }, SELECTION_REMOVE_DELAY);
}
