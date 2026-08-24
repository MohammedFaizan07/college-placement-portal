import api, { unwrap } from "./axios";

export async function getCompanyProfile() {
  const res = await api.get("/api/companies/profile");
  return unwrap(res.data);
}

export async function updateCompanyProfile(payload) {
  const res = await api.put("/api/companies/profile", payload);
  return unwrap(res.data);
}
