import type { Metadata } from "next";
import { Epilogue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getCoaches } from "@/lib/wordpress";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["400", "800"],
  variable: "--font-epilogue",
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
  const coaches = await getCoaches();

  return (
    <html lang="es" className={epilogue.variable}>
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Navbar coaches={coaches} />
          <main className="flex-1 w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[65vw] mx-auto">{children}</main>
          <Footer />
          <WhatsAppFloat />
        </SessionProvider>
      </body>
    </html>
  );
}
