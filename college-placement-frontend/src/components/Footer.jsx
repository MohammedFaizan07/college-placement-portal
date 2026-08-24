import { Link } from "react-router-dom";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-[15px] font-bold text-foreground">College Placement Portal</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A single place for the placement cell, students and recruiters to run campus hiring — from
            profiles and job postings to applications and final offers.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-primary">Browse Jobs</Link></li>
            <li><Link to="/statistics" className="hover:text-primary">Placement Statistics</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/register/company" className="hover:text-primary">Recruiter Registration</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-foreground">Placement Cell</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" /> Training &amp; Placement Office, Main Campus
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> placement@college.edu
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> +91 00000 00000
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} College Placement Portal. All rights reserved.
      </div>
    </footer>
  );
}
