import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createJob } from "@/api/job.api";
import { toFriendlyMessage } from "@/api/axios";
import { CompanyRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { JobForm } from "@/components/JobForm";

function CreateJob() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) => createJob(values),
    onSuccess: () => {
      toast.success("Job posting published.");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      navigate("/company/jobs");
    },
    onError: (err) =>
      toast.error(toFriendlyMessage(err, "Unable to publish this job. Please review the details.")),
  });

  return (
    <PageShell
      title="Create Job Posting"
      description="Students see this role immediately after it is published."
    >
      <JobForm
        submitLabel="Publish job"
        pending={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values)}
      />
    </PageShell>
  );
}

export default function CreateJobPage() {
  return (
    <CompanyRoute>
      <CreateJob />
    </CompanyRoute>
  );
}
