import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Public pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterStudentPage from "@/pages/RegisterStudentPage";
import RegisterCompanyPage from "@/pages/RegisterCompanyPage";
import JobsPage from "@/pages/JobsPage";
import JobDetailPage from "@/pages/JobDetailPage";
import StatisticsPage from "@/pages/StatisticsPage";
import AboutPage from "@/pages/AboutPage";

// Student pages
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentProfile from "@/pages/student/StudentProfile";
import StudentApplications from "@/pages/student/StudentApplications";

// Company pages
import CompanyDashboard from "@/pages/company/CompanyDashboard";
import CompanyProfile from "@/pages/company/CompanyProfile";
import CompanyJobs from "@/pages/company/CompanyJobs";
import CreateJobPage from "@/pages/company/CreateJobPage";
import EditJobPage from "@/pages/company/EditJobPage";
import ApplicantsPage from "@/pages/company/ApplicantsPage";

// 404
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/student" element={<RegisterStudentPage />} />
          <Route path="/register/company" element={<RegisterCompanyPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Student (protected) */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/applications" element={<StudentApplications />} />

          {/* Company (protected) */}
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/jobs" element={<CompanyJobs />} />
          <Route path="/company/jobs/create" element={<CreateJobPage />} />
          <Route path="/company/jobs/:jobId/edit" element={<EditJobPage />} />
          <Route path="/company/jobs/:jobId/applicants" element={<ApplicantsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
