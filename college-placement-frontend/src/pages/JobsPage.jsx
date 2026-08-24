import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Search } from "lucide-react";
import { listJobs } from "@/api/job.api";
import { toFriendlyMessage } from "@/api/axios";
import { PageShell } from "@/components/PageShell";
import { JobCard, companyNameOf } from "@/components/JobCard";
import { SkeletonCards } from "@/components/Loaders";
import { EmptyState, ErrorState, Input, Select } from "@/components/ui-kit";

export default function JobsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: listJobs,
  });

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  const jobs = useMemo(() => data ?? [], [data]);

  const jobTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.jobType).filter(Boolean))),
    [jobs]
  );
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))),
    [jobs]
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = jobs.filter((job) => {
      const matchesTerm =
        !term ||
        job.title?.toLowerCase().includes(term) ||
        companyNameOf(job).toLowerCase().includes(term) ||
        job.skills?.some((s) => s.toLowerCase().includes(term));
      const matchesType = !jobType || job.jobType === jobType;
      const matchesLocation = !location || job.location === location;
      return matchesTerm && matchesType && matchesLocation;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "salary") return (b.salary ?? 0) - (a.salary ?? 0);
      if (sort === "deadline")
        return new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime();
      return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    });
  }, [jobs, search, jobType, location, sort]);

  return (
    <PageShell
      title="Campus Job Openings"
      description="Roles published by recruiters for this placement season. Apply directly from the job details page."
    >
      {/* Filters */}
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-card sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search title, company or skill"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={jobType} onChange={(e) => setJobType(e.target.value)} aria-label="Filter by job type">
          <option value="">All job types</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        <Select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
          <option value="">All locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort jobs">
          <option value="newest">Newest first</option>
          <option value="salary">Highest salary</option>
          <option value="deadline">Deadline soonest</option>
        </Select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <SkeletonCards />
        ) : isError ? (
          <ErrorState
            message={toFriendlyMessage(error, "Unable to load jobs. Please try again.")}
            onRetry={() => refetch()}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="h-5 w-5" />}
            title={jobs.length === 0 ? "No jobs posted yet" : "No jobs match your filters"}
            description={
              jobs.length === 0
                ? "Openings will appear here as soon as recruiters publish their drives."
                : "Try clearing the search or filters to see all open roles."
            }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Showing {visible.length} of {jobs.length} openings
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
