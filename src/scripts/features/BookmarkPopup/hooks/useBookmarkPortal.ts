function findAskGPTButton(): HTMLElement | null {
  const buttons = document.querySelectorAll("button");
  for (const btn of Array.from(buttons)) {
    if (btn.textContent?.trim() === "ChatGPT에게 묻기") {
      return btn as HTMLElement;
    }
  }
  return null;
}

export function useBookmarkPortal() {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const updateTargetElement = () => {
      const askGPTBtn = findAskGPTButton();
      if (!askGPTBtn) {
        setTargetElement(null);
        return;
      }

      // Check if container already exists
      let container = document.getElementById("bookmark-btn-portal");
      if (!container) {
        container = document.createElement("span");
        container.id = "bookmark-btn-portal";
        container.style.display = "inline-flex";
        container.style.alignItems = "center";
        askGPTBtn.insertAdjacentElement("afterend", container);
        setTargetElement(container);
      }
      // 이미 존재하면 setTargetElement를 호출하지 않음 (불필요한 리렌더링 방지)
    };

    // Initial check
    updateTargetElement();

    // Watch for DOM changes
    const observer = new MutationObserver(updateTargetElement);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return targetElement;
}
