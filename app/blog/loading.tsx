import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function BlogCardSkeleton() {
  return (
    <Card className="flex flex-col h-full overflow-hidden bg-card border-border">
      {/* Imagen */}
      <Skeleton className="aspect-video w-full rounded-none" />

      <CardContent className="p-5 flex flex-col flex-1 gap-3">
        {/* Categoría + fecha */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>

        {/* Título */}
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Leer más */}
        <Skeleton className="h-4 w-20 mt-1" />
      </CardContent>
    </Card>
  );
}

export default function BlogLoading() {
  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-border pb-0">
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
