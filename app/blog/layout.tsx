import { PageTransition } from "@/app/components/page-transition";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
