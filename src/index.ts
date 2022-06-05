import { app, BrowserWindow } from 'electron'
import type { IPFS } from 'ipfs-core'
import WalletInsantiator from './walletInsantiator'
import IPFSInstantiator from './ipfsInstantiator'
import { Wallet } from 'ethers'

class App {
  #wallet: WalletInsantiator
  #ipfs: IPFSInstantiator
  #window: BrowserWindow

  constructor () {
    this.#wallet = new WalletInsantiator()
    this.#ipfs = new IPFSInstantiator()

    this.#window = new BrowserWindow({
      width: 1200,
      height: 800,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    })

    if (process.env.NODE_ENV === 'development') {
      void this.#window.loadURL('http://localhost:3001')
    } else {
      void this.#window.loadFile('react/index.html')
    }
  }

  async getWallet (): Promise<Wallet> {
    return this.#wallet.get()
  }

  async getIPFS (): Promise<IPFS> {
    return this.#ipfs.get()
  }
}

let appState: App|undefined

export const getAppState = (): App => {
  if (!appState) throw new Error('App state not initialized')
  return appState
}

void app.whenReady().then(() => {
  appState = new App()
})
