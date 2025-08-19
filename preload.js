const { contextBridge, ipcRenderer } = require("electron");

// Exponer APIs protegidas al renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  // Obtener información de la aplicación
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getAppName: () => ipcRenderer.invoke("get-app-name"),

  // Escuchar eventos del proceso principal
  onNuevaVenta: (callback) => {
    ipcRenderer.on("nueva-venta", callback);
  },

  // Remover listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Exponer información del entorno
contextBridge.exposeInMainWorld("isElectron", true);
contextBridge.exposeInMainWorld("platform", process.platform);
