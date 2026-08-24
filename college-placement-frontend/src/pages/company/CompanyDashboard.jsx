import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CheckCircle2, FolderKanban, PlusCircle, UserRound, Users } from "lucide-react";
import { listJobs } from "@/api/job.api";
import { getCompanyProfile } from "@/api/company.api";
import { CompanyRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { Button, Card } from "@/components/ui-kit";
import { Skeleton } from "@/components/Loaders";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";

// Helper used here and in CompanyJobs
export function ownJobs(jobs, companyId) {
  if (!jobs || !companyId) return [];
  return jobs.filter((job) =>
    typeof job.company === "object" ? job.company?._id === companyId : job.company === companyId
  );
}

function Dashboard() {
  const profile = useQuery({ queryKey: ["company-profile"], queryFn: getCompanyProfile });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: listJobs });

  const mine = ownJobs(jobs.data, profile.data?._id);
  const open = mine.filter((job) => (job.status || "OPEN").toUpperCase() === "OPEN");
  const loading = profile.isLoading || jobs.isLoading;

  const cards = [
    { label: "Total Jobs", value: mine.length, icon: Briefcase },
    { label: "Open Jobs", value: open.length, icon: CheckCircle2 },
    { label: "Closed Jobs", value: mine.length - open.length, icon: FolderKanban },
  ];

  return (
    <PageShell
      title={
        profile.data?.companyName
          ? `${profile.data.companyName} — Recruiter Console`
          : "Recruiter Console"
      }
      description="Post roles, review applicants and progress candidates through your hiring stages."
      actions={
        <Link to="/company/jobs/create">
          <Button size="sm">
            <PlusCircle className="h-4 w-4" /> Create Job
          </Button>
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent text-primary">
              <card.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              {loading ? (
                <Skeleton className="mt-1.5 h-7 w-12" />
              ) : (
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Your recent postings</h2>
            <Link to="/company/jobs" className="text-sm font-medium text-primary hover:underline">
              Manage jobs
            </Link>
          </div>
          <div className="mt-5">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : mine.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have not posted any roles yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {mine.slice(0, 5).map((job) => (
                  <li
                    key={job._id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline {formatDate(job.deadline)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={job.status} />
                      <Link
                        to={`/company/jobs/${job._id}/applicants`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Applicants
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-foreground">Quick actions</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/company/jobs/create">
              <Button variant="outline" className="w-full justify-start">
                <PlusCircle className="h-4 w-4" /> Create Job
              </Button>
            </Link>
            <Link to="/company/jobs">
              <Button variant="outline" className="w-full justify-start">
                <Briefcase className="h-4 w-4" /> Manage Jobs
              </Button>
            </Link>
            <Link to="/company/jobs">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4" /> View Applicants
              </Button>
            </Link>
            <Link to="/company/profile">
              <Button variant="outline" className="w-full justify-start">
                <UserRound className="h-4 w-4" /> Company Profile
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

export default function CompanyDashboard() {
  return (
    <CompanyRoute>
      <Dashboard />
    </CompanyRoute>
  );
}
