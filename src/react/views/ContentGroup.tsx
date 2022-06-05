// @ts-expect-error
import { Fragment, useContext } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { Address } from '../../types/address'
import Heading from '../components/heading'
import { Content, PoolContext } from '../providers/PoolProvider'

export default function ContentGroup (): JSX.Element {
  const { groupAddress } = useParams<{ groupAddress: Address }>()
  const { contentGroupMap, fetchContent } = useContext(PoolContext)

  const group = contentGroupMap[groupAddress]

  if (!group) {
    return (
      <Fragment>
        <div className="p-4 pt-6 flex-1">
          <Heading underlined>Content not found</Heading>
        </div>
      </Fragment>
    )
  }

  console.log({ group })

  if (!group.content) {
    fetchContent(groupAddress)
  }

  return (
    <Fragment>
      <div className="p-4 pt-6 flex-1 max-w-full overflow-hidden">
        <Heading underlined>{group.name.length > 0 ? group.name : 'Loading...'}</Heading>
        {group.content?.map((content: Content) => (
          <div className="flex items-center border-b border-gray-100">
            <a key={content.ipfs_cid} href={`http://localhost:8080/ipfs/${content.ipfs_cid}`} target={'_blank'} className="block px-1 py-4 border-b border-gray-100 cursor-pointer group overflow-hidden">
              <span className="group-hover:underline whitespace-nowrap">{content.title}</span>
              <span className='text-gray-300 ml-2'>{content.ipfs_cid}</span>
            </a>
          </div>
        ))}
        {group.loading && <div className="mt-4">Loading...</div>}
      </div>
      <Outlet />
    </Fragment>
  )
}
