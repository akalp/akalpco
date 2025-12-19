import Link from "next/link";
import { contacts } from "@/data/contacts";
import { mainNavigation } from "@/data/navigation";

const socialContacts = contacts.filter(
  (contact) => contact.name !== "Location"
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/20 mt-auto border-t border-muted">
      <div className="container-width pb-6 pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left section */}
          <div>
            <h2 className="text-lg font-semibold">Hasan Akalp</h2>
            <p className="mt-2 max-w-md text-sm text-secondary">
              Full-Stack Software Engineer specializing in TypeScript, React,
              Next.js, and modern web technologies. Based in Ankara, Turkey.
            </p>
            <div className="mt-4 flex space-x-6">
              {socialContacts.map((item) => (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="text-secondary hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div>
            <h3 className="text-sm font-semibold">Navigation</h3>
            <ul className="mt-4 flex flex-row gap-6">
              {mainNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-secondary hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 border-t border-muted pt-8">
          <p className="text-center text-sm text-secondary">
            © {currentYear} Hasan Akalp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
