import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Award, Briefcase, FileText, ListChecks, Star, UploadCloud, UserRound } from "lucide-react";
import { listJobs } from "@/api/job.api";
import { getMyApplications } from "@/api/application.api";
import { getStudentProfile } from "@/api/student.api";
import { toFriendlyMessage } from "@/api/axios";
import { StudentRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Card, EmptyState } from "@/components/ui-kit";
import { Skeleton, SkeletonRows } from "@/components/Loaders";
import { formatDate } from "@/lib/format";

function jobOf(application) {
  return application.job && typeof application.job === "object" ? application.job : null;
}

function Dashboard() {
  const profile = useQuery({ queryKey: ["student-profile"], queryFn: getStudentProfile });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const applications = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
    retry: false,
  });

  const apps = applications.data ?? [];
  const countBy = (status) => apps.filter((a) => (a.status || "").toUpperCase() === status).length;

  const cards = [
    { label: "Available Jobs", value: jobs.data?.length, loading: jobs.isLoading, icon: Briefcase },
    { label: "Applications", value: apps.length, loading: applications.isLoading, icon: FileText },
    { label: "Shortlisted", value: countBy("SHORTLISTED"), loading: applications.isLoading, icon: Star },
    { label: "Selected", value: countBy("SELECTED"), loading: applications.isLoading, icon: Award },
  ];

  return (
    <PageShell
      title={`Welcome${profile.data?.fullName ? `, ${profile.data.fullName.split(" ")[0]}` : ""}`}
      description="Your placement activity at a glance."
      actions={
        <Link to="/jobs">
          <Button size="sm">
            <Briefcase className="h-4 w-4" /> Browse Jobs
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent text-primary">
              <card.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              {card.loading ? (
                <Skeleton className="mt-1.5 h-7 w-12" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{card.value ?? 0}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent applications</h2>
            <Link to="/student/applications" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-5">
            {applications.isLoading ? (
              <SkeletonRows count={3} />
            ) : applications.isError ? (
              <p className="rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
                {toFriendlyMessage(applications.error, "Unable to load your applications right now.")}
              </p>
            ) : apps.length === 0 ? (
              <EmptyState
                icon={<ListChecks className="h-5 w-5" />}
                title="No applications yet"
                description="Apply to an open drive and your progress will show up here."
                action={
                  <Link to="/jobs">
                    <Button size="sm">Browse Jobs</Button>
                  </Link>
                }
              />
            ) : (
              <ul className="divide-y divide-border">
                {apps.slice(0, 5).map((application) => {
                  const job = jobOf(application);
                  return (
                    <li key={application._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{job?.title ?? "Job"}</p>
                        <p className="text-xs text-muted-foreground">
                          Applied {formatDate(application.appliedAt || application.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={application.status} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-foreground">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/jobs">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4" /> Browse Jobs
              </Button>
            </Link>
            <Link to="/student/applications">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4" /> My Applications
              </Button>
            </Link>
            <Link to="/student/profile">
              <Button variant="outline" className="w-full justify-start">
                <UserRound className="h-4 w-4" /> Profile
              </Button>
            </Link>
            <Link to="/student/profile">
              <Button variant="outline" className="w-full justify-start">
                <UploadCloud className="h-4 w-4" /> Upload Resume
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default function StudentDashboard() {
  return (
    <StudentRoute>
      <Dashboard />
    </StudentRoute>
  );
}
