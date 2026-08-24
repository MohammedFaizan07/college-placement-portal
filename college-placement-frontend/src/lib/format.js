export function formatSalary(salary) {
  if (salary === undefined || salary === null || Number.isNaN(Number(salary))) return "Not disclosed";
  const value = Number(salary);
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 1)} LPA`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function isPastDeadline(value) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}
