import { app, BrowserWindow } from 'electron'

const createWindow = async (): Promise<void> => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  await win.loadFile('index.html')
}

void app.whenReady().then(createWindow)
