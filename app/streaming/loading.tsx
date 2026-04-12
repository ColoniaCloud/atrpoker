import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function StreamCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Thumbnail */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <CardContent className="p-4 space-y-2">
        {/* Título */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        {/* Fecha */}
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );
}

export default function StreamingLoading() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-36" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StreamCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
