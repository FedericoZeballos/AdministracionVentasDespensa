const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  console.log("🖥️ Creando ventana de Electron...");

  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: false, // Permitir cargar archivos locales
    },
    show: false,
    titleBarStyle: "default",
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    autoHideMenuBar: false, // Mostrar menú por defecto
  });

  // Mostrar la ventana cuando esté lista
  mainWindow.once("ready-to-show", () => {
    console.log("🎯 Ventana lista para mostrar");
    mainWindow.show();
    mainWindow.focus();
  });

  // Emitido cuando la ventana es cerrada
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Manejar carga exitosa
  mainWindow.webContents.on("did-finish-load", () => {
    console.log("✅ Aplicación cargada exitosamente");
  });

  // Cargar directamente el archivo HTML
  const indexPath = path.join(__dirname, "index.html");
  console.log(`🌐 Cargando archivo HTML directamente: ${indexPath}`);
  mainWindow.loadFile(indexPath);
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador
app.whenReady().then(() => {
  console.log("🚀 Electron listo, creando ventana...");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Salir cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Crear menú personalizado
const template = [
  {
    label: "Archivo",
    submenu: [
      {
        label: "Nueva Venta",
        accelerator: "CmdOrCtrl+N",
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send("nueva-venta");
          }
        },
      },
      {
        label: "Actualizar",
        accelerator: "CmdOrCtrl+R",
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.reload();
          }
        },
      },
      {
        type: "separator",
      },
      {
        label: "Salir",
        accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Editar",
    submenu: [
      { role: "undo", label: "Deshacer" },
      { role: "redo", label: "Rehacer" },
      { type: "separator" },
      { role: "cut", label: "Cortar" },
      { role: "copy", label: "Copiar" },
      { role: "paste", label: "Pegar" },
      { role: "selectall", label: "Seleccionar Todo" },
    ],
  },
  {
    label: "Ver",
    submenu: [
      { role: "reload", label: "Recargar" },
      { role: "forceReload", label: "Forzar Recarga" },
      { role: "toggleDevTools", label: "Herramientas de Desarrollo" },
      { type: "separator" },
      { role: "resetZoom", label: "Zoom Normal" },
      { role: "zoomIn", label: "Aumentar Zoom" },
      { role: "zoomOut", label: "Disminuir Zoom" },
      { type: "separator" },
      { role: "togglefullscreen", label: "Pantalla Completa" },
    ],
  },
  {
    label: "Ventana",
    submenu: [
      { role: "minimize", label: "Minimizar" },
      { role: "close", label: "Cerrar" },
    ],
  },
  {
    label: "Ayuda",
    submenu: [
      {
        label: "Acerca de",
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: "info",
            title: "Acerca de Control de Ventas",
            message: "Control de Ventas - Aplicación de Escritorio",
            detail:
              "Versión 1.0.0\n\nSistema de control de ventas con base de datos SQLite\nDesarrollado con Electron y Node.js",
          });
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Manejar eventos IPC del renderer
ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-app-name", () => {
  return app.getName();
});
