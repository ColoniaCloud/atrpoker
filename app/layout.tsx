import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ATRPoker — Póker Online en Uruguay",
    template: "%s | ATRPoker",
  },
  description:
    "Las mejores salas de póker online, reseñas, bonos, academia, coaches y streaming en vivo. La comunidad de póker de Uruguay.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://atrpoker.com"),
  openGraph: {
    siteName: "ATRPoker",
    locale: "es_UY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
