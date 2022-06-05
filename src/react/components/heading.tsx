// @ts-expect-error
import React, { PropsWithChildren } from 'react'

import { Link } from 'react-router-dom'

interface HeadingLink {
  title: string
  to?: string
  dangerous?: boolean
  onClick?: () => void
}

function Heading ({ children, links, underlined }: PropsWithChildren<{ links?: HeadingLink[], underlined: boolean }>): JSX.Element {
  const className = 'font-bold text-3xl mt-1'
  if (links) {
    return (
      <div className={'flex justify-between items-center border-b border-gray-200 pb-1'}>
        <h1 className={className}>{children}</h1>
        <ul className={'list-reset flex justify-end mt-2.5'}>
          {links.map(({ to, dangerous, onClick, title }: HeadingLink) => (
            <li key={title} className={'mr-2'}>
              {to
                ? (
                <Link className={dangerous ? 'text-red-500' : 'text-blue-600'} to={to}>{title}</Link>
                  )
                : (
                <span className={(dangerous ? 'text-red-500' : 'text-blue-600') + ' cursor-pointer'} onClick={onClick}>{title}</span>
                  )
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (underlined) {
    return (
      <div className={'flex justify-between items-center border-b border-gray-200 pb-1'}>
        <h1 className={className}>{children}</h1>
      </div>
    )
  }
  return (
    <h1 className={className}>{children}</h1>
  )
}

export default Heading
