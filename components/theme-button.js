import { useContext } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

import StoreContext from '../store'
import { THEME } from '../constants'

export default function ThemeButton({ children, ...props }) {

  const store = useContext(StoreContext)
  return (
    <a className="cursor-pointer hover:text-opacity-75 text-black duration-200 transition-color dark:text-white dark:text-opacity-75 dark:hover:text-opacity-100">
      <FontAwesomeIcon icon={store.theme === THEME.LIGHT ? faMoon : faSun} onClick={() =>
        store.changeTheme(
          store.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
        )
      } />
    </a>
  )
}