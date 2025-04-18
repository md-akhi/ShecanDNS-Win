const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getInterfaces: () => ipcRenderer.invoke('get-interfaces'),
  setDNS: (config) => ipcRenderer.invoke('set-dns', config),
  resetDNS: (interfaceName) => ipcRenderer.invoke('reset-dns', interfaceName),

  saveProfile: (profileData) => ipcRenderer.invoke('save-profile', profileData),
  loadProfiles: () => ipcRenderer.invoke('load-profiles'),
  deleteProfile: (profileName) => ipcRenderer.invoke('delete-profile', profileName),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options)
})