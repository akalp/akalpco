"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { mainNavigation } from "@/app/data/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-muted bg-background">
      <nav className="container-width flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          akalp.co
        </Link>

        <div className="flex flex-row items-center justify-center gap-2">
          {/* Desktop Navigation */}
          <ul className="hidden gap-6 md:flex">
            {mainNavigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative text-secondary transition-colors hover:text-foreground"
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="text-secondary hover:text-foreground md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 top-16 z-50 border-b border-muted bg-background p-4 shadow-lg md:hidden"
            >
              <ul className="flex flex-col gap-4">
                {mainNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block rounded-lg p-2 transition-colors ${
                        pathname === item.href
                          ? "bg-primary/10 text-foreground"
                          : "text-secondary hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
