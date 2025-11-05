import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { ThemeProvider } from "@/app/components/theme-provider";
import "@/app/globals.css";
import { geistSans, geistMono } from "@/app/config/fonts";
import { metadata } from "@/app/config/metadata";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0a0a0a"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <ThemeProvider>
          <a
            href="#main-content"
            className="absolute left-1/2 top-4 z-[100] -translate-x-1/2 -translate-y-[150%] transform rounded-md bg-foreground px-4 py-2 font-semibold text-background transition-transform duration-300 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
