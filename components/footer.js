import Container from './container'
import SocialIcons from './social-icons'

export default function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="py-6 flex flex-col lg:flex-row lg:justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-6 lg:mb-0 lg:pr-4">
            akalp.co | Hasan Akalp
          </h3>
          <SocialIcons />
        </div>
      </Container>
    </footer>
  )
}