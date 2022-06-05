import { localStorage } from 'electron-browser-storage'
import crypto from 'crypto'
import { Contract, providers, Wallet as EthersWallet } from 'ethers'
import { ipcMain } from 'electron'
import log from './log'

import PoolABI from './abis/pool.json'
import GroupABI from './abis/group.json'

const Networks = {
  mainnet: 1,
  rinkeby: 4,
  polygon: 137
}

export default class WalletInsantiator {
  #wallet?: EthersWallet
  #walletPromise: Promise<EthersWallet>

  #poolContracts: Map<string, Contract> = new Map()
  #groupContracts: Map<string, Contract> = new Map()

  constructor () {
    // eslint-disable-next-line no-async-promise-executor
    this.#walletPromise = new Promise<EthersWallet>(async (resolve, reject) => {
      const id = await crypto.randomBytes(32).toString('hex')
      const privateKey = await localStorage.getItem('wallet_privatekey') ?? '0x' + id
      await localStorage.setItem('wallet_privatekey', privateKey)
      log('Creating wallet with private key', privateKey)
      this.#wallet = new EthersWallet(
        privateKey,
        new providers.InfuraProvider(
          providers.getNetwork(
            Networks[process.env.NODE_ENV === 'development' ? 'rinkeby' : 'polygon']
          ),
          '1dcfcdba91ea44e08615be19b156ecca'
        )
      )
      log(`Instantiated Wallet[${this.#wallet.address}]`)
      await localStorage.setItem('wallet_address', this.#wallet.address)
      resolve(this.#wallet)
    })

    ipcMain.on('get-wallet-meta', async (event) => {
      const wallet = await this.get()
      event.reply('wallet-meta', {
        address: wallet.address
      })
    })

    ipcMain.on('get-pool-meta', async (event, address: string) => {
      const pool = await this.getPoolContract(address)
      const name = await pool.name()
      const groups = await pool.allGroups()
      event.reply('pool-meta', {
        address: pool.address,
        name,
        groups
      })
    })

    ipcMain.on('get-group-meta', async (event, address: string) => {
      const group = await this.getGroupContract(address)
      const name = await group.name()
      event.reply('group-meta', {
        address: group.address,
        name
      })
    })

    ipcMain.on('get-group-content', async (event, address: string) => {
      const group = await this.getGroupContract(address)
      const content = await group.allContent()
      event.reply('group-content', {
        address: group.address,
        content
      })
    })
  }

  async getPoolContract (address: string): Promise<Contract> {
    if (!this.#poolContracts.has(address)) {
      const wallet = await this.get()
      const contract = new Contract(address, PoolABI, wallet)
      this.#poolContracts.set(address, contract)
      return contract
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#poolContracts.get(address)!
  }

  async getGroupContract (address: string): Promise<Contract> {
    if (!this.#groupContracts.has(address)) {
      const wallet = await this.get()
      const contract = new Contract(address, GroupABI, wallet)
      this.#groupContracts.set(address, contract)
      return contract
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.#groupContracts.get(address)!
  }

  async get (): Promise<EthersWallet> {
    if (!this.#wallet) return this.#walletPromise
    return this.#wallet
  }
}
