import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { registerCompany } from "@/api/auth.api";
import { toFriendlyMessage } from "@/api/axios";
import { Button, Card, Field, Input, Textarea } from "@/components/ui-kit";

const initial = {
  companyName: "",
  email: "",
  password: "",
  phone: "",
  website: "",
  industry: "",
  description: "",
};

export default function RegisterCompanyPage() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const next = {};
    if (form.companyName.trim().length < 2) next.companyName = "Company name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "Enter a valid work email.";
    if (form.password.length < 6) next.password = "Use at least 6 characters.";
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = "Enter a 10-digit phone number.";
    if (!/^https?:\/\/\S+\.\S+/.test(form.website.trim()))
      next.website = "Enter a full URL (https://…).";
    if (!form.industry.trim()) next.industry = "Industry is required.";
    if (form.description.trim().length < 20)
      next.description = "Add at least 20 characters about your company.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerCompany({
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        website: form.website.trim(),
        industry: form.industry.trim(),
        description: form.description.trim(),
      });
      toast.success("Company registered. Please sign in to continue.");
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
            <Building2 className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-foreground">Company Registration</h1>
            <p className="text-sm text-muted-foreground">Start recruiting from campus in a few minutes.</p>
          </div>
        </div>

        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
          <div className="sm:col-span-2">
            <Field label="Company Name" required error={errors.companyName}>
              <Input value={form.companyName} onChange={set("companyName")} placeholder="TechNova Solutions" />
            </Field>
          </div>
          <Field label="Work Email" required error={errors.email}>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="hr@company.com" />
          </Field>
          <Field label="Password" required error={errors.password}>
            <Input type="password" value={form.password} onChange={set("password")} placeholder="Minimum 6 characters" />
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <Input value={form.phone} inputMode="numeric" onChange={set("phone")} placeholder="9876543210" />
          </Field>
          <Field label="Website" required error={errors.website}>
            <Input value={form.website} onChange={set("website")} placeholder="https://company.com" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Industry" required error={errors.industry}>
              <Input value={form.industry} onChange={set("industry")} placeholder="Information Technology" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Company Description" required error={errors.description}>
              <Textarea
                value={form.description}
                onChange={set("description")}
                placeholder="What your company does, the teams students would join and the kind of work involved."
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Create company account
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
