import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Users } from "lucide-react";
import { toast } from "sonner";
import { getJobApplicants, updateApplicationStatus } from "@/api/application.api";
import { getJob } from "@/api/job.api";
import { toFriendlyMessage } from "@/api/axios";
import { CompanyRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Card, EmptyState, ErrorState, Select } from "@/components/ui-kit";
import { SkeletonRows } from "@/components/Loaders";
import { formatDate } from "@/lib/format";

const STATUSES = ["APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"];

function studentOf(application) {
  return application.student && typeof application.student === "object"
    ? application.student
    : null;
}

function Applicants() {
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState(null);

  const job = useQuery({ queryKey: ["job", jobId], queryFn: () => getJob(jobId) });
  const applicants = useQuery({
    queryKey: ["applicants", jobId],
    queryFn: () => getJobApplicants(jobId),
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: () => {
      toast.success("Application status updated.");
      setPending(null);
      queryClient.invalidateQueries({ queryKey: ["applicants", jobId] });
    },
    onError: (err) =>
      toast.error(toFriendlyMessage(err, "Unable to update the application status.")),
  });

  const rows = applicants.data ?? [];

  return (
    <PageShell
      title={job.data?.title ? `Applicants — ${job.data.title}` : "Applicants"}
      description="Move candidates through shortlisting and final selection."
      actions={
        <Link to="/company/jobs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" /> Back to jobs
          </Button>
        </Link>
      }
    >
      {applicants.isLoading ? (
        <SkeletonRows count={4} />
      ) : applicants.isError ? (
        <ErrorState
          message={toFriendlyMessage(
            applicants.error,
            "Unable to load applicants for this role."
          )}
          onRetry={() => applicants.refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="No applicants yet"
          description="Students who apply to this role will appear here with their profile details."
        />
      ) : (
        <div className="grid gap-4">
          {rows.map((application) => {
            const student = studentOf(application);
            return (
              <Card key={application._id}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-foreground">
                        {student?.fullName ?? "Student"}
                      </h2>
                      <StatusBadge status={application.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[
                        student?.department,
                        student?.year ? `Year ${student.year}` : null,
                        student?.cgpa ? `CGPA ${student.cgpa}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Profile details unavailable"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[student?.email, student?.phone].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Applied {formatDate(application.appliedAt || application.createdAt)}
                    </p>
                  </div>

                  <div className="w-full sm:w-56">
                    <Select
                      aria-label="Update application status"
                      value=""
                      onChange={(e) => {
                        const status = e.target.value;
                        if (!status) return;
                        setPending({
                          id: application._id,
                          status,
                          name: student?.fullName ?? "this applicant",
                        });
                        e.target.value = "";
                      }}
                    >
                      <option value="">Update status…</option>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirm modal */}
      {pending ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-base font-semibold text-foreground">Confirm status change</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Mark {pending.name} as{" "}
              <span className="font-semibold text-foreground">{pending.status}</span>? The student
              will see this update on their applications page.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setPending(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                loading={mutation.isPending}
                onClick={() => mutation.mutate({ id: pending.id, status: pending.status })}
              >
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </PageShell>
  );
}

export default function ApplicantsPage() {
  return (
    <CompanyRoute>
      <Applicants />
    </CompanyRoute>
  );
}
