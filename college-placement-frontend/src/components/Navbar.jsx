import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "Jobs", to: "/jobs" },
  { label: "Statistics", to: "/statistics" },
  { label: "About", to: "/about" },
];

const studentLinks = [
  { label: "Dashboard", to: "/student/dashboard" },
  { label: "Jobs", to: "/jobs" },
  { label: "My Applications", to: "/student/applications" },
  { label: "Profile", to: "/student/profile" },
];

const companyLinks = [
  { label: "Dashboard", to: "/company/dashboard" },
  { label: "Jobs", to: "/company/jobs" },
  { label: "Create Job", to: "/company/jobs/create" },
  { label: "Profile", to: "/company/profile" },
];

export function Navbar() {
  const { isAuthenticated, role, logout, isReady } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const links = !isReady || !isAuthenticated
    ? publicLinks
    : role === "company"
    ? companyLinks
    : studentLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-[15px] font-bold leading-tight text-foreground">
            College Placement <span className="text-primary">Portal</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                pathname === link.to && "bg-accent text-accent-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isReady && isAuthenticated ? (
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register/student">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-border text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open ? (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {isReady && isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register/student" onClick={() => setOpen(false)}>
                  <Button className="w-full">Create Student Account</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
