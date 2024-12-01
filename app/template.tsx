"use client";

import { PageTransition } from "@/app/components/page-transition"
import { usePathname } from "next/navigation"

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Skip animation wrapper for blog routes as they're handled by blog layout
  if (pathname.startsWith("/blog/")) {
    return children
  }

  return <PageTransition>{children}</PageTransition>
} 