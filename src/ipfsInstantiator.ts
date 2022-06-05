import * as IPFSCore from 'ipfs-core'
import type { IPFS } from 'ipfs-core'

export default class IPFSInstantiator {
  #ipfs?: IPFS
  #ipfsPromise: Promise<IPFS>

  constructor () {
    // eslint-disable-next-line no-async-promise-executor
    this.#ipfsPromise = new Promise<IPFS>(async (resolve, reject) => {
      this.#ipfs = await IPFSCore.create({})
      resolve(this.#ipfs)
    })
  }

  async get (): Promise<IPFS> {
    if (!this.#ipfs) return this.#ipfsPromise
    return this.#ipfs
  }
}
