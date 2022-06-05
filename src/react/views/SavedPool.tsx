// @ts-expect-error
import { Fragment, useContext } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'
import Heading from '../components/heading'
import { PoolContext, PoolProvider, ContentGroup } from '../providers/PoolProvider'
import { PoolsContext } from '../providers/PoolsProvider'

function SavedPool (): JSX.Element {
  const { name, address, loading, contentGroups } = useContext(PoolContext)
  return (
    <Fragment>
      <div className="p-4 pt-6 flex-1 max-w-full overflow-hidden">
        <Heading underlined>{name}</Heading>
        {contentGroups.map((group: ContentGroup) => (
          <div key={address} className="flex items-center border-b border-gray-100">
            <Link to={`/pool/${address}/cg/${group.address}`} className="px-1 py-4 flex-1 cursor-pointer group overflow-hidden">
              <span className="group-hover:underline peer-hover:no-underline whitespace-nowrap">{group.name}</span>
              <span className='text-gray-300 ml-2'>{group.address}</span>
            </Link>
          </div>
        ))}
        {loading && <div className="mt-4">Loading...</div>}
      </div>
      <Outlet />
    </Fragment>
  )
}

export default function SavedPoolWithProvider (): JSX.Element {
  const { address } = useParams<{ address: string }>()
  const { poolMap } = useContext(PoolsContext)

  const pool = poolMap[address]

  if (!pool) {
    return (
      <Fragment>
        <div className="p-4 pt-6 flex-1">
          <Heading underlined>Channel not found</Heading>
        </div>
      </Fragment>
    )
  }

  return (
    <PoolProvider pool={pool}>
      <SavedPool />
    </PoolProvider>
  )
}
