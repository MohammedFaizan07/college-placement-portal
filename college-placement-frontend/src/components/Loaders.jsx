import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }) {
  return <Loader2 className={cn("h-4 w-4 animate-spin", className)} aria-hidden="true" />;
}

export function PageLoader({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="h-6 w-6 text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function SkeletonCards({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/2" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-6 h-9 w-28" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-xl" />
      ))}
    </div>
  );
}
