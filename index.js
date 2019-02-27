const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1280, height: 980, icon: path.join(__dirname, "/img/icon.png"), toolbar: true })

  // and load the index.html of the app.
  win.loadFile('index.html');
  // win.loadURL(__dirname + '/index.html')
}

app.on('ready', createWindow);
app.on('window-all-closed', app.quit);

process.on('uncaughtException', (err) => {
  console.log(err);
});
