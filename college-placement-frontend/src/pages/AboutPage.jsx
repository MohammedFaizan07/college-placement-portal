import { Link } from "react-router-dom";
import { Building2, GraduationCap, ShieldCheck, Workflow } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button, Card } from "@/components/ui-kit";

const sections = [
  {
    icon: GraduationCap,
    title: "For students",
    text: "Maintain an accurate academic profile, upload your resume, browse verified openings and follow each application from applied to selected.",
  },
  {
    icon: Building2,
    title: "For recruiters",
    text: "Publish roles with skills, compensation and deadlines, then review applicants and progress candidates through shortlisting and selection.",
  },
  {
    icon: Workflow,
    title: "For the placement cell",
    text: "A live view of registrations, active drives, application volume and final placement outcomes for reporting.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      title="About the Placement Portal"
      description="The portal is the college's central system for campus recruitment — replacing scattered spreadsheets, email threads and notice boards with one accountable workflow."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {sections.map((item) => (
          <Card key={item.title}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-primary">
              <item.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 text-base font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="text-base font-semibold text-foreground">Access and privacy</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Student and recruiter accounts are separate. Every request is authenticated with a
              token issued at login, and each role can only view the data it is entitled to —
              students see their own profile and applications, companies see their own postings and
              applicants.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/register/student">
          <Button className="w-full sm:w-auto">Create student account</Button>
        </Link>
        <Link to="/register/company">
          <Button variant="outline" className="w-full sm:w-auto">
            Register as a company
          </Button>
        </Link>
      </div>
    </PageShell>
  );
}
