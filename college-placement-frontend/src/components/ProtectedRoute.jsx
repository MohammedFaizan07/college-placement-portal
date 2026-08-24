import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { PageLoader } from "@/components/Loaders";

export function ProtectedRoute({ role, children }) {
  const { isReady, isAuthenticated, role: currentRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (currentRole !== role) {
      navigate(
        currentRole === "company" ? "/company/dashboard" : "/student/dashboard",
        { replace: true }
      );
    }
  }, [isReady, isAuthenticated, currentRole, role, navigate]);

  if (!isReady || !isAuthenticated || currentRole !== role) {
    return <PageLoader label="Checking your access…" />;
  }

  return children;
}

export function StudentRoute({ children }) {
  return <ProtectedRoute role="student">{children}</ProtectedRoute>;
}

export function CompanyRoute({ children }) {
  return <ProtectedRoute role="company">{children}</ProtectedRoute>;
}
