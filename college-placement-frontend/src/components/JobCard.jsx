import { Link } from "react-router-dom";
import { Briefcase, CalendarClock, IndianRupee, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui-kit";
import { formatDate, formatSalary } from "@/lib/format";

export function companyNameOf(job) {
  if (job.company && typeof job.company === "object") return job.company.companyName;
  return "Company";
}

export function JobCard({ job }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
          <p className="mt-1 text-sm font-medium text-primary">{companyNameOf(job)}</p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> {job.location || "—"}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" /> {job.jobType || "—"}
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-primary" /> {formatSalary(job.salary)}
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-primary" /> {formatDate(job.deadline)}
        </div>
      </dl>

      {job.skills?.length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 5).map((skill) => (
            <li
              key={skill}
              className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 pt-1">
        <Link to={`/jobs/${job._id}`}>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            View Details
          </Button>
        </Link>
      </div>
    </article>
  );
}
