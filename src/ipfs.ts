import * as IPFSCore from 'ipfs-core'
import type { IPFS } from 'ipfs-core'

let node: IPFS|undefined

// eslint-disable-next-line no-async-promise-executor
const promise = new Promise<IPFS>(async (resolve, reject) => {
  node = await IPFSCore.create({})
  resolve(node)
})

export default async function getNode (): Promise<IPFS> {
  if (!node) return await promise
  return node
}
