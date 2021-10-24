import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { SOCIALMEDIAS } from '../constants'

export default function SocialIcons() {
  return (
    <div className="flex flex-row items-center lg:px-2">
      {Object.keys(SOCIALMEDIAS).map(key => {
        const sm = SOCIALMEDIAS[key]
        return (
          <Link href={sm.url} key={`link-${key}`}>
            <a className="mx-3 hover:text-opacity-75 text-black duration-200 transition-color dark:text-white dark:text-opacity-75 dark:hover:text-opacity-100">
              <FontAwesomeIcon icon={sm.icon} size='lg' />
            </a>
          </Link>
        )
      })}
    </div>
  )
}