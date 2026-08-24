import { Outlet, Routes, Route } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import JobsPage from "@/pages/JobsPage";
import JobDetailPage from "@/pages/JobDetailPage";
import RegisterStudentPage from "@/pages/RegisterStudentPage";
import RegisterCompanyPage from "@/pages/RegisterCompanyPage";
import AboutPage from "@/pages/AboutPage";
import StatisticsPage from "@/pages/StatisticsPage";
import NotFoundPage from "@/pages/NotFoundPage";
import StudentDashboard from "@/pages/student/StudentDashboard";
import StudentApplications from "@/pages/student/StudentApplications";
import StudentProfile from "@/pages/student/StudentProfile";
//company
import ApplicantsPage from "@/pages/company/ApplicantsPage";
import CompanyDashboard from "@/pages/company/CompanyDashboard";

// Layout wraps every page with the shared Navbar and Footer
function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
        <Route path="/register/student" element={<RegisterStudentPage />} />
        <Route path="/register/company" element={<RegisterCompanyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />

        {/* Student protected routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/profile" element={<StudentProfile />} />

        {/* Company protected routes */}
        <Route path="/company/jobs/:jobId/applicants" element={<ApplicantsPage />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
// 
