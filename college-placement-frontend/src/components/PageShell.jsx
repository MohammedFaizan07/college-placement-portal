import { cn } from "@/lib/utils";

export function PageShell({ title, description, actions, children, className }) {
  return (
    <main className={cn("mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-8">{children}</div>
    </main>
  );
}
