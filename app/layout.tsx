import type { Metadata } from "next";
import { Archivo_Black, Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/footer/Footer";
import { VybeIntro } from "@/components/intro/VybeIntro";
import { HideOnAccount } from "@/components/layout/SiteChrome";
import { Navbar } from "@/components/navbar/Navbar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { siteConfig } from "@/config/site";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

/** Soft serif for account dashboard greetings */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Ultra-bold display — Druk-like weight for the footer wordmark */
const druk = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-druk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: siteConfig.title,
    template: `%s • ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${fraunces.variable} ${druk.variable} h-full`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-bg font-sans text-sm text-text antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider>
          <VybeIntro />
          <HideOnAccount>
            <Navbar />
          </HideOnAccount>
          <main className="w-full min-w-0 bg-bg pt-0">{children}</main>
          <HideOnAccount>
            <Footer />
          </HideOnAccount>
        </ThemeProvider>
      </body>
    </html>
  );
}
