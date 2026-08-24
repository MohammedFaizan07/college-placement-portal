import { cn } from "@/lib/utils";

const statusStyles = {
  APPLIED: "bg-info/10 text-info border-info/30",
  SHORTLISTED: "bg-warning/15 text-warning-foreground border-warning/40",
  SELECTED: "bg-success/12 text-success border-success/35",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/30",
  OPEN: "bg-success/12 text-success border-success/35",
  CLOSED: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }) {
  const key = (status || "").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        statusStyles[key] ?? "bg-secondary text-secondary-foreground border-border",
        className
      )}
    >
      {key || "UNKNOWN"}
    </span>
  );
}
