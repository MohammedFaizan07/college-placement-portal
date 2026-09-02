import { useEffect, useState } from "react";
import { Bell, Briefcase, Send, Clock } from "lucide-react";
import { Card } from "@/components/ui-kit";
import {
  onJobCreated,
  onJobUpdated,
  onJobDeleted,
  onApplicationCreated,
  onApplicationStatusUpdated
} from "@/socket/socket";

export default function LiveUpdatesSection() {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Subscribe to job events
    const unsubJobCreated = onJobCreated((data) => {
      addUpdate({
        id: `job:created:${data.jobId}`,
        type: "job",
        icon: Briefcase,
        title: `New Job Posted`,
        message: `${data.company} posted a new ${data.title} position`,
        timestamp: new Date(data.createdAt)
      });
    });

    const unsubJobUpdated = onJobUpdated((data) => {
      addUpdate({
        id: `job:updated:${data.jobId}`,
        type: "job",
        icon: Briefcase,
        title: `Job Updated`,
        message: `${data.company} updated the ${data.title} position`,
        timestamp: new Date(data.updatedAt)
      });
    });

    const unsubJobDeleted = onJobDeleted((data) => {
      addUpdate({
        id: `job:deleted:${data.jobId}`,
        type: "job",
        icon: Briefcase,
        title: `Job Closed`,
        message: `${data.company} closed the ${data.title} position`,
        timestamp: new Date(data.deletedAt)
      });
    });

    // Subscribe to application events
    const unsubAppCreated = onApplicationCreated((data) => {
      addUpdate({
        id: `app:created:${data.applicationId}`,
        type: "application",
        icon: Send,
        title: `New Application`,
        message: `${data.studentName} applied for ${data.jobTitle}`,
        timestamp: new Date(data.appliedAt)
      });
    });

    const unsubAppStatusUpdated = onApplicationStatusUpdated((data) => {
      addUpdate({
        id: `app:status:${data.applicationId}`,
        type: "application",
        icon: Send,
        title: `Application Status`,
        message: `Your application for ${data.jobTitle} is now ${data.status}`,
        timestamp: new Date(data.updatedAt)
      });
    });

    // Cleanup listeners on unmount
    return () => {
      unsubJobCreated();
      unsubJobUpdated();
      unsubJobDeleted();
      unsubAppCreated();
      unsubAppStatusUpdated();
    };
  }, []);

  const addUpdate = (update) => {
    setUpdates((prev) => {
      // Avoid duplicate updates
      if (prev.some((u) => u.id === update.id)) {
        return prev;
      }
      // Keep only the latest 10 updates
      const newUpdates = [update, ...prev].slice(0, 10);
      return newUpdates;
    });
  };

  // Format time difference (e.g., "2 minutes ago")
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (updates.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Live updates will appear here. Stay tuned for new jobs and application status updates!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <div className="relative inline-flex">
          <Bell className="h-5 w-5 text-primary" />
          <span className="absolute -right-1 -top-1 flex h-3 w-3 animate-pulse">
            <span className="inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground">Live Placement Updates</h2>
      </div>

      <div className="space-y-3">
        {updates.map((update) => (
          <Card key={update.id} className="flex gap-4 p-4 transition-all hover:shadow-md">
            <div className="flex shrink-0 items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                <update.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{update.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{update.message}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(update.timestamp)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
