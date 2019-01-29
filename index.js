const { app, BrowserWindow } = require('electron')

var win = null;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 1280, height: 980, icon: "img/icon.png", toolbar: false })
  win.setMenu(null);
  win.setAutoHideMenuBar(true);

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.on('ready', createWindow)

app.on('browser-window-created', function(e, window) {
    window.setMenu(null);
});
