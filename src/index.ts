import { app, BrowserWindow } from 'electron'
import getNode from './ipfs'
import log from './log'

const createWindow = async (): Promise<void> => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  log(process.env.NODE_ENV)

  if (process.env.NODE_ENV === 'development') {
    await win.loadURL('http://localhost:3001')
  } else {
    await win.loadFile('react/index.html')
  }

  const node = await getNode()
  log(node.name)
}

void app.whenReady().then(createWindow)
