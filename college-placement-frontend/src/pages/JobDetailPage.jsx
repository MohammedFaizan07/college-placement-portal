import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, Briefcase, Building2, CalendarClock, Globe, IndianRupee, MapPin, Send,
} from "lucide-react";
import { toast } from "sonner";
import { getJob } from "@/api/job.api";
import { applyToJob } from "@/api/application.api";
import { toFriendlyMessage } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button, Card, ErrorState } from "@/components/ui-kit";
import { Skeleton } from "@/components/Loaders";
import { formatDate, formatSalary, isPastDeadline } from "@/lib/format";

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span> {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const { isAuthenticated, role } = useAuth();
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  const { data: job, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId),
  });

  async function handleApply() {
    setApplying(true);
    try {
      await applyToJob(jobId);
      setApplied(true);
      toast.success("Application submitted successfully.");
    } catch (err) {
      const message = toFriendlyMessage(err, "Unable to submit your application. Please try again.");
      if (/already/i.test(message)) {
        setApplied(true);
        toast.info("You have already applied to this role.");
      } else {
        toast.error(message);
      }
    } finally {
      setApplying(false);
    }
  }

  if (isLoading) {
    return (
      <PageShell title="Loading role…">
        <Card>
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/3" />
          <Skeleton className="mt-8 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-11/12" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </Card>
      </PageShell>
    );
  }

  if (isError || !job) {
    return (
      <PageShell title="Job details">
        <ErrorState
          message={toFriendlyMessage(error, "This job could not be loaded. It may have been removed.")}
          onRetry={() => refetch()}
        />
      </PageShell>
    );
  }

  const company = typeof job.company === "object" ? job.company : null;
  const closed = job.status?.toUpperCase() === "CLOSED" || isPastDeadline(job.deadline);

  return (
    <PageShell
      title={job.title}
      description={company?.companyName ?? "Campus placement opening"}
      actions={
        <Link to="/jobs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" /> All jobs
          </Button>
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={job.status} />
              {closed ? (
                <span className="text-xs font-medium text-muted-foreground">Applications closed</span>
              ) : null}
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">Role description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {job.description || "No description provided by the recruiter."}
            </p>

            {job.skills?.length ? (
              <>
                <h3 className="mt-6 text-base font-semibold text-foreground">Required skills</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </Card>

          {company ? (
            <Card>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">
                  About {company.companyName}
                </h2>
              </div>
              {company.industry ? (
                <p className="mt-2 text-sm text-muted-foreground">{company.industry}</p>
              ) : null}
              {company.description ? (
                <p className="mt-3 text-sm text-muted-foreground">{company.description}</p>
              ) : null}
              {company.website ? (
                <a
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  href={company.website}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Globe className="h-4 w-4" /> {company.website}
                </a>
              ) : null}
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-foreground">Role summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={job.location || "—"} />
              <Row icon={<Briefcase className="h-4 w-4" />} label="Job type" value={job.jobType || "—"} />
              <Row icon={<IndianRupee className="h-4 w-4" />} label="Salary" value={formatSalary(job.salary)} />
              <Row icon={<CalendarClock className="h-4 w-4" />} label="Deadline" value={formatDate(job.deadline)} />
            </dl>
          </Card>

          <Card>
            {!isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Sign in with your student account to apply for this role.
                </p>
                <Link to="/login">
                  <Button className="mt-4 w-full">Sign in to apply</Button>
                </Link>
              </>
            ) : role === "company" ? (
              <p className="text-sm text-muted-foreground">
                You are signed in as a recruiter. Applications can only be submitted by student accounts.
              </p>
            ) : applied ? (
              <p className="text-sm font-medium text-success">
                Application submitted. Track its status under My Applications.
              </p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {closed
                    ? "This drive is closed, but you can still submit — the placement office makes the final call."
                    : "Apply with your saved placement profile and resume."}
                </p>
                <Button className="mt-4 w-full" loading={applying} onClick={handleApply}>
                  <Send className="h-4 w-4" /> Apply Now
                </Button>
              </>
            )}
            {isAuthenticated && role === "student" ? (
              <Link to="/student/applications">
                <Button variant="ghost" size="sm" className="mt-3 w-full">
                  My applications
                </Button>
              </Link>
            ) : null}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
