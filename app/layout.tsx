import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "ATRPoker — Póker Online en Uruguay",
    template: "%s | ATRPoker",
  },
  description:
    "Las mejores salas de póker online, reseñas, bonos, streaming en vivo y comunidad de póker en Uruguay.",
  metadataBase: new URL(
    process.env.NEXTAUTH_URL || "https://atrpoker.com"
  ),
  openGraph: {
    siteName: "ATRPoker",
    locale: "es_UY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
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
