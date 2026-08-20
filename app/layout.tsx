import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ScrollProgress } from "@/components/ui/Layout/ScrollProgress";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-satoshi",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alumniconnect.io"),
  title: {
    default: "AlumniConnect | Keep the thread going",
    template: "%s | AlumniConnect",
  },
  description: "A living network for alumni, students, and the people who help them move forward. Connect, mentor, hire, and give back.",
  keywords: ["alumni", "networking", "mentorship", "career", "jobs", "events", "giving", "university"],
  authors: [{ name: "AlumniConnect Team" }],
  creator: "AlumniConnect",
  publisher: "AlumniConnect",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alumniconnect.io",
    siteName: "AlumniConnect",
    title: "AlumniConnect | Keep the thread going",
    description: "A living network for alumni, students, and the people who help them move forward.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AlumniConnect - Alumni Network Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AlumniConnect | Keep the thread going",
    description: "A living network for alumni, students, and the people who help them move forward.",
    images: ["/og-image.png"],
    creator: "@alumniconnect",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFEFF" },
    { media: "(prefers-color-scheme: dark)", color: "#282943" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AlumniConnect",
  url: "https://alumniconnect.io",
  logo: "https://alumniconnect.io/logo.svg",
  description: "A living network for alumni, students, and the people who help them move forward.",
  sameAs: [
    "https://twitter.com/alumniconnect",
    "https://linkedin.com/company/alumniconnect",
    "https://github.com/alumniconnect",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-800-ALUMNI-1",
    contactType: "customer service",
    availableLanguage: "English",
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AlumniConnect",
  url: "https://alumniconnect.io",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://alumniconnect.io/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceGrotesk.variable} ${plexMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ScrollProgress color="purple" height={3} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}