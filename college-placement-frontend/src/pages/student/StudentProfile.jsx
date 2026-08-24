import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileCheck2, Save, UploadCloud, UserRound } from "lucide-react";
import { toast } from "sonner";
import { getStudentProfile, updateStudentProfile, uploadResume } from "@/api/student.api";
import { toFriendlyMessage } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { StudentRoute } from "@/components/ProtectedRoute";
import { PageShell } from "@/components/PageShell";
import { Button, Card, ErrorState, Field, Input, Select } from "@/components/ui-kit";
import { Skeleton } from "@/components/Loaders";

function ResumeCard({ currentResume }) {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      toast.error("Select a PDF resume first.");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Only PDF resumes are accepted.");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      await uploadResume(file, setProgress);
      toast.success("Resume uploaded successfully.");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
    } catch (error) {
      toast.error(toFriendlyMessage(error, "Resume upload failed. Please try again."));
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card className="scroll-mt-24">
      <div className="flex items-center gap-2">
        <UploadCloud className="h-5 w-5 text-primary" />
        <h2 className="text-base font-semibold text-foreground">Resume</h2>
      </div>

      {currentResume ? (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-foreground">
          <FileCheck2 className="h-4 w-4 text-success" /> A resume is on file.
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No resume uploaded yet.</p>
      )}

      <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 px-4 py-8 text-center transition-colors hover:border-primary/50">
        <UploadCloud className="h-6 w-6 text-primary" />
        <span className="mt-2 text-sm font-medium text-foreground">
          {file ? file.name : "Choose a PDF resume"}
        </span>
        <span className="mt-1 text-xs text-muted-foreground">PDF only</span>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {uploading ? (
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Uploading… {progress}%</p>
        </div>
      ) : null}

      <Button className="mt-5 w-full" onClick={handleUpload} loading={uploading} disabled={!file}>
        Upload resume
      </Button>
    </Card>
  );
}

function Profile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getStudentProfile,
  });

  const [form, setForm] = useState({
    fullName: "", phone: "", department: "", year: "", cgpa: "", skills: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setForm({
        fullName: data.fullName ?? "",
        phone: data.phone ?? "",
        department: data.department ?? "",
        year: data.year !== undefined && data.year !== null ? String(data.year) : "",
        cgpa: data.cgpa !== undefined && data.cgpa !== null ? String(data.cgpa) : "",
        skills: (data.skills ?? []).join(", "),
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: (updated) => {
      toast.success("Profile updated successfully.");
      queryClient.setQueryData(["student-profile"], updated);
      setUser(updated);
    },
    onError: (err) => toast.error(toFriendlyMessage(err, "Unable to update your profile. Please try again.")),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.fullName.trim().length < 3) next.fullName = "Enter your full name.";
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = "Enter a 10-digit phone number.";
    if (!form.department.trim()) next.department = "Department is required.";
    const cgpa = Number(form.cgpa);
    if (!form.cgpa || Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10)
      next.cgpa = "CGPA must be between 0 and 10.";
    setErrors(next);
    if (Object.keys(next).length) return;

    mutation.mutate({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      ...(form.year ? { year: Number(form.year) } : {}),
      cgpa: Number(form.cgpa),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <PageShell
      title="My Profile"
      description="Recruiters review these details along with every application you submit."
    >
      {isLoading ? (
        <Card>
          <Skeleton className="h-6 w-40" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      ) : isError ? (
        <ErrorState
          message={toFriendlyMessage(error, "Unable to load your profile. Please try again.")}
          onRetry={() => refetch()}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-primary">
                <UserRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">{data?.fullName}</h2>
                <p className="text-sm text-muted-foreground">{data?.email}</p>
              </div>
            </div>

            <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
              <div className="sm:col-span-2">
                <Field label="Full Name" required error={errors.fullName}>
                  <Input value={form.fullName} onChange={set("fullName")} />
                </Field>
              </div>
              <Field label="Email">
                <Input value={data?.email ?? ""} disabled />
              </Field>
              <Field label="Phone" required error={errors.phone}>
                <Input value={form.phone} inputMode="numeric" onChange={set("phone")} />
              </Field>
              <Field label="Department" required error={errors.department}>
                <Input value={form.department} onChange={set("department")} />
              </Field>
              <Field label="Year of Study">
                <Select value={form.year} onChange={set("year")}>
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </Select>
              </Field>
              <Field label="CGPA" required error={errors.cgpa}>
                <Input value={form.cgpa} inputMode="decimal" onChange={set("cgpa")} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Skills" hint="Comma separated, e.g. Java, SQL, React">
                  <Input value={form.skills} onChange={set("skills")} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" loading={mutation.isPending}>
                  <Save className="h-4 w-4" /> Save changes
                </Button>
              </div>
            </form>
          </Card>

          <ResumeCard currentResume={data?.resume || data?.resumeUrl || ""} />
        </div>
      )}
    </PageShell>
  );
}

export default function StudentProfile() {
  return (
    <StudentRoute>
      <Profile />
    </StudentRoute>
  );
}
