import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { registerStudent } from "@/api/auth.api";
import { toFriendlyMessage } from "@/api/axios";
import { Button, Card, Field, Input, Select } from "@/components/ui-kit";

const initial = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  year: "",
  cgpa: "",
};

export default function RegisterStudentPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const next = {};
    if (form.fullName.trim().length < 3) next.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = "Enter a 10-digit phone number.";
    if (!form.department.trim()) next.department = "Department is required.";
    if (!form.year) next.year = "Select your year of study.";
    const cgpa = Number(form.cgpa);
    if (!form.cgpa || Number.isNaN(cgpa) || cgpa < 0 || cgpa > 10)
      next.cgpa = "CGPA must be between 0 and 10.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerStudent({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        department: form.department.trim(),
        year: Number(form.year),
        cgpa: Number(form.cgpa),
      });
      toast.success("Registration successful. Please sign in to continue.");
      navigate("/login");
    } catch (error) {
      toast.error(toFriendlyMessage(error, "Registration failed. Please review your details."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
      <Card className="shadow-elevated">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-foreground">Student Registration</h1>
            <p className="text-sm text-muted-foreground">Register once and apply to every campus drive.</p>
          </div>
        </div>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
          <div className="sm:col-span-2">
            <Field label="Full Name" required error={errors.fullName}>
              <Input value={form.fullName} onChange={set("fullName")} placeholder="Ananya Sharma" />
            </Field>
          </div>
          <Field label="Email" required error={errors.email}>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="ananya@college.edu" />
          </Field>
          <Field label="Password" required error={errors.password}>
            <Input type="password" value={form.password} onChange={set("password")} placeholder="Minimum 6 characters" />
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <Input value={form.phone} inputMode="numeric" onChange={set("phone")} placeholder="9876543210" />
          </Field>
          <Field label="Department" required error={errors.department}>
            <Input value={form.department} onChange={set("department")} placeholder="Computer Science" />
          </Field>
          <Field label="Year of Study" required error={errors.year}>
            <Select value={form.year} onChange={set("year")}>
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </Select>
          </Field>
          <Field label="CGPA" required error={errors.cgpa} hint="On a 10-point scale">
            <Input value={form.cgpa} inputMode="decimal" onChange={set("cgpa")} placeholder="8.4" />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Create student account
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
