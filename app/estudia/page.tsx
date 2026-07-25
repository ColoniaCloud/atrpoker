import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWpToken } from "@/lib/wp-token";
import { getProgreso } from "@/lib/wordpress";
import { EstudiaPageClient } from "@/components/EstudiaPageClient";
import type { Progreso } from "@/lib/types";

export const metadata: Metadata = {
  title: "Estudia Progresivamente | ATRPoker",
  description: "Seguí el curso de poker en orden y llevá el registro de tu avance.",
  robots: { index: false },
};

export default async function EstudiaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/estudia");
  }

  const token = await getWpToken();
  const progreso: Progreso = token ? await getProgreso(token) : {};

  return (
    <EstudiaPageClient
      progreso={progreso}
      userName={session.user.name ?? null}
      userImage={session.user.image ?? null}
    />
  );
}
