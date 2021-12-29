const {app, ipcMain, dialog, BrowserWindow, Menu} = require("electron");
const serve = require("electron-serve");
const ws = require("electron-window-state");
const path = require("path");
const fs = require("fs");
try { require("electron-reloader")(module); } catch {}

const loadURL = serve({directory: "."});
const port = process.env.PORT || 3000;
const isdev = !app.isPackaged || (process.env.NODE_ENV == "development");
let mainwindow;

ipcMain.on("createFile", (event, args) => {
  fs.writeFile(path.join(__dirname, "routes/newfile.svelte"), args,  (error, data) => {
    if(!error)
    mainwindow.webContents.send("fromMain", 'created successfully');
  });
});

function loadVite(port) {
  mainwindow.loadURL(`http://127.0.0.1:${port}`).catch((err) => {
    setTimeout(() => { loadVite(port); }, 200);
  });
}

function createMainWindow() {
  let mws = ws({
    defaultWidth: 1000,
    defaultHeight: 800
  });
  
  mainwindow = new BrowserWindow({
    x: mws.x,
    y: mws.y,
    width: mws.width,
    height: mws.height,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      devTools: isdev,
      preload: path.join(__dirname, "preload.cjs"),
    }
  });

  const menuTemplate = [
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' },
        {
          label: 'new window',
          click: function(){
            createMainWindow();
          }
        }
      ]
    },
  ];

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  mainwindow.once("close", () => { mainwindow = null; });

  if(!isdev) mainwindow.removeMenu();
  else mainwindow.webContents.openDevTools();

  mws.manage(mainwindow);

  if(isdev) loadVite(port);
  else loadURL(mainwindow);
}

app.once("ready", createMainWindow);
app.on("activate", () => { if(!mainwindow) createMainWindow(); });
app.on("window-all-closed", () => { if(process.platform !== "darwin") app.quit(); });