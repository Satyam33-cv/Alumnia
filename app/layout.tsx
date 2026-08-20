import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ScrollProgress } from "@/components/ui/Layout";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "AlumniConnect | Keep the thread going",
  description: "A living network for alumni, students, and the people who help them move forward."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <AuthProvider>
          <ScrollProgress color="brass" height={3} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}