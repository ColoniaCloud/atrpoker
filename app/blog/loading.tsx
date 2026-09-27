import { Skeleton } from "@/components/ui/skeleton";

// Mismo patrón que BlogBentoGrid: hero (2x2) + 4 small (1x1) + wide (2x1)
const PATTERN = [
  "row-span-2 sm:col-span-2 sm:row-span-2",
  "",
  "",
  "",
  "",
  "sm:col-span-2",
];

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

      {/* Bento grid */}
      <div className="grid grid-flow-row-dense grid-cols-1 gap-4 auto-rows-[200px] sm:grid-cols-2 sm:auto-rows-[190px] lg:grid-cols-4 lg:auto-rows-[215px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`rounded-xl ${PATTERN[i % PATTERN.length]}`}
          />
        ))}
      </div>
    </div>
  );
}
