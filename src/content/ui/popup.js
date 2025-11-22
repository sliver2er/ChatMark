/**
 * Inline "Make a bookmark?" popup
 */

window.SideQuest = window.SideQuest || {};

const BASE_BG = "rgba(255, 255, 255, 0.12)";
const HOVER_BG = "rgba(255, 255, 255, 0.20)";
const ACTIVE_BG = "rgba(255, 255, 255, 0.27)";

const BASE_BORDER = "rgba(255, 255, 255, 0.18)";
const HOVER_BORDER = "rgba(255, 255, 255, 0.25)";
const ACTIVE_BORDER = "rgba(255, 255, 255, 0.33)";

const BASE_SHADOW = "0 4px 12px rgba(0, 0, 0, 0.15)";
const HOVER_SHADOW = "0 4px 16px rgba(0, 0, 0, 0.22)";
const ACTIVE_SHADOW = "0 2px 8px rgba(0, 0, 0, 0.20)";

window.SideQuest.showBookmarkPopup = function(text, x, y, event) {
  const existingPopup = document.getElementById('sidequest-bookmark-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const state = window.SideQuest.bookmarkState;
  state.selectedBookmarkText = text;
  state.selectedMessageId = window.SideQuest.getMessageIdfromEvent(event);

  const dataRange = window.SideQuest.getDataRangeFromSelection();
  state.selectedDataStart = dataRange.dataStart;
  state.selectedDataEnd = dataRange.dataEnd;

  const popup = document.createElement('div');
  popup.id = 'sidequest-bookmark-popup';

  let isHovering = false;
  let isMouseDown = false;

  function applyStyle() {
    if (isMouseDown) {
      popup.style.background = ACTIVE_BG;
      popup.style.borderColor = ACTIVE_BORDER;
      popup.style.boxShadow = ACTIVE_SHADOW;
      return;
    }

    if (isHovering) {
      popup.style.background = HOVER_BG;
      popup.style.borderColor = HOVER_BORDER;
      popup.style.boxShadow = HOVER_SHADOW;
      return;
    }

    popup.style.background = BASE_BG;
    popup.style.borderColor = BASE_BORDER;
    popup.style.boxShadow = BASE_SHADOW;
  }

  popup.style.cssText = `
    position: absolute;
    top: ${y + 12}px;
    left: ${x}px;
    padding: 10px 14px;
    border-radius: 10px;
    background: rgba(30, 30, 30, 0.85);
    backdrop-filter: blur(4px);
    color: #f5f5f5;
    font-size: 14px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    border: 1px solid rgba(255,255,255,0.12);
    z-index: 2147483000;
    cursor: pointer;
    transition: all 0.12s ease;
    opacity: 0;
  `;

  popup.textContent = 'Make a bookmark?';

  popup.addEventListener('mouseenter', () => {
    isHovering = true;
    applyStyle();
  });

  popup.addEventListener('mouseleave', () => {
    isHovering = false;
    isMouseDown = false;
    applyStyle();
  });

  popup.addEventListener('mousedown', () => {
    isMouseDown = true;
    applyStyle();
  });

  popup.addEventListener('mouseup', () => {
    isMouseDown = false;
    applyStyle();
  });

  popup.addEventListener('click', () => {
    const bookmarkRecord = window.SideQuest.createBookmarkRecord(
      state.selectedBookmarkText,
      state.selectedMessageId,
      state.selectedDataStart,
      state.selectedDataEnd
    );
    window.SideQuest.saveBookmark(window.SideQuest.getSessionId(), bookmarkRecord);

    console.log('Bookmark record created:', bookmarkRecord);
    window.SideQuest.createReturnButton(bookmarkRecord);
    popup.remove();
  });

  document.body.appendChild(popup);

  requestAnimationFrame(() => {
    popup.style.opacity = "1";
  });

  function handleOutsideClick(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener('click', handleOutsideClick);
    }
  }

  setTimeout(() => {
    document.addEventListener('click', handleOutsideClick);
  }, 100);
};
