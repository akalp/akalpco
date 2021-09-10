import Link from 'next/link'

import Container from './container'

import { SOCIALMEDIAS } from '../constants'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Footer() {
  return (
    <footer className="bg-accent-1 border-t border-accent-2">
      <Container>
        <div className="py-6 flex flex-col lg:flex-row items-center">
          <h3 className="text-xl lg:text-2xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-6 lg:mb-0 lg:pr-4 lg:w-1/2">
            akalp.co | Hasan Akalp
          </h3>
          <div className="flex flex-row justify-end items-center lg:pl-4 lg:w-1/2">
            {Object.keys(SOCIALMEDIAS).map(key => {
              const sm = SOCIALMEDIAS[key]
              return (
                <Link href={sm.url} key={`link-${key}`}>
                  <a className="mx-3 hover:text-gray-500 text-black duration-200 transition-colors">
                    <FontAwesomeIcon icon={sm.icon} size='lg' />
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </footer>
  )
}