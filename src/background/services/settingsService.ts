import * as repo from "../repository/settingsCRUD";

export const handleSettingsGet = async (msg: any, sendResponse: Function) => {
  const settings = await repo.getSettings();
  sendResponse({ success: true, data: settings });
};
export const handleSettingsUpdate = async (msg: any, sendResponse: Function) => {
  const settings = await repo.updateSettings(msg.payload);
  sendResponse({ success: true, data: settings });
};
