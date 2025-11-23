/**
 * Inline Bookmark popup
 */

window.SideQuest = window.SideQuest || {};

window.SideQuest.showBookmarkPopup = function(text,event) { 
  const existingPopup = document.getElementById('sidequest-bookmark-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  const buttons = document.querySelectorAll(
    'button.btn.relative.btn-secondary.shadow-long.flex.rounded-xl'
  );
  const askGptBtn = [...buttons].find(btn => {
    return btn.querySelector('span')?.classList.contains('flex')
        && btn.querySelector('span')?.classList.contains('items-center');
  });

  if (!askGptBtn) return;

  const rect = askGptBtn.getBoundingClientRect();
  const popup = document.createElement("div");
  popup.id = "sidequest-bookmark-popup";

  popup.innerHTML = `
    <div style="display: flex; align-items:center; gap: 6px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2h12a1 1 0 0 1 1 1v19l-7-5-7 5V3a1 1 0 0 1 1-1z"/>
      </svg>
    </div>
  `;
  popup.style.cssText = `
  position: fixed;
  top: ${rect.top + rect.height / 2 - 20}px;
  left: ${rect.right + 8}px;
  padding: 8px 12px;
  background: rgba(30,30,30,0.85);
  color: white;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  backdrop-filter: blur(4px);
  cursor: pointer;
  z-index: 2147483647;
  box-shadow: 0 4px 15px rgba(0,0,0,0.25);
  opacity: 0;
  transition: opacity .15s ease;
`;

  const state = window.SideQuest.bookmarkState;
  state.selectedBookmarkText = text;
  state.selectedMessageId = window.SideQuest.getMessageIdfromEvent(event);

  const dataRange = window.SideQuest.getDataRangeFromSelection();
  state.selectedDataStart = dataRange.dataStart;
  state.selectedDataEnd = dataRange.dataEnd;

  //팝업을 해당 컴포넌트 옆에 붙이기


  popup.addEventListener('click', () => {
    const bookmarkRecord = window.SideQuest.createBookmarkRecord(
      state.selectedBookmarkText,
      state.selectedMessageId,
      state.selectedDataStart,
      state.selectedDataEnd
    );
    window.SideQuest.saveBookmark(window.SideQuest.getSessionId(), bookmarkRecord);
    window.SideQuest.createReturnButton(bookmarkRecord);
    popup.remove();
  });
  document.body.append(popup)
  requestAnimationFrame(() => {
    popup.style.opacity = "1";
  });
  function close(e) {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener("click", close);
    }
  }
  setTimeout(() => document.addEventListener("click", close), 80);



};
