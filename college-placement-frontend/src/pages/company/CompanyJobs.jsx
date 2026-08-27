import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteJob, listJobs } from "@/api/job.api";
import { getCompanyProfile } from "@/api/company.api";
import { toFriendlyMessage } from "@/api/axios";
import { CompanyRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Card, EmptyState, ErrorState } from "@/components/ui-kit";
import { SkeletonRows } from "@/components/Loaders";
import { formatDate, formatSalary } from "@/lib/format";
import { ownJobs } from "./CompanyDashboard";

function Jobs() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["company-profile"], queryFn: getCompanyProfile });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: listJobs });
  const [pendingDelete, setPendingDelete] = useState(null);

  const mine = ownJobs(jobs.data, profile.data?._id);
  const loading = profile.isLoading || jobs.isLoading;

  const removal = useMutation({
    mutationFn: (jobId) => deleteJob(jobId),
    onSuccess: () => {
      toast.success("Job posting deleted.");
      setPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => toast.error(toFriendlyMessage(err, "Unable to delete this job posting.")),
  });

  return (
    <PageShell
      title="Your Job Postings"
      description="Only roles published by your company are shown here."
      actions={
        <Link to="/company/jobs/create">
          <Button size="sm">
            <PlusCircle className="h-4 w-4" /> Create Job
          </Button>
        </Link>
      }
    >
      {loading ? (
        <SkeletonRows count={3} />
      ) : jobs.isError || profile.isError ? (
        <ErrorState
          message={toFriendlyMessage(
            jobs.error ?? profile.error,
            "Unable to load your job postings."
          )}
          onRetry={() => {
            jobs.refetch();
            profile.refetch();
          }}
        />
      ) : mine.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No job postings yet"
          description="Publish your first campus role to start receiving student applications."
          action={
            <Link to="/company/jobs/create">
              <Button>Create Job</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {mine.map((job) => (
            <Card key={job._id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{job.title}</h2>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.location || "—"} · {job.jobType || "—"} · {formatSalary(job.salary)} ·
                    Deadline {formatDate(job.deadline)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/jobs/${job._id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                  <Link to={`/company/jobs/${job._id}/applicants`}>
                    <Button variant="outline" size="sm">Applicants</Button>
                  </Link>
                  <Link to={`/company/jobs/${job._id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setPendingDelete({ id: job._id, title: job.title })}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {pendingDelete ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-base font-semibold text-foreground">Delete this job posting?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              "{pendingDelete.title}" will be removed permanently. Students will no longer see this
              drive.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPendingDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={removal.isPending}
                onClick={() => removal.mutate(pendingDelete.id)}
              >
                Delete job
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </PageShell>
  );
}

export default function CompanyJobs() {
  return (
    <CompanyRoute>
      <Jobs />
    </CompanyRoute>
  );
}
