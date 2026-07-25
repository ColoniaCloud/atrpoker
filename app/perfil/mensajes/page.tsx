"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ChevronRight, MessagesSquare } from "lucide-react";
import { MensajesInbox } from "@/components/MensajesInbox";

export default function MensajesPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/perfil/mensajes");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground/70">
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href="/perfil" className="transition-colors hover:text-foreground">
          Mi perfil
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-foreground/60">Mensajes</span>
      </nav>

      <h1 className="mb-6 flex items-center gap-2.5 text-2xl font-black text-foreground">
        <MessagesSquare className="h-6 w-6 text-amber-400" />
        Mensajes
      </h1>

      <MensajesInbox />
    </div>
  );
}
