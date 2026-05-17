import "server-only";

type VisitEvent = {
  id: string;
  at: string;
  path: string;
  referrer?: string;
  userName?: string;
  userEmail?: string;
  roles?: string[];
};

type ErrorEvent = {
  id: string;
  at: string;
  source: "server" | "browser";
  message: string;
  stack?: string;
  path?: string;
  userAgent?: string;
  userName?: string;
  userEmail?: string;
  roles?: string[];
  extra?: string;
};

type TelemetryStore = {
  visits: VisitEvent[];
  errors: ErrorEvent[];
};

const MAX_VISITS = 3000;
const MAX_ERRORS = 3000;

declare global {
  // eslint-disable-next-line no-var
  var __atrAdminTelemetry: TelemetryStore | undefined;
}

function getStore(): TelemetryStore {
  if (!globalThis.__atrAdminTelemetry) {
    globalThis.__atrAdminTelemetry = { visits: [], errors: [] };
  }
  return globalThis.__atrAdminTelemetry;
}

function trimArray<T>(arr: T[], max: number) {
  if (arr.length > max) {
    arr.splice(0, arr.length - max);
  }
}

function sanitizePath(pathname?: string): string {
  if (!pathname || typeof pathname !== "string") return "/";
  if (!pathname.startsWith("/")) return "/";
  return pathname.slice(0, 200);
}

function shortText(value: unknown, max = 1200): string | undefined {
  if (typeof value !== "string") return undefined;
  return value.trim().slice(0, max) || undefined;
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function recordVisit(input: {
  path?: string;
  referrer?: string;
  userName?: string;
  userEmail?: string;
  roles?: string[];
}) {
  const store = getStore();
  store.visits.push({
    id: makeId("v"),
    at: nowIso(),
    path: sanitizePath(input.path),
    referrer: shortText(input.referrer, 300),
    userName: shortText(input.userName, 120),
    userEmail: shortText(input.userEmail, 160),
    roles: Array.isArray(input.roles) ? input.roles.slice(0, 10) : undefined,
  });
  trimArray(store.visits, MAX_VISITS);
}

export function recordServerError(input: {
  message: string;
  stack?: string;
  path?: string;
  userAgent?: string;
  userName?: string;
  userEmail?: string;
  roles?: string[];
  extra?: string;
}) {
  const store = getStore();
  store.errors.push({
    id: makeId("e"),
    at: nowIso(),
    source: "server",
    message: shortText(input.message, 800) ?? "Error de servidor",
    stack: shortText(input.stack, 4000),
    path: sanitizePath(input.path),
    userAgent: shortText(input.userAgent, 500),
    userName: shortText(input.userName, 120),
    userEmail: shortText(input.userEmail, 160),
    roles: Array.isArray(input.roles) ? input.roles.slice(0, 10) : undefined,
    extra: shortText(input.extra, 1500),
  });
  trimArray(store.errors, MAX_ERRORS);
}

export function recordBrowserError(input: {
  message: string;
  stack?: string;
  path?: string;
  userAgent?: string;
  userName?: string;
  userEmail?: string;
  roles?: string[];
  extra?: string;
}) {
  const store = getStore();
  store.errors.push({
    id: makeId("e"),
    at: nowIso(),
    source: "browser",
    message: shortText(input.message, 800) ?? "Error de navegador",
    stack: shortText(input.stack, 4000),
    path: sanitizePath(input.path),
    userAgent: shortText(input.userAgent, 500),
    userName: shortText(input.userName, 120),
    userEmail: shortText(input.userEmail, 160),
    roles: Array.isArray(input.roles) ? input.roles.slice(0, 10) : undefined,
    extra: shortText(input.extra, 1500),
  });
  trimArray(store.errors, MAX_ERRORS);
}

export function getTelemetrySummary() {
  const store = getStore();
  const visits = [...store.visits].reverse();
  const errors = [...store.errors].reverse();

  const visitsByPath = store.visits.reduce<Record<string, number>>((acc, visit) => {
    acc[visit.path] = (acc[visit.path] ?? 0) + 1;
    return acc;
  }, {});

  const topPaths = Object.entries(visitsByPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([path, count]) => ({ path, count }));

  const serverErrors = store.errors.filter((e) => e.source === "server").length;
  const browserErrors = store.errors.filter((e) => e.source === "browser").length;

  return {
    generatedAt: nowIso(),
    totals: {
      visits: store.visits.length,
      uniquePaths: Object.keys(visitsByPath).length,
      errors: store.errors.length,
      serverErrors,
      browserErrors,
    },
    topPaths,
    recentVisits: visits.slice(0, 100),
    recentErrors: errors.slice(0, 100),
  };
}
