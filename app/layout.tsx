import type { Metadata } from "next";
import { Unbounded, Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { PageTransition } from "@/components/PageTransition";
import { getCoaches, getSalas } from "@/lib/wordpress";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ATRPoker — Póker Online en Latinoamerica",
    template: "%s | ATRPoker",
  },
  description:
    "Las mejores salas de póker online, reseñas, bonos, academia, coaches y streaming en vivo. La comunidad de póker de Latinoamerica.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://atrpoker.com"),
  openGraph: {
    siteName: "ATRPoker",
    locale: "es_UY",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [coaches, { items: salas }] = await Promise.all([
    getCoaches(),
    getSalas({ perPage: 20 }),
  ]);

  return (
    <html lang="es" className={`${unbounded.variable} ${inter.variable} ${oswald.variable}`}>
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Navbar coaches={coaches} salas={salas} />
          <main className="flex-1 w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[65vw] mx-auto">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppFloat />
        </SessionProvider>
      </body>
    </html>
  );
}
