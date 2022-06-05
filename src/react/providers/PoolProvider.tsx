// @ts-expect-error
import React, { createContext, PropsWithChildren, useState, useEffect } from 'react'
import { Address } from '../../types/address'
import { Pool } from './PoolsProvider'
import { ipcRenderer } from 'electron'

export interface Content {
  title: string
  ipfs_cid: string
}

export interface ContentGroup {
  name: string
  address: Address
  content?: Content[]
  loaded?: boolean
}

interface IPoolContext {
  name: string
  address: Address
  contentGroups: ContentGroup[]
  contentGroupMap: Record<Address, ContentGroup>
  loading: boolean
  fetchContent: (contentGroup: ContentGroup) => void
}

export const PoolContext = createContext<IPoolContext>({
  name: '',
  address: '',
  contentGroups: [],
  contentGroupMap: {},
  loading: true,
  fetchContent: () => {}
})

export function PoolProvider ({ children, pool }: PropsWithChildren<{ pool: Pool }>): React.ReactElement {
  const [loading, setLoading] = useState(true)
  const [contentGroups, setContentGroups] = useState<ContentGroup[]>([])
  const [contentGroupMap, setContentGroupMap] = useState<Record<Address, ContentGroup>>({})

  useEffect(() => {
    for (const group of pool.groups) {
      if (!contentGroups.find((g: ContentGroup) => g.name === group.name)) {
        ipcRenderer.send('get-group-meta', group)
      }
    }
  }, [pool.groups])

  useEffect(() => {
    const handleGroupMeta = (event: Electron.IpcRendererEvent, group: ContentGroup): void => {
      setContentGroups((contentGroups: ContentGroup[]) => [...contentGroups, group])
    }
    const handleGroupContent = (event: Electron.IpcRendererEvent, group: ContentGroup): void => {
      setContentGroups((contentGroups: ContentGroup[]) => {
        const newContentGroups: ContentGroup[] = []
        for (const g of contentGroups) {
          if (g.address === group.address) {
            newContentGroups.push({
              ...g,
              ...group,
              loaded: true
            })
          } else {
            newContentGroups.push(g)
          }
        }
        return newContentGroups
      })
    }
    ipcRenderer.on('group-meta', handleGroupMeta)
    ipcRenderer.on('group-content', handleGroupContent)
    return () => {
      ipcRenderer.removeListener('group-meta', handleGroupMeta)
      ipcRenderer.removeListener('group-content', handleGroupContent)
    }
  }, [])

  useEffect(() => {
    if (contentGroups.length === pool.groups.length) {
      setLoading(false)
    }
    setContentGroupMap((contentGroupMap: Record<Address, ContentGroup>) => {
      const newContentGroupMap: Record<Address, ContentGroup> = {}
      for (const group of contentGroups) {
        newContentGroupMap[group.address] = group
      }
      return newContentGroupMap
    })
  }, [contentGroups])

  const fetchContent = (groupAddress: Address): void => {
    ipcRenderer.send('get-group-content', groupAddress)
  }

  console.log(contentGroups)

  return (
    <PoolContext.Provider
      value={{
        name: pool.name,
        address: pool.address,
        contentGroups,
        contentGroupMap,
        loading,
        fetchContent
      }}
    >
      {children}
    </PoolContext.Provider>
  )
}
