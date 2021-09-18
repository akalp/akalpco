import Link from "next/link"

export default function Header() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="hover:underline text-2xl md:text-4xl font-bold tracking-tighter leading-tight md:pr-8">
        <Link href="/">
          akalp.co
        </Link>
      </h1>
      <div className="flex flex-row justify-end items-center mt-4 lg:pl-8 lg:w-1/2">
        <h4 className="text-lg mx-3">
          <Link href="/">
            <a className="hover:text-success duration-200 transition-colors">
              Blog
            </a>
          </Link>
        </h4>

        <h4 className="text-lg mx-3">
          <Link href="/hakkimda">
            <a className="hover:text-success duration-200 transition-colors">
              Hakkımda
            </a>
          </Link>
        </h4>

        {/* <h4 className="text-lg mx-3">
          <Link href="/photos">
            <a className="hover:text-success duration-200 transition-colors">
              Photos
            </a>
          </Link>
        </h4> */}

      </div>

    </section>
  )
}