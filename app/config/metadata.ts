import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://akalp.co"),
  title: {
    default: "Hasan Akalp - Full-Stack Software Engineer",
    template: "%s | Hasan Akalp",
  },
  description:
    "Full-Stack Software Engineer specializing in TypeScript, React, Next.js, and modern web technologies. Based in Ankara, Turkey.",
  keywords: [
    "Hasan Akalp",
    "Full-Stack Developer",
    "Software Engineer",
    "TypeScript",
    "React",
    "Next.js",
    "Spring Boot",
    "Python",
    "Django",
  ],
  authors: [{ name: "Hasan Akalp" }],
  creator: "Hasan Akalp",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://akalp.co",
    siteName: "Hasan Akalp",
    title: "Hasan Akalp - Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in TypeScript, React, Next.js, and modern web technologies.",
    images: [
      {
        url: "/images/hasan.webp", // Make sure to add this image to your public folder
        width: 1200,
        height: 1200,
        alt: "Hasan Akalp - Full-Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hasan Akalp - Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in TypeScript, React, Next.js, and modern web technologies.",
    images: ["/images/hasan.webp"], // Same image as OpenGraph
    site: "@hasanakalp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

// Page-specific metadata
export const aboutMetadata: Metadata = {
  title: "About",
  description:
    "Learn more about Hasan Akalp and his experience in software engineering.",
};

export const portfolioMetadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore my latest projects and technical achievements in web development.",
};

export const blogMetadata: Metadata = {
  title: "Blog",
  description:
    "Read my thoughts and insights about software development, tech trends, and best practices.",
};

export const contactMetadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with me for collaborations, opportunities, or just to say hello.",
};
