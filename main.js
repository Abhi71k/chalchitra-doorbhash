// Electron
const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const { showRoleDialog } = require('./dialog');
require('update-electron-app')()
const { app, autoUpdater, dialog } = require('electron')
const path = require('path');

const server = 'https://github.com/tomrabhishek/electron-chalchitra-doorbhash'
const url = `${server}/update/${process.platform}/${app.getVersion()}`
autoUpdater.setFeedURL({ url })

setInterval(() => {
  autoUpdater.checkForUpdates()
}, 60000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application')
  console.error(message)
})


app.userAgentFallback = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
app.commandLine.appendSwitch('disable-throttle-non-visible-cross-origin-iframes', true);

function createWindow(weblink) {
  const mainWindow = new BrowserWindow({
    center: true,
    movable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, './preload.js'),
      webSecurity: false,
    },
  });
  mainWindow.maximize();

  mainWindow.openDevTools();

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ['*://*/*'] },
    (details, callback) => {
      const responseHeaders = Object.assign({}, details.responseHeaders);

      if (responseHeaders['X-Frame-Options'] || responseHeaders['x-frame-options']) {
        delete responseHeaders['X-Frame-Options'];
        delete responseHeaders['x-frame-options'];
      }

      callback({ cancel: false, responseHeaders });
    }
  );


  mainWindow.loadFile('index.html');

  mainWindow.webContents.setWindowOpenHandler(({ event, url, options }) => {
    console.log(url, options, event)
    const win = new BrowserWindow();
    win.maximize();
    win.loadURL(url)
    return { action: 'deny' };
  });

  mainWindow.webContents.on("did-finish-load", async function() {
    mainWindow.webContents.send("weblink", weblink);
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        // if (permission === 'media') {
          // Handle media permission request
          console.log(permission,"uguygbj")
          callback(true); // You might want to customize this based on your requirements
        // } else {
        //   callback(false);
        // }
      });
    mainWindow.webContents.session.setDisplayMediaRequestHandler((request, callback) => {
      console.log(request, 'request got successfully.........');
      const waitForValue = (valueCallback) => {
        ipcMain.on('source-screen', (_event, value) => {
          console.log(value, 'Received value from source-screen event');
          valueCallback(value);
        });
      };

        desktopCapturer.getSources({ types: ['window','screen'] }).then((sources) => {
          sources.map(source => {
                source.thumbnailURL = source.thumbnail.toDataURL();
                return source;
           });
          mainWindow.webContents.send("show-popup", sources);
          waitForValue((value)=> {
            console.log(value);
            const selectedScreen = sources.find(source => source.id === value)
            callback({video:selectedScreen,enableLocalEcho:false})
          });
          
        }).catch((error) => {
          console.error('Error in getting sources:', error);
          callback({ video: null });
        });

      });
});

  ipcMain.on('window-data', function (event, message) {
    console.log(message);
    console.log('dom is successfully loaded');
  });
}

app.commandLine.appendSwitch('disable-site-isolation-trials');


app.whenReady().then(() => {
  const selectedRole = showRoleDialog();

  // Check the selected role and create the main window accordingly
  if (selectedRole === 'student') {
    createWindow('https://dev-champ.brightchamps.com/');
  } else if (selectedRole === 'teacher') {
    createWindow('https://dev-dronacharya.brightchamps.com/');
  } else {
    app.quit();
  }
  // createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

