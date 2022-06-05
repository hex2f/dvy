// @ts-expect-error
import { Fragment, useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Heading from '../components/heading'
import { Pool, PoolsContext } from '../providers/PoolsProvider'

export default function SavedChannels (): JSX.Element {
  const { pools, removePool } = useContext(PoolsContext)
  return (
    <Fragment>
      <div className="p-4 pt-6 flex-1 max-w-full overflow-hidden">
        <Heading underlined>Saved Channels</Heading>
        {pools.map((pool: Pool) => (
          <div className="flex items-center border-b border-gray-100">
            <Link key={pool.address} to={`/pool/${pool.address}`} className="px-1 py-4 flex-1 cursor-pointer group overflow-hidden">
              <span className="group-hover:underline peer-hover:no-underline whitespace-nowrap">{pool.name}</span>
              <span className='text-gray-300 ml-2'>{pool.address}</span>
            </Link>
            <span className='px-1 py-4 text-red-500 hover:underline peer cursor-pointer' style={{ boxShadow: 'white -8px 0px 8px' }} onClick={() => removePool(pool.address)}>Remove</span>
          </div>
        ))}
      </div>
      <Outlet />
    </Fragment>
  )
}
