const path = require("path");
const { BrowserWindow } = require("electron"); // https://www.electronjs.org/docs/api/browser-window

exports.createBrowserWindow = () => {
  // https://www.electronjs.org/docs/api/browser-window#class-browserwindow
  console.log("2");
  return new BrowserWindow({
    width: 1024,
    height: 768,
    resizable: true,
    backgroundColor: "#fff",
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      nativeWindowOpen: true,
      devTools: true, // false if you want to remove dev tools access for the user
      webviewTag: true, // https://www.electronjs.org/docs/api/webview-tag,
      preload: path.join(__dirname, "../preload.js"),
    },
  });
};
