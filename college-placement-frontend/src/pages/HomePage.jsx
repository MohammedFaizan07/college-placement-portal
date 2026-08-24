import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  Send,
  UserRound,
  Users,
} from "lucide-react";
import { getStatistics } from "@/api/statistics.api";
import { Button, Card, SectionHeading } from "@/components/ui-kit";
import { Skeleton } from "@/components/Loaders";

const features = [
  { icon: UserRound, title: "Student Profiles", text: "Academic details, skills and resumes kept current in one verified profile." },
  { icon: Briefcase, title: "Job Opportunities", text: "Roles posted directly by recruiters with salary, skills and deadlines." },
  { icon: Send, title: "Easy Applications", text: "One-click applications — no email chains, no spreadsheets." },
  { icon: ClipboardList, title: "Application Tracking", text: "Live status from applied through shortlisted to selected." },
  { icon: Building2, title: "Company Recruitment", text: "Recruiters manage postings and review applicants in a single console." },
  { icon: BarChart3, title: "Placement Insights", text: "Placement cell metrics on students, drives and offers." },
];

const studentSteps = ["Register", "Complete Profile", "Browse Jobs", "Apply", "Track Status"];
const companySteps = ["Register", "Create Job", "Review Applicants", "Update Status", "Hire Students"];

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  const stats = [
    { label: "Students", value: data?.totalStudents, icon: Users },
    { label: "Companies", value: data?.totalCompanies, icon: Building2 },
    { label: "Jobs Posted", value: data?.totalJobs, icon: Briefcase },
    { label: "Applications", value: data?.totalApplications, icon: FileText },
    { label: "Students Selected", value: data?.totalSelectedStudents, icon: Award },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="hero-surface border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" /> Official campus placement platform
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
              Connecting Students with{" "}
              <span className="text-gradient-brand">Career Opportunities</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              The placement portal brings students, the college placement cell and hiring companies onto
              one streamlined workflow — verified student profiles, live job drives, structured
              applications and transparent selection status.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/jobs">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Jobs <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register/student">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Create Student Account
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Recruiting on campus?{" "}
              <Link to="/register/company" className="font-semibold text-primary hover:underline">
                Register as a company
              </Link>
            </p>
          </div>

          <Card className="p-6 shadow-elevated">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Live placement snapshot</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-secondary/60 p-4">
                  <stat.icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-2xl font-bold text-foreground">
                    {isLoading ? <Skeleton className="h-7 w-14" /> : isError ? "—" : (stat.value ?? 0)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-primary/25 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground">Students selected</p>
              <p className="mt-1 text-3xl font-bold text-primary">
                {isLoading ? <Skeleton className="h-8 w-16" /> : isError ? "—" : (data?.totalSelectedStudents ?? 0)}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Platform features"
          title="Everything the placement cell needs"
          description="Purpose-built modules for students and recruiters, backed by a single source of truth."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="transition-shadow hover:shadow-elevated">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
                <feature.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How it works" title="A clear path for both sides of the drive" />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {[
              { title: "For students", steps: studentSteps, icon: UserRound },
              { title: "For companies", steps: companySteps, icon: Building2 },
            ].map((track) => (
              <div key={track.title} className="rounded-xl border border-border bg-background p-6">
                <div className="flex items-center gap-2">
                  <track.icon className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">{track.title}</h3>
                </div>
                <ol className="mt-5 space-y-3">
                  {track.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Placement statistics"
          title="Numbers straight from the placement database"
          description="Updated live as students register, companies post drives and offers are rolled out."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-3 text-3xl font-bold text-foreground">
                {isLoading ? (
                  <Skeleton className="mx-auto h-8 w-16" />
                ) : isError ? (
                  "—"
                ) : (
                  stat.value ?? 0
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
        {isError ? (
          <p className="mt-4 text-center text-sm text-destructive">
            Unable to load placement statistics right now. Please try again shortly.
          </p>
        ) : null}
        <div className="mt-8 text-center">
          <Link to="/statistics">
            <Button variant="outline">
              View full statistics <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
