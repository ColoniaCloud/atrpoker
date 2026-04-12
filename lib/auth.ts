import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { wpLogin, getWPCurrentUser } from "./wordpress";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "WordPress",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const jwtResponse = await wpLogin(
          credentials.username as string,
          credentials.password as string
        );

        if (!jwtResponse?.token) return null;

        // Obtener datos completos del usuario (incluye roles)
        const wpUser = await getWPCurrentUser(jwtResponse.token);

        if (!wpUser) return null;

        return {
          id: String(wpUser.id),
          name: wpUser.name,
          email: jwtResponse.user_email,
          image: wpUser.avatar_urls?.["96"] ?? null,
          // Datos extra que persisten en el token JWT de NextAuth
          wpToken: jwtResponse.token,
          roles: wpUser.roles,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Al hacer login, user tiene los datos del authorize()
      if (user) {
        token.wpToken = (user as { wpToken?: string }).wpToken;
        token.roles = (user as { roles?: string[] }).roles ?? [];
      }
      return token;
    },

    async session({ session, token }) {
      // Pasar roles y token WP a la sesión del cliente
      session.user.wpToken = token.wpToken as string | undefined;
      session.user.roles = (token.roles as string[]) ?? [];
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 días
  },
});

// ─── Helpers de roles ────────────────────────────────────────────────────────

const STREAMING_ROLES = (
  process.env.STREAMING_ROLES ?? "subscriber,administrator"
)
  .split(",")
  .map((r) => r.trim().toLowerCase());

export function hasStreamingAccess(roles: string[]): boolean {
  return roles.some((role) =>
    STREAMING_ROLES.includes(role.toLowerCase())
  );
}

export function isAdmin(roles: string[]): boolean {
  return roles.includes("administrator");
}

// Roles con acceso a subcategorías premium de Academia
const ACADEMIA_PREMIUM_ROLES = ["administrator", "editor", "colaborador", "player"];

export function hasEscuelaPremiumAccess(roles: string[]): boolean {
  return roles.some((role) =>
    ACADEMIA_PREMIUM_ROLES.includes(role.toLowerCase())
  );
}
