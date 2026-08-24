import { cn } from "@/lib/utils";
import { Spinner } from "@/components/Loaders";

// --- Button ---

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
  secondary: "bg-accent text-accent-foreground hover:bg-accent/70",
  outline: "border border-border bg-card text-foreground hover:bg-secondary",
  ghost: "text-foreground hover:bg-secondary",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

// --- Card ---

export function Card({ className, children }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6 shadow-card", className)}>
      {children}
    </div>
  );
}

// --- Field (label wrapper with error/hint) ---

export function Field({ label, error, hint, children, required }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </span>
      {children}
      {hint && !error ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      {error ? <span className="block text-xs font-medium text-destructive">{error}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:opacity-60";

export function Input({ className, ...props }) {
  return <input className={cn(controlClass, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={cn(controlClass, "min-h-28", className)} {...props} />;
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(controlClass, "h-10", className)} {...props}>
      {children}
    </select>
  );
}

// --- EmptyState ---

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center">
      {icon ? <div className="mb-4 rounded-full bg-accent p-3 text-primary">{icon}</div> : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

// --- ErrorState ---

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

// --- SectionHeading ---

export function SectionHeading({ eyebrow, title, description, align = "center" }) {
  return (
    <div className={cn("max-w-2xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
