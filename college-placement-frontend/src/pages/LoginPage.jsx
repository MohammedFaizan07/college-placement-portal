import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, GraduationCap, LogIn } from "lucide-react";
import { toast } from "sonner";
import { loginCompany, loginStudent } from "@/api/auth.api";
import { toFriendlyMessage } from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { Button, Card, Field, Input } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const result =
        role === "student"
          ? await loginStudent(email.trim(), password)
          : await loginCompany(email.trim(), password);

      if (!result.token) throw new Error("Login failed: the server did not return a session token.");
      login(result.token, role, result.user ?? null);
      toast.success("Signed in successfully.");
      navigate(role === "student" ? "/student/dashboard" : "/company/dashboard", { replace: true });
    } catch (error) {
      toast.error(toFriendlyMessage(error, "Unable to sign in. Please check your credentials."));
    } finally {
      setSubmitting(false);
    }
  }

  const roleOptions = [
    { key: "student", label: "Student", icon: GraduationCap },
    { key: "company", label: "Company", icon: Building2 },
  ];

  return (
    <main className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-14 sm:px-6">
      <Card className="shadow-elevated">
        <div className="text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <LogIn className="h-5 w-5" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground">Sign in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Choose your account type to continue.</p>
        </div>

        {/* Role toggle */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1">
          {roleOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRole(option.key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                role === option.key
                  ? "bg-card text-primary shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <option.icon className="h-4 w-4" /> {option.label}
            </button>
          ))}
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <Field label="Email" required error={errors.email}>
            <Input
              type="email"
              value={email}
              autoComplete="email"
              placeholder={role === "student" ? "student@college.edu" : "hr@company.com"}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Password" required error={errors.password}>
            <Input
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full" loading={submitting} size="lg">
            Sign in as {role === "student" ? "Student" : "Company"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register/student" className="font-semibold text-primary hover:underline">
            Student registration
          </Link>{" "}
          ·{" "}
          <Link to="/register/company" className="font-semibold text-primary hover:underline">
            Company registration
          </Link>
        </p>
      </Card>
    </main>
  );
}
