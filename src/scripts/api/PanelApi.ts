export const PanelApi = {
    openPanel(): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "PANEL_OPEN" }, (response) => {
                if (!response?.success) {
                    reject(response?.error);
                }
                else resolve();
            });
        });
    },
}