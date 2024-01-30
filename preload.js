const { contextBridge, ipcRenderer } = require("electron");

const windowApi = {
  source: (source) => ipcRenderer.send("get-source", source),
  showPopup: (callback) => ipcRenderer.on('show-popup', (_event, value) => callback(value)),
  weblink: (callback) => ipcRenderer.on('weblink', (_event, value) => callback(value)),
  sourceScreen: (value) => ipcRenderer.send('source-screen', value),
  send: (channel, data) => ipcRenderer.invoke(channel, data),
  handle: (channel, callable, event, data) => ipcRenderer.on(channel, callable(event, data))
};

contextBridge.exposeInMainWorld('api', windowApi);
document.addEventListener("click", function (e) {
  var clickedElement = e.target;
  console.log("click",clickedElement);

  ipcRenderer.send("window-data","clickedElement");
});

document.addEventListener("DOMContentLoaded", () => {
const iframe = document.getElementById("webview");
console.log(iframe);
iframe.addEventListener('load', function() {
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

    const share_button = iframeDocument.querySelector("[jsname='hNGZQc']");
    console.log(share_button);

    iframeDocument.addEventListener('mouseup', function (e) {
      console.log(e);
        var clickedElement = e.target;

        if(clickedElement.dataset.isMuted === "true") {
          console.log('person is muted');
        }
        if(clickedElement.dataset.isMuted === "false") {
          console.log('person is unmuted');
        }

        console.log("click",clickedElement, clickedElement.dataset);
      ipcRenderer.send("window-data", "clickedElement");
    });
    console.log("DOM content loaded inside iframe");
});
console.log("dom content loaded 1")
  ipcRenderer.send("window-data", "data");
});
