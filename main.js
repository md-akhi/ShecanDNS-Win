const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const { exec } = require('child_process')
const os = require('os');


let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// IPC Handlers
ipcMain.handle('get-interfaces', async () => {
  const interfaces = os.networkInterfaces();
  const interfaceNames = Object.keys(interfaces).filter(name => interfaces[name].some(iface => !iface.internal && iface.family === 'IPv4'));
  return interfaceNames;
});

ipcMain.handle('set-dns', (event, { interfaceName, dnsServers }) => {
  return new Promise((resolve, reject) => {
    exec(`netsh interface ipv4 set dns "${interfaceName}" static ${dnsServers[0]} primary`, (error) => {
      if (error) reject(error)
      exec(`netsh interface ipv4 add dns "${interfaceName}" ${dnsServers[1]} index=2`, (error) => {
        if (error) reject(error)
        resolve()
      })
    })
  })
})

ipcMain.handle('reset-dns', (event, interfaceName) => {
  return new Promise((resolve, reject) => {
    if (process.platform === 'win32') {
      // برای ویندوز
      exec(`netsh interface ipv4 set dnsservers "${interfaceName}" dhcp`, (error) => {
        if (error) {
          reject(new Error(`خطا در ریست DNS: ${error.message}`));
          return;
        }
        resolve();
      });
    } else if (process.platform === 'linux') {
      // برای لینوکس
      exec(`nmcli con mod "${interfaceName}" ipv4.dns ""`, (error) => {
        if (error) {
          reject(new Error(`خطا در ریست DNS: ${error.message}`));
          return;
        }
        exec(`nmcli con up "${interfaceName}"`, (error) => {
          if (error) reject(new Error(`خطا در اعمال تغییرات: ${error.message}`));
          else resolve();
        });
      });
    } else if (process.platform === 'darwin') {
      // برای مک
      exec(`networksetup -setdnsservers "${interfaceName}" empty`, (error) => {
        if (error) reject(new Error(`خطا در ریست DNS: ${error.message}`));
        else resolve();
      });
    } else {
      reject(new Error('سیستم عامل پشتیبانی نمی‌شود'));
    }
  });
});

// ایجاد پوشه پروفایل‌ها اگر وجود نداشته باشد
const profilesDir = path.join(app.getPath('userData'), 'profiles')
fs.ensureDirSync(profilesDir)

// هندلرهای جدید برای پروفایل‌ها
ipcMain.handle('save-profile', async (event, profileData) => {
  try {
    const profilePath = path.join(profilesDir, `${profileData.name}.json`)
    await fs.writeJson(profilePath, profileData)
    return { success: true }
  } catch (error) {
    console.error('Error saving profile:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('load-profiles', async () => {
  try {
    const files = await fs.readdir(profilesDir)
    const profiles = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const profilePath = path.join(profilesDir, file)
        const content = await fs.readJson(profilePath)
        profiles.push(content)
      }
    }
    
    return profiles
  } catch (error) {
    console.error('Error loading profiles:', error)
    return []
  }
})

ipcMain.handle('delete-profile', async (event, profileName) => {
  try {
    const profilePath = path.join(profilesDir, `${profileName}.json`)
    await fs.remove(profilePath)
    return { success: true }
  } catch (error) {
    console.error('Error deleting profile:', error)
    return { success: false, error: error.message }
  }
})