// ─── Curriculum "Estudia Progresivamente" ────────────────────────────────────
//
// Define el orden fijo del curriculum. Cada item hace referencia al slug de
// un post de WordPress en la sección Academia.
//
// `subcategory`  → determina el Bunny Stream Library ID (ESCUELA_LIBRARY_IDS)
// `videoIdField` → qué campo ACF tiene el Bunny video ID:
//   "bunny_video_id"   → curso-principiantes
//   "bunny_video_id_2" → resto de subcategorías
//
// Flags en CurriculumSection:
//   `alwaysUnlocked` → todos los items de la sección son siempre accesibles
//                      Y la primera clase de la sección siguiente NO necesita
//                      que esta esté completa para desbloquearse (ej: módulo
//                      3 que se puede saltear, módulos complementarios)

import type { Progreso } from "@/lib/types";

export interface CursoItem {
  slug: string;
  title: string;
  subcategory: string;
  videoIdField: "bunny_video_id" | "bunny_video_id_2";
  duration?: string;
}

export interface CursoSection {
  id: string;
  label: string;
  /** Tailwind color token (sin prefijo), ej. "emerald", "sky", "violet" */
  color: string;
  /**
   * Si es true, todos los items son siempre accesibles sin importar el progreso.
   * La primera clase del módulo siguiente tampoco queda bloqueada por este módulo.
   */
  alwaysUnlocked?: boolean;
  items: CursoItem[];
}

// ─── Puntos ATR ────────────────────────────────────────────────────────────────
export const POINTS_PER_CLASS = 5;
export const POINTS_PER_MODULE = 50;

// ─── Módulo 1 · Curso Principiantes ───────────────────────────────────────────
const M1: CursoItem[] = [
  { slug: "comenzando-a-escalar-la-montana-objetivos-y-plan-parte-1", title: "Comenzando a escalar la montaña – Objetivos y plan | Parte 1", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "bankroll-el-gran-pilar-del-negocio-parte-2", title: "Bankroll, el gran pilar del negocio | Parte 2", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "lenguaje-clave-posiciones-y-terminos-del-poker-parte-3", title: "Lenguaje clave: Posiciones y términos del poker | Parte 3", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "juego-post-flop-srp-ip-estrategia-en-el-flop-parte-4", title: "Juego Post Flop SRP IP: Estrategia en el flop | Parte 4", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "defendiendo-vs-cbet-ejemplos-practicos-parte-5", title: "Defendiendo vs Cbet: Ejemplos prácticos | Parte 5", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "como-jugar-vs-recreacionales-parte-6", title: "Cómo jugar vs recreacionales | Parte 6", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "3bet-pots-con-iniciativa-parte-7", title: "3Bet Pots con iniciativa | Parte 7", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "call-en-3bet-pots-parte-8", title: "Call en 3Bet Pots | Parte 8", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "matematica-y-estadistica-aplicada-al-poker-parte-9", title: "Matemática y estadística aplicada al poker | Parte 9", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "sesion-practica-nl5-y-nl10-parte-10", title: "Sesión práctica NL5 y NL10 | Parte 10", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "sesion-practica-nl5-y-nl10-parte-11", title: "Sesión práctica NL5 y NL10 | Parte 11", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "sesion-practica-nl5-y-nl10-parte-12", title: "Sesión práctica NL5 y NL10 | Parte 12", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
  { slug: "cierre-del-curso-y-proximos-pasos-parte-13", title: "Cierre del curso y próximos pasos | Parte 13", subcategory: "curso-principiantes", videoIdField: "bunny_video_id" },
];

// ─── Módulo 2 · Curso Teórico Práctico ────────────────────────────────────────
const M2: CursoItem[] = [
  { slug: "juego-vs-fishes-part-1", title: "Juego vs Fishes | Part. 1", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "juego-vs-fishes-part-2", title: "Juego vs Fishes | Part. 2", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "juego-vs-fishes-part-3", title: "Juego vs Fishes | Part. 3", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "defensa-bb-teoria", title: "Defensa BB | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "defensa-bb-ejemplos", title: "Defensa vs Cbet | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "c-bet-flop-y-turn-estrategias", title: "CBet Flop y Turn | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "bet-flop-y-turn", title: "CBet Flop y Turn | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "raice-vs-c-bet-teoria", title: "Raise vs CBet | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "raise-vs-c-bet-ejemplos", title: "Raise vs CBet | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "tripe-barrel-teoria", title: "Triple Barrel | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "triple-barrel-ejemplos", title: "Triple Barrel | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "juego-oop-as-pfr-teoria", title: "Juego OOP as PFR | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "juego-oop-as-pfr-ejemplos", title: "Juego OOP as PFR | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "3-bet-pots-ip-teoria", title: "3-Bet Pots IP | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "3-bet-pots-ip-ejemplos", title: "3-Bet Pots IP | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "3-bet-pots-oop-teoria", title: "3-Bet Pots OOP | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "3-bet-pots-oop-ejemplos", title: "3-Bet Pots OOP | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "call-3-bet-pots-teoria", title: "Call 3-Bet Pots | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "call-3-bet-pots-ejemplos", title: "Call 3-Bet Pots | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "sqz-pots-teoria", title: "SQZ Pots | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "sqz-pots-ejemplos", title: "SQZ Pots | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "botes-multiway-vs-fishes-teoria", title: "Botes Multiway vs Fishes | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "botes-multiway-vs-fishes-ejemplos", title: "Botes Multiway vs Fishes | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "botes-multiway-vs-regs-teoria", title: "Botes Multiway vs Regs | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "botes-multiway-vs-regs-ejemplos", title: "Botes Multiway vs Regs | Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "call-4-bet-pots-teoria-y-ejemplos", title: "Call 4-Bet Pots | Teoría y Ejemplos", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "call-3bet-pots-opp", title: "Call 3BET Pots OPP", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "sb-vs-bb-teoria", title: "SB vs BB | Teoría", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "boards-ofensivos-parte-1", title: "Boards Ofensivos | Parte 1", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "boards-ofensivos-parte-2", title: "Boards Ofensivos | Parte 2", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "boards-ofensivos-parte-3", title: "Boards Ofensivos | Parte 3", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "boards-defensivos-parte-1", title: "Boards Defensivos | Parte 1", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "boards-defensivos-parte-2", title: "Boards Defensivos | Parte 2", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
  { slug: "boards-defensivos-parte-3", title: "Boards Defensivos | Parte 3", subcategory: "curso-teorico-practico", videoIdField: "bunny_video_id_2" },
];

// ─── Módulo 3 · Clases con BlueGhost y Piaggesi (salteable) ───────────────────
const M3: CursoItem[] = [
  { slug: "bet-missed-call-3bet-pots", title: "Bet Missed + Call 3Bet Pots", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-raise-flop", title: "Revisión (Raise Flop)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-bet-river", title: "Revisión (Bet River)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-rol-pots-calls-river-bet", title: "Revisión (Rol Pots + Calls River Bet)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "bet-turn", title: "Bet Turn", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "raise-cbet-flop-y-turn", title: "Raise Cbet Flop y Turn", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-posibles-bluff", title: "Revisión (Posibles Bluff)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-bet-river-bet-missed", title: "Revisión (Bet River + Bet Missed)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-pozos-grandes-2", title: "Revisión (Pozos Grandes 2)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-correccion-de-errores", title: "Revisión (Corrección de Errores)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-posibles-triple-barrel", title: "Revisión (Posibles Triple Barrel)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-parte-1", title: "Revisión Grupal Parte 1", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-parte-2", title: "Revisión Grupal Parte 2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-cbet-flop-y-turn", title: "Revisión (Cbet Flop y Turn)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-raise-cbet-flop-y-turn", title: "Revisión (Raise Cbet Flop y Turn)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-pozos-grandes-3", title: "Revisión (Pozos Grandes 3)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-check-flop-y-bet-turn-parte-1", title: "Revisión (Check Flop y Bet Turn) Parte 1", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-check-flop-y-bet-turn-parte-2", title: "Revisión Grupal: Check Flop y Bet Turn Parte 2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-y-correccion-de-errores", title: "Revisión y Corrección de Errores", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-correccion-de-leaks", title: "Revisión (Corrección de Leaks)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-raise-a-la-cbet", title: "Revisión (Raise a la Cbet)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-bluffs-river", title: "Revisión (Bluffs River)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-manos-dudosas-y-leaks", title: "Revisión (Manos Dudosas y Leaks)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-posibles-triple-barrel-2", title: "Revisión (Posibles Triple Barrel) 2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-posibles-triple-barrel-call-river-bet", title: "Revisión (Posibles Triple Barrel + Call River Bet)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-botes-grandes-checks-river", title: "Revisión (Botes Grandes + Checks River)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "clase-extendida-parte-1", title: "Clase Extendida Parte 1", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "clase-extendida-parte-2", title: "Clase Extendida Parte 2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "clase-extendida-parte-3", title: "Clase Extendida Parte 3", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "calls-to-river-bet-calls-to-cbet-en-3bet-pots", title: "Calls to River Bet + Calls to Cbet en 3Bet Pots", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "overcalls", title: "Overcalls", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-correccion-grupal-01", title: "Revisión (Corrección Grupal 01)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-correccion-grupal-02", title: "Revisión (Corrección Grupal 02)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-resolviendo-dudas-parte-1", title: "Revisión (Resolviendo Dudas) Parte 1", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-resolviendo-dudas-parte-2", title: "Revisión (Resolviendo Dudas) Parte 2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-bet-check-river", title: "Revisión (Bet Check River)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-checks-en-river", title: "Revisión (Checks en River)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-call-3bet-pots", title: "Revisión Grupal (Call 3Bet Pots)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-botes-grandes-check-turn", title: "Revisión (Botes Grandes + Check Turn)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-bluegh0st", title: "Revisión Grupal – Coach BlueGh0st", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-nl100-leaks-bet-missed-flop", title: "Revisión NL100 (Leaks + Bet Missed Flop)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-analisis-con-piosolver", title: "Revisión Grupal (Análisis con Piosolver)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-analisis-con-piosolver-2", title: "Revisión Grupal (Análisis con Piosolver 2)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-bluegh0st-2", title: "Revisión Grupal – Coach BlueGh0st #2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi", title: "Revisión Grupal – Coach Piaggesi", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-bluegh0st-3", title: "Revisión Grupal – Coach BlueGh0st #3", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-bluegh0st-4", title: "Revisión Grupal – Coach BlueGh0st #4", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-2", title: "Revisión Grupal – Coach Piaggesi #2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost", title: "Revisión Grupal – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-coach-blueghost", title: "Revisión – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-3", title: "Revisión Grupal – Coach Piaggesi #3", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-bluegh0st-5", title: "Revisión Grupal – Coach BlueGh0st #5", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-4", title: "Revisión Grupal – Coach Piaggesi #4", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-2", title: "Revisión Grupal – Coach BlueGhost #2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-5", title: "Revisión Grupal – Coach Piaggesi #5", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-3", title: "Revisión Grupal – Coach BlueGhost #3", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-privada-coach-blueghost", title: "Revisión Privada – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-privada-coach-blueghost-2", title: "Revisión Privada – Coach BlueGhost #2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-6", title: "Revisión Grupal – Coach Piaggesi #6", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-4", title: "Revisión Grupal – Coach BlueGhost #4", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-extendida-parte-1-coach-blueghost", title: "Revisión Extendida Parte 1 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-extendida-parte-2-coach-blueghost", title: "Revisión Extendida Parte 2 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-puliendo-leaks-parte-1-coach-blueghost", title: "Con el Establo: Puliendo Leaks Parte 1 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-puliendo-leaks-parte-2-coach-blueghost", title: "Con el Establo: Puliendo Leaks Parte 2 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-2-parte-1-coach-blueghost", title: "Con el Establo 2 – Parte 1 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-2-parte-2-coach-blueghost", title: "Con el Establo 2 – Parte 2 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-3-coach-blueghost", title: "Con el Establo 3 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-7", title: "Revisión Grupal – Coach Piaggesi #7", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-4-coach-blueghost", title: "Con el Establo 4 – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-5-bet-river-coach-blueghost", title: "Con el Establo 5: Bet River – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-6-rangos-y-control-de-emociones-coach-blueghost", title: "Con el Establo 6: Rangos y Control de Emociones – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-7-raise-vs-cbet-en-3bet-pots-live-session-coach-blueghost", title: "Con el Establo 7: Raise vs CBet en 3Bet Pots + Live Session – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-8", title: "Revisión Grupal – Coach Piaggesi #8", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-5", title: "Revisión Grupal – Coach BlueGhost #5", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-con-el-establo-8-bet-missed-flop-revi-de-database", title: "Con el Establo 8: Bet Missed Flop + Revi de Database", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-9", title: "Revisión Grupal – Coach Piaggesi #9", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-privada-botes-grandes-coach-blueghost", title: "Revisión Privada: Botes Grandes – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-privada-estrategia-de-cbet-flop-coach-blueghost", title: "Revisión Privada: Estrategia de CBet Flop – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-10", title: "Revisión Grupal – Coach Piaggesi #10", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-privada-bet-missed-or-y-3bet-pots-coach-blueghost", title: "Revisión Privada: Bet Missed OR y 3Bet Pots – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-probe-turn-coach-blueghost", title: "Revisión Grupal Probe Turn – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-6", title: "Revisión Grupal – Coach BlueGhost #6", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-11", title: "Revisión Grupal – Coach Piaggesi #11", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-privada-botes-grandes-bet-turn-raise-vs-cbet-coach-blueghost", title: "Revisión Privada: Botes Grandes + Bet Turn + Raise vs CBet – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-live-session-coach-piaggesi", title: "Revisión Grupal + Live Session – Coach Piaggesi", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-12", title: "Revisión Grupal – Coach Piaggesi #12", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-13", title: "Revisión Grupal – Coach Piaggesi #13", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-7", title: "Revisión Grupal – Coach BlueGhost #7", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-14", title: "Revisión Grupal – Coach Piaggesi #14", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-8", title: "Revisión Grupal – Coach BlueGhost #8", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revesion-grupal-coach-piaggesi", title: "Revisión Grupal – Coach Piaggesi (especial)", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-9", title: "Revisión Grupal – Coach BlueGhost #9", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-10", title: "Revisión Grupal – Coach BlueGhost #10", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-15", title: "Revisión Grupal – Coach Piaggesi #15", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-11", title: "Revisión Grupal – Coach BlueGhost #11", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-12", title: "Revisión Grupal – Coach BlueGhost #12", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-13", title: "Revisión Grupal – Coach BlueGhost #13", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-14", title: "Revisión Grupal – Coach BlueGhost #14", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-16", title: "Revisión Grupal – Coach Piaggesi #16", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-17", title: "Revisión Grupal – Coach Piaggesi #17", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-call-3bet-pots", title: "Revisión Grupal: Call 3Bet Pots – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-18", title: "Revisión Grupal – Coach Piaggesi #18", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-15", title: "Revisión Grupal – Coach BlueGhost #15", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-19", title: "Revisión Grupal – Coach Piaggesi #19", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-16", title: "Revisión Grupal – Coach BlueGhost #16", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-17", title: "Revisión Grupal – Coach BlueGhost #17", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-20", title: "Revisión Grupal – Coach Piaggesi #20", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-18", title: "Revisión Grupal – Coach BlueGhost #18", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-21", title: "Revisión Grupal – Coach Piaggesi #21", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-22", title: "Revisión Grupal – Coach Piaggesi #22", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-19", title: "Revisión Grupal – Coach BlueGhost #19", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-live-session-coach-piaggesi", title: "Revisión + Live Session – Coach Piaggesi", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-20", title: "Revisión Grupal – Coach BlueGhost #20", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-live-session-coach-piaggesi-2", title: "Revisión Grupal + Live Session – Coach Piaggesi #2", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-21", title: "Revisión Grupal – Coach BlueGhost #21", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-23", title: "Revisión Grupal – Coach Piaggesi #23", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-22", title: "Revisión Grupal – Coach BlueGhost #22", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-24", title: "Revisión Grupal – Coach Piaggesi #24", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-defensa-de-bb-coach-blueghost", title: "Revisión Grupal: Defensa de BB – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-25", title: "Revisión Grupal – Coach Piaggesi #25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-26", title: "Revisión Grupal – Coach Piaggesi #26", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-23", title: "Revisión Grupal – Coach BlueGhost #23", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-live-session-coach-piaggesi-3", title: "Revisión Grupal / Live Session – Coach Piaggesi #3", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-24", title: "Revisión Grupal – Coach BlueGhost #24", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-27", title: "Revisión Grupal – Coach Piaggesi #27", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-25", title: "Revisión Grupal – Coach BlueGhost #25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-26", title: "Revisión Grupal – Coach BlueGhost #26", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-live-session-coach-piaggesi-4", title: "Revisión Grupal + Live Session – Coach Piaggesi #4", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-y-live-session-coach-blueghost", title: "Revisión Grupal y Live Session – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-y-live-session-pt1-coach-piaggesi", title: "Revisión y Live Session PT1 – Coach Piaggesi", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-y-live-session-pt2-coach-piaggesi", title: "Revisión y Live Session PT2 – Coach Piaggesi", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-y-live-session-coach-blueghost", title: "Revisión y Live Session – Coach BlueGhost", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-27", title: "Revisión Grupal – Coach BlueGhost 10/02/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-28", title: "Revisión Grupal – Coach BlueGhost 13/02/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-29", title: "Revisión Grupal – Coach BlueGhost 19/02/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-28", title: "Revisión Grupal – Coach Piaggesi 24/02/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-30", title: "Revisión Grupal – Coach BlueGhost 15/03/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-y-live-session-coach-piaggesi", title: "Revisión Grupal y Live Session – Coach Piaggesi 18/03/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-29", title: "Revisión Grupal – Coach Piaggesi 25/03/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-31", title: "Revisión Grupal – Coach BlueGhost 01/04/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-live-session-coach-piaggesi-5", title: "Revisión Grupal + Live Session – Coach Piaggesi 14/04/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-def-de-bb-pt1-coach-blueghost", title: "Revisión Grupal – Def. de BB Parte 1 – Coach BlueGhost 16/04/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-def-de-bb-pt2-coach-blueghost", title: "Revisión Grupal – Def. de BB Parte 2 – Coach BlueGhost 16/04/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-30", title: "Revisión Grupal – Coach Piaggesi 22/04/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-32", title: "Revisión Grupal – Coach BlueGhost 28/04/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-31", title: "Revisión Grupal – Coach Piaggesi 12/05/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-33", title: "Revisión Grupal – Coach BlueGhost 13/05/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-32", title: "Revisión Grupal – Coach Piaggesi 30/05/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupalcalls-to-river-betcoach-blueghost", title: "Revisión Grupal – Coach BlueGhost 28/05/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-33", title: "Revisión Grupal – Coach Piaggesi 06/06/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-34", title: "Revisión Grupal – Coach BlueGhost 17/07/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-35", title: "Revisión Grupal – Coach BlueGhost 20/07/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-35", title: "Revisión Grupal – Coach Piaggesi 05/08/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-37", title: "Revisión Grupal – Coach BlueGhost 20/08/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-36", title: "Revisión Grupal – Coach Piaggesi 24/08/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-38", title: "Revisión Grupal – Coach BlueGhost 24/08/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-piaggesi-37", title: "Revisión Grupal – Coach Piaggesi 09/09/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-39", title: "Revisión Grupal – Coach BlueGhost 12/09/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-40", title: "Revisión Grupal – Coach BlueGhost 18/09/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-03-10-2025", title: "Revisión Grupal – Coach BlueGhost 03/10/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-24-10-2025", title: "Revisión Grupal – Coach BlueGhost 24/10/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-revision-grupal-coach-blueghost-21-11-2025revision-grupal", title: "Revisión Grupal – Coach BlueGhost 21/11/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-12-12-2025", title: "Revisión Grupal – Coach BlueGhost 12/12/25", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-16-01-26", title: "Revisión Grupal – Coach BlueGhost 16/01/26", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-06-02-26", title: "Revisión Grupal – Coach BlueGhost 06/02/26", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-blueghost-19-03-26", title: "Revisión Grupal – Coach BlueGhost 19/03/26", subcategory: "clases-grupales", videoIdField: "bunny_video_id_2" },
];

// ─── Módulo 4 · Clases con StraussJ ───────────────────────────────────────────
const M4: CursoItem[] = [
  { slug: "revision-grupal-straussj-ft-bluegh0st", title: "Revisión Grupal – StraussJ ft. BlueGh0st", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-straussj-ft-piaggesi", title: "Revisión Grupal – StraussJ ft. Piaggesi", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj", title: "Revisión Grupal – Coach StraussJ", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-pt1-coach-straussj", title: "Revisión Grupal PT1 – Coach StraussJ", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-pt2-coach-straussj", title: "Revisión Grupal PT2 – Coach StraussJ", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-bluegh0st", title: "Revisión Grupal – Coach StraussJ ft. BlueGh0st", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-straussj-ft-bluegh0st-2", title: "Revisión Grupal – StraussJ ft. BlueGh0st #2", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-blueghost", title: "Revisión Grupal – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-piaggesi", title: "Revisión Grupal – Coach StraussJ ft. Piaggesi", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-pulpo-poker", title: "Revisión Grupal – Coach StraussJ ft. Pulpo Poker", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-blueghost-2", title: "Revisión Grupal – Coach StraussJ ft. BlueGhost #2", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-blueghost-3", title: "Revisión Grupal – Coach StraussJ ft. BlueGhost #3", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-pt1-coach-straussj-ft-blueghost", title: "Revisión Grupal PT1 – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-pt2-coach-straussj-ft-blueghost", title: "Revisión Grupal PT2 – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-probe-turn-straussj-ft-blueghost", title: "Revisión Grupal Probe Turn – StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-bet-missed-flop-coach-straussj-ft-blueghost", title: "Revisión Grupal: Bet Missed Flop – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-blueghost-3bet-pots-oop", title: "Revisión Grupal: 3Bet Pots OOP – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-blueghost-pt1-4bet-pots", title: "Revisión Grupal PT1: 4Bet Pots – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
  { slug: "revision-grupal-coach-straussj-ft-blueghost-pt2-4bet-pots", title: "Revisión Grupal PT2: 4Bet Pots – Coach StraussJ ft. BlueGhost", subcategory: "clases-grupales-straussj", videoIdField: "bunny_video_id_2" },
];

// ─── Módulo 5 · Mental Coach (complementario) ─────────────────────────────────
const M5: CursoItem[] = [
  { slug: "nuevo-comienzo", title: "Nuevo Comienzo", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "autoconocimiento", title: "Autoconocimiento", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "3-mentes", title: "3 Mentes", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "3-cerebros-parte-1", title: "3 Cerebros – Parte 1", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "3-cerebros-parte-2", title: "3 Cerebros – Parte 2", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "quien-esta-al-mando", title: "¿Quién está al mando?", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "emociones", title: "Emociones", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "estructura-de-coherencia", title: "Estructura de Coherencia", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "entrenando-la-confianza", title: "Entrenando la Confianza", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "por-que-planificar", title: "¿Por qué planificar?", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "constructo-mental", title: "Constructo Mental", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "entrenando-la-paciencia", title: "Entrenando la Paciencia", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "warmup-cooldown", title: "Warm Up Cool Down", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "marco-de-referencia", title: "Marco de Referencia", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "la-importancia-de-medir-finish-line", title: "La Importancia de Medir + Finish Line", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
  { slug: "mindet-coaching-excel", title: "Mindset Coaching (Excel)", subcategory: "mental-coach", videoIdField: "bunny_video_id_2" },
];

// ─── Módulo 6 · Sesión Live (complementario) ──────────────────────────────────
const M6: CursoItem[] = [
  { slug: "revision-live-session-final", title: "Revisión + Live Session", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "revision-call-3bet-live-session-parte-1", title: "Revisión: Call 3Bet + Live Session (Parte 1)", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "revision-call-3bet-live-session-nl500-parte-2", title: "Revisión: Call 3Bet + Live Session NL500 (Parte 2)", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-nl200-2", title: "Live Session NL200", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-ipoker-parte-1-full-exploit-con-stats", title: "Live Session iPoker – Parte 1 (Full exploit con stats)", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-ipoker-parte-2-full-exploit-con-stats", title: "Live Session iPoker – Parte 2 (Full exploit con stats)", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-nl200", title: "Live Session NL200", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-nl500", title: "Live Session NL500", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-nl100-red-star", title: "Live Session NL100 Red Star", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-nl100-ipoker", title: "Live Session NL100 iPoker", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-nl500-2", title: "Live Session NL500 #2", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
  { slug: "live-session-grupal-wpt-bodog-mtt-pokerstars-coach-piaggesi", title: "Live Session Grupal – WPT / Bodog / MTT PokerStars – Coach Piaggesi", subcategory: "sesion-live", videoIdField: "bunny_video_id_2" },
];

// ─── Secciones del curriculum ──────────────────────────────────────────────────
export const CURSO_SECTIONS: CursoSection[] = [
  {
    id: "principiantes",
    label: "Módulo 1 · Curso Principiantes",
    color: "emerald",
    items: M1,
  },
  {
    id: "teorico-practico",
    label: "Módulo 2 · Curso Teórico Práctico",
    color: "sky",
    items: M2,
  },
  {
    id: "clases-grupales",
    label: "Módulo 3 · Clases con BlueGhost y Piaggesi",
    color: "amber",
    alwaysUnlocked: true,
    items: M3,
  },
  {
    id: "straussj",
    label: "Módulo 4 · Clases con StraussJ",
    color: "orange",
    items: M4,
  },
  {
    id: "mental",
    label: "Módulo 5 · Mental Coach",
    color: "violet",
    alwaysUnlocked: true,
    items: M5,
  },
  {
    id: "sesion-live",
    label: "Módulo 6 · Sesión Live",
    color: "rose",
    alwaysUnlocked: true,
    items: M6,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Todos los items del curriculum en orden lineal. */
export function getAllCursoItems(): CursoItem[] {
  return CURSO_SECTIONS.flatMap((s) => s.items);
}

/** Sección a la que pertenece un item dado su slug. */
export function getSectionForSlug(slug: string): CursoSection | undefined {
  return CURSO_SECTIONS.find((s) => s.items.some((i) => i.slug === slug));
}

/**
 * Determina si un item es accesible según el progreso actual.
 *
 * Reglas:
 * 1. Siempre desbloqueado si el módulo tiene `alwaysUnlocked: true`.
 * 2. El primer item siempre está desbloqueado.
 * 3. Si el item anterior pertenece a un módulo `alwaysUnlocked`, este item
 *    también está siempre desbloqueado (no puede quedar bloqueado por un
 *    módulo salteable/complementario).
 * 4. Caso general: el item anterior debe estar marcado como completado.
 */
export function isItemUnlocked(
  idx: number,
  allItems: CursoItem[],
  progreso: Progreso
): boolean {
  const section = getSectionForSlug(allItems[idx].slug);
  if (section?.alwaysUnlocked) return true;
  if (idx === 0) return true;
  const prevSection = getSectionForSlug(allItems[idx - 1].slug);
  if (prevSection?.alwaysUnlocked) return true;
  return progreso[allItems[idx - 1].slug] === true;
}

/** Slugs del item anterior y siguiente para navegación. */
export function getAdjacentSlugs(slug: string): {
  prev: string | null;
  next: string | null;
} {
  const all = getAllCursoItems();
  const idx = all.findIndex((item) => item.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1].slug : null,
    next: idx < all.length - 1 ? all[idx + 1].slug : null,
  };
}

/** Porcentaje de progreso global (0-100). */
export function calcProgress(progreso: Progreso): number {
  const all = getAllCursoItems();
  if (all.length === 0) return 0;
  const done = all.filter((item) => progreso[item.slug]).length;
  return Math.round((done / all.length) * 100);
}

/**
 * Calcula los puntos ATR ganados a partir del progreso.
 * - 5 pts por cada clase completada
 * - 50 pts de bonus por módulo completado (todas las clases del módulo)
 */
export function calcPoints(progreso: Progreso): {
  videoPoints: number;
  moduleBonus: number;
  total: number;
} {
  const all = getAllCursoItems();
  const videoPoints =
    all.filter((item) => progreso[item.slug]).length * POINTS_PER_CLASS;
  const moduleBonus = CURSO_SECTIONS.reduce((acc, section) => {
    if (section.items.length === 0) return acc;
    const allDone = section.items.every((item) => progreso[item.slug]);
    return acc + (allDone ? POINTS_PER_MODULE : 0);
  }, 0);
  return { videoPoints, moduleBonus, total: videoPoints + moduleBonus };
}
