import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import "./globals.css";
import { geistSans, geistMono } from "./config/fonts";
import { metadata } from "./config/metadata";

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
