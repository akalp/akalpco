import { faGithub, faTwitter, faLinkedin, faInstagram, faSpotify } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
}

export const SOCIALMEDIAS = {
  github: {
    url: 'https://github.com/akalp',
    name: 'Github',
    icon: faGithub
  },
  linkedin: {
    url: 'https://linkedin.com/in/akalp',
    name: 'LinkedIn',
    icon: faLinkedin
  },
  email: {
    url: 'mailto:hasan@akalp.co',
    name: 'E-Mail',
    icon: faEnvelope
  },
  twitter: {
    url: 'https://twitter.com/hasanakalp',
    name: 'Twitter',
    icon: faTwitter
  },
  instagram: {
    url: 'https://instagram.com/hasanakalp',
    name: 'Instagram',
    icon: faInstagram
  },
  // spotify: {
  //   url: 'https://open.spotify.com/user/hasanakalp',
  //   name: 'Spotify',
  //   icon: faSpotify
  // }
}