import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Save } from "lucide-react";
import { toast } from "sonner";
import { getCompanyProfile, updateCompanyProfile } from "@/api/company.api";
import { toFriendlyMessage } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { CompanyRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { Button, Card, ErrorState, Field, Input, Textarea } from "@/components/ui-kit";
import { Skeleton } from "@/components/Loaders";

function Profile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["company-profile"],
    queryFn: getCompanyProfile,
  });

  const [form, setForm] = useState({
    companyName: "", phone: "", website: "", industry: "", description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setForm({
        companyName: data.companyName ?? "",
        phone: data.phone ?? "",
        website: data.website ?? "",
        industry: data.industry ?? "",
        description: data.description ?? "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: (updated) => {
      toast.success("Company profile updated.");
      queryClient.setQueryData(["company-profile"], updated);
      setUser(updated);
    },
    onError: (err) =>
      toast.error(toFriendlyMessage(err, "Unable to update the profile. Please try again.")),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.companyName.trim().length < 2) next.companyName = "Company name is required.";
    if (form.phone && !/^\d{10}$/.test(form.phone.trim()))
      next.phone = "Enter a 10-digit phone number.";
    if (form.website && !/^https?:\/\/\S+\.\S+/.test(form.website.trim()))
      next.website = "Enter a full URL (https://…).";
    setErrors(next);
    if (Object.keys(next).length) return;

    mutation.mutate({
      companyName: form.companyName.trim(),
      phone: form.phone.trim(),
      website: form.website.trim(),
      industry: form.industry.trim(),
      description: form.description.trim(),
    });
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <PageShell
      title="Company Profile"
      description="These details appear to students alongside your job postings."
    >
      {isLoading ? (
        <Card>
          <Skeleton className="h-6 w-48" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      ) : isError ? (
        <ErrorState
          message={toFriendlyMessage(error, "Unable to load the company profile.")}
          onRetry={() => refetch()}
        />
      ) : (
        <Card className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">{data?.companyName}</h2>
              <p className="text-sm text-muted-foreground">{data?.email}</p>
            </div>
          </div>

          <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
            <div className="sm:col-span-2">
              <Field label="Company Name" required error={errors.companyName}>
                <Input value={form.companyName} onChange={set("companyName")} />
              </Field>
            </div>
            <Field label="Email">
              <Input value={data?.email ?? ""} disabled />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <Input value={form.phone} inputMode="numeric" onChange={set("phone")} />
            </Field>
            <Field label="Website" error={errors.website}>
              <Input value={form.website} onChange={set("website")} />
            </Field>
            <Field label="Industry">
              <Input value={form.industry} onChange={set("industry")} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <Textarea value={form.description} onChange={set("description")} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" loading={mutation.isPending}>
                <Save className="h-4 w-4" /> Save changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </PageShell>
  );
}

export default function CompanyProfile() {
  return (
    <CompanyRoute>
      <Profile />
    </CompanyRoute>
  );
}
