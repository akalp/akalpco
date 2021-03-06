import Link from "next/link"
import ThemeButton from "./theme-button"

export default function Header() {
  return (
    <section className="flex-col md:flex-row flex items-center justify-between my-8 md:my-16">
      <h1 className="hover:underline text-2xl md:text-4xl font-bold tracking-tighter leading-tight mb-3 md:mb-0">
        <Link href="/">
          akalp.co
        </Link>
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-row items-center mb-3 md:mb-0">
          <h4 className="text-lg mx-3">
            <Link href="/">
              <a className="navlink">
                Blog
              </a>
            </Link>
          </h4>

          <h4 className="text-lg mx-3">
            <Link href="/hakkimda">
              <a className="navlink">
                Hakkımda
              </a>
            </Link>
          </h4>

        </div>

        <div className="flex items-center mx-auto md:pl-4">
          <ThemeButton />
        </div>
      </div>

    </section>
  )
}