import api, { unwrap } from "./axios";

export async function registerStudent(payload) {
  const res = await api.post("/api/students/register", payload);
  return unwrap(res.data);
}

export async function registerCompany(payload) {
  const res = await api.post("/api/companies/register", payload);
  return unwrap(res.data);
}

export async function loginStudent(email, password) {
  const res = await api.post("/api/students/login", { email, password });
  const data = unwrap(res.data);
  // Backend returns { token, student }
  return { token: data.token, user: data.student ?? data.user ?? null };
}

export async function loginCompany(email, password) {
  const res = await api.post("/api/companies/login", { email, password });
  const data = unwrap(res.data);
  // Backend returns { token, company }
  return { token: data.token, user: data.company ?? data.user ?? null };
}
