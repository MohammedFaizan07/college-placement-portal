import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { getMyApplications } from "@/api/application.api";
import { toFriendlyMessage } from "@/api/axios";
import { StudentRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Card, EmptyState, ErrorState } from "@/components/ui-kit";
import { SkeletonRows } from "@/components/Loaders";
import { formatDate } from "@/lib/format";

function jobOf(application) {
  return application.job && typeof application.job === "object" ? application.job : null;
}

function companyOf(job) {
  return job?.company && typeof job.company === "object" ? job.company : null;
}

function Applications() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
    retry: false,
  });

  const applications = data ?? [];

  return (
    <PageShell
      title="My Applications"
      description="Every drive you have applied to, with the latest decision from the recruiter."
    >
      {isLoading ? (
        <SkeletonRows count={4} />
      ) : isError ? (
        <ErrorState
          message={toFriendlyMessage(error, "Unable to load your applications. Please try again.")}
          onRetry={() => refetch()}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No applications yet"
          description="Once you apply to an opening, you can follow its progress here."
          action={
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/70 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Job</th>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Applied on</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((application) => {
                  const job = jobOf(application);
                  return (
                    <tr key={application._id}>
                      <td className="px-5 py-4 font-medium text-foreground">{job?.title ?? "Job"}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {companyOf(job)?.companyName ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDate(application.appliedAt || application.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {job?._id ? (
                          <Link
                            to={`/jobs/${job._id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View job
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-4 md:hidden">
            {applications.map((application) => {
              const job = jobOf(application);
              return (
                <Card key={application._id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{job?.title ?? "Job"}</p>
                      <p className="text-sm text-primary">{companyOf(job)?.companyName ?? "—"}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Applied {formatDate(application.appliedAt || application.createdAt)}
                  </p>
                  {job?._id ? (
                    <Link to={`/jobs/${job._id}`}>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        View job
                      </Button>
                    </Link>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </PageShell>
  );
}

export default function StudentApplications() {
  return (
    <StudentRoute>
      <Applications />
    </StudentRoute>
  );
}
