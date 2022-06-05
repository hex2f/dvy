// @ts-expect-error why does typescript think react exports nothing???
import React, { createContext, useEffect } from 'react'
import { Address } from '../../types/address'
import { ContentGroup } from './PoolProvider'
import { ipcRenderer } from 'electron'

export interface Pool {
  name: string
  address: Address
  contentGroups: ContentGroup[]
}

interface IPoolsContext {
  pools: Pool[]
  poolMap: Record<Address, Pool>
  addPool: (poolAddress: string) => void
  removePool: (poolAddress: string) => void
}

export const PoolsContext = createContext<IPoolsContext>({
  pools: []
})

export function PoolsProvider ({ children }: { children: React.ReactNode }): React.ReactElement {
  const [pools, setPools] = React.useState<Pool[]>([])
  const [poolMap, setPoolMap] = React.useState<Record<Address, Pool>>({})
  const [poolAddresses, setPoolAddresses] = React.useState<Address[]>(JSON.parse(localStorage.getItem('savedPools') ?? '[]'))
  const [fetchedPools, setFetchedPools] = React.useState<Address[]>([])

  useEffect(() => {
    const handlePoolAddresses = (event: Electron.IpcRendererEvent, pool: Pool): void => {
      setPools((pools: Pool[]) => [...pools, pool])
      setFetchedPools((fetchedPools: Address[]) => [...fetchedPools, pool.address])
    }
    ipcRenderer.on('pool-meta', handlePoolAddresses)
    return () => ipcRenderer.removeListener('pool-meta', handlePoolAddresses)
  }, [])

  useEffect(() => {
    for (const poolAddress of poolAddresses) {
      if (!fetchedPools.includes(poolAddress)) ipcRenderer.send('get-pool-meta', poolAddress)
    }
    setPools((pools: Pool[]) => pools.filter((pool: Pool) => !poolAddresses.includes(pool.address)))
    localStorage.setItem('savedPools', JSON.stringify(poolAddresses))
  }, [poolAddresses])

  useEffect(() => {
    setPoolMap((poolMap: Record<Address, Pool>) => {
      const newPoolMap: Record<Address, Pool> = {}
      for (const pool of pools) {
        newPoolMap[pool.address] = pool
      }
      return newPoolMap
    })
  }, [pools])

  const addPool = (poolAddress: Address): void => {
    setPoolAddresses((poolAddresses: Address[]) => [...poolAddresses, poolAddress])
  }

  const removePool = (poolAddress: Address): void => {
    setPoolAddresses((poolAddresses: Address[]) => poolAddresses.filter((address: Address) => address !== poolAddress))
  }

  return (
    <PoolsContext.Provider
      value={{
        pools,
        poolMap,
        addPool,
        removePool
      }}
    >
      {children}
    </PoolsContext.Provider>
  )
}
