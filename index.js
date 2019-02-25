const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require("electron-updater");
const path = require('path');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1280, height: 980, icon: path.join(__dirname, "/img/icon.png"), toolbar: false })

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Check for new updates
   autoUpdater.checkForUpdatesAndNotify();

   console.log("This is an update, v0.1.5");
}

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

app.on('ready', createWindow);
app.on('window-all-closed', app.quit);

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
