import { useState } from "react";
import { Button, Card, Field, Input, Select, Textarea } from "@/components/ui-kit";

const jobTypes = ["Full Time", "Part Time", "Internship", "Contract"];

export function JobForm({ initial, submitLabel, pending, onSubmit }) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    skills: (initial?.skills ?? []).join(", "),
    salary: initial?.salary !== undefined ? String(initial.salary) : "",
    location: initial?.location ?? "",
    jobType: initial?.jobType ?? "Full Time",
    deadline: initial?.deadline ? initial.deadline.slice(0, 10) : "",
  });
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.title.trim().length < 3) next.title = "Enter a role title.";
    if (form.description.trim().length < 20) next.description = "Add at least 20 characters describing the role.";
    if (!form.skills.trim()) next.skills = "List at least one required skill.";
    const salary = Number(form.salary);
    if (!form.salary || Number.isNaN(salary) || salary <= 0) next.salary = "Enter the annual CTC in rupees.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.deadline) next.deadline = "Select an application deadline.";
    setErrors(next);
    if (Object.keys(next).length) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      salary,
      location: form.location.trim(),
      jobType: form.jobType,
      deadline: form.deadline,
    });
  }

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Card className="max-w-3xl">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
        <div className="sm:col-span-2">
          <Field label="Job Title" required error={errors.title}>
            <Input value={form.title} onChange={set("title")} placeholder="Java Backend Developer" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Description" required error={errors.description}>
            <Textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Responsibilities, team, tech stack and eligibility criteria."
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Skills" required hint="Comma separated" error={errors.skills}>
            <Input value={form.skills} onChange={set("skills")} placeholder="Java, Spring Boot, MySQL" />
          </Field>
        </div>
        <Field label="Annual Salary (₹)" required error={errors.salary}>
          <Input
            value={form.salary}
            inputMode="numeric"
            onChange={set("salary")}
            placeholder="600000"
          />
        </Field>
        <Field label="Location" required error={errors.location}>
          <Input value={form.location} onChange={set("location")} placeholder="Chennai" />
        </Field>
        <Field label="Job Type" required>
          <Select value={form.jobType} onChange={set("jobType")}>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Application Deadline" required error={errors.deadline}>
          <Input type="date" value={form.deadline} onChange={set("deadline")} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" loading={pending}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
