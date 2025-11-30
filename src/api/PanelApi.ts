export const PanelApi = {
    openPanel(session_id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "PANEL_OPEN", session_id }, (response) => {
                if (!response?.success) {
                    reject(response?.error);
                }
                else resolve();
            });
        });
    },
}