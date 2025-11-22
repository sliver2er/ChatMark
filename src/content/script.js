


// Get the message ID from event
function getMessageIdfromEvent(event) {
  const messageNode = event.target.closest('[data-message-id]');

  if (!messageNode) {
    return null;
  }
  const messageId = messageNode.getAttribute('data-message-id');
  return messageId;
}

// Get data-start and data-end from selected text element
function getDataRangeFromSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return { dataStart: null, dataEnd: null };
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

  while (element) {
    if (element.hasAttribute('data-start') && element.hasAttribute('data-end')) {
      return {
        dataStart: element.getAttribute('data-start'),
        dataEnd: element.getAttribute('data-end')
      };
    }
    element = element.parentElement;
  }

  return { dataStart: null, dataEnd: null };
}


// Extract session ID from URL
function getSessionId() {
  const url = window.location.href;
  const match = url.match(/\/c\/([^\/\?#]+)/);
  return match ? match[1] : null;
}

// Create bookmark record object
function createBookmarkRecord(text, messageId, dataStart, dataEnd, parentId = null) {
  const sessionId = getSessionId();

  return {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
    sessionId: sessionId,
    text: text,
    messageId: messageId,
    dataStart: dataStart,
    dataEnd: dataEnd,
    timestamp: Date.now(),
    parentId: parentId
  };
}

function createReturnButton(bookmarkRecord) {
  removeReturnButton();

  const btn = document.createElement('div');
  btn.id = 'sidequest-return-btn';

  // Filled Bookmark Icon (white)
  btn.innerHTML = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2h12a1 1 0 0 1 1 1v19l-7-5-7 5V3a1 1 0 0 1 1-1z"/>
    </svg>
  `;

  btn.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 28px;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;

    backdrop-filter: blur(8px);
    background: rgba(30, 30, 30, 0.55);

    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 50%;

    box-shadow:
      0 6px 20px rgba(0,0,0,0.25),
      inset 0 0 8px rgba(255,255,255,0.05);

    cursor: pointer;
    z-index: 2147483647;
    transition: all 0.2s ease;
    user-select: none;
  `;

  // Create tooltip
  const tooltip = document.createElement('div');
  tooltip.id = 'sidequest-tooltip';
  const truncatedText = bookmarkRecord.text.length > 50
    ? bookmarkRecord.text.substring(0, 50) + '...'
    : bookmarkRecord.text;
  tooltip.textContent = `Return to "${truncatedText}"`;

  tooltip.style.cssText = `
    position: fixed;
    bottom: 95px;
    right: 28px;
    padding: 8px 12px;
    background: rgba(30, 30, 30, 0.95);
    color: #f5f5f5;
    font-size: 13px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 2147483646;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    white-space: nowrap;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
  `;

  btn.addEventListener('mouseover', () => {
    btn.style.transform = 'scale(1.08)';
    btn.style.boxShadow = '0 8px 24px rgba(0,0,0,0.32)';
    tooltip.style.opacity = '1';
  });

  btn.addEventListener('mouseout', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow =
      '0 6px 20px rgba(0,0,0,0.25), inset 0 0 8px rgba(255,255,255,0.05)';
    tooltip.style.opacity = '0';
  });

  btn.addEventListener('click', () => {
    returnToBookmark(bookmarkRecord);
  });

  document.body.appendChild(btn);
  document.body.appendChild(tooltip);
}


function removeReturnButton() {
  const btn = document.getElementById('sidequest-return-btn');
  const tooltip = document.getElementById('sidequest-tooltip');
  if (btn) btn.remove();
  if (tooltip) tooltip.remove();
}


// Create and show popup below the selected text
function showBookmarkPopup(text, x, y, event) {
  const existingPopup = document.getElementById('sidequest-bookmark-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Store the selected text, message ID, and data range
  selectedBookmarkText = text;
  selectedMessageId = getMessageIdfromEvent(event);
  const dataRange = getDataRangeFromSelection();
  selectedDataStart = dataRange.dataStart;
  selectedDataEnd = dataRange.dataEnd;

  const popup = document.createElement('div');

let isHovering = false;
let isMouseDown = false;

const BASE_BG = "rgba(255, 255, 255, 0.12)";
const HOVER_BG = "rgba(255, 255, 255, 0.20)";
const ACTIVE_BG = "rgba(255, 255, 255, 0.27)";

const BASE_BORDER = "rgba(255, 255, 255, 0.18)";
const HOVER_BORDER = "rgba(255, 255, 255, 0.25)";
const ACTIVE_BORDER = "rgba(255, 255, 255, 0.33)";

const BASE_SHADOW = "0 4px 12px rgba(0, 0, 0, 0.15)";
const HOVER_SHADOW = "0 4px 16px rgba(0, 0, 0, 0.22)";
const ACTIVE_SHADOW = "0 2px 8px rgba(0, 0, 0, 0.20)";

popup.style.transition = "all 0.12s ease";

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
  popup.id = 'sidequest-bookmark-popup';
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
    transition: transform .15s ease, opacity .15s ease;
    opacity: 0;
    `;

    requestAnimationFrame(() => {
    popup.style.opacity = "1";
    });
    popup.onmouseenter = () => {
    isHovering = true;
    applyStyle();
    };

    popup.onmouseleave = () => {
    isHovering = false;
    isMouseDown = false; 
    applyStyle();
    };

    popup.onmousedown = () => {
    isMouseDown = true;
    applyStyle();
    };

    popup.onmouseup = () => {
    isMouseDown = false;
    applyStyle();
    };

  popup.textContent = 'Make a bookark?';
  popup.addEventListener('click', () => {
    const bookmarkRecord = createBookmarkRecord(
      selectedBookmarkText,
      selectedMessageId,
      selectedDataStart,
      selectedDataEnd
    );
    console.log('Bookmark record created:', bookmarkRecord);
    createReturnButton(bookmarkRecord);
    popup.remove();
  });
  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target)) {
      popup.remove();
    };
    });
  document.body.appendChild(popup);
}

document.addEventListener('dblclick', (e) => {
  const text = window.getSelection().toString().trim();
  if (!text) return;
  showBookmarkPopup(text, e.pageX, e.pageY, e);
});


function returnToBookmark(bookmark) {
  let target = null;
  let messageRoot = null;
  if (bookmark.messageId) {
    messageRoot = document.querySelector(`[data-message-id="${bookmark.messageId}"]`);
  }
  if (messageRoot && bookmark.dataStart) {
    target = messageRoot.querySelector(`[data-start="${bookmark.dataStart}"]`);
  }
  if (messageRoot && bookmark.dataEnd) {
    target = messageRoot.querySelector(`[data-end="${bookmark.dataEnd}"]`);
  }
  if (target) {
    target.scrollIntoView({ behavior: 'instant', block : 'start' })
  }
  else if (messageRoot){
    messageRoot.scrollIntoView({ behavior: 'instant', block : 'start' })
  }
  removeReturnButton();
}
