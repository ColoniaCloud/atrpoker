import { Skeleton } from "@/components/ui/skeleton";

function SalaCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col">
      {/* Logo header */}
      <div className="flex items-center justify-center h-32 px-6 bg-zinc-900/60 border-b border-border">
        <Skeleton className="h-16 w-36" />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Badges */}
        <div className="flex gap-1.5">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        {/* Rakeback */}
        <Skeleton className="h-7 w-24" />
        {/* Bonificación */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
        {/* Depósito */}
        <Skeleton className="h-3 w-32" />
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function SalasLoading() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-52" />
      </div>

      {/* Disclaimer */}
      <Skeleton className="h-12 w-full rounded-lg mb-8" />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SalaCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
