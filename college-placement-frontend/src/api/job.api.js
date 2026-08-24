import api, { unwrap } from "./axios";

export async function listJobs() {
  const res = await api.get("/api/jobs");
  const data = unwrap(res.data);
  // Backend returns array directly or wrapped in { jobs: [...] }
  return Array.isArray(data) ? data : (data?.jobs ?? []);
}

export async function getJob(jobId) {
  const res = await api.get(`/api/jobs/${jobId}`);
  return unwrap(res.data);
}

export async function createJob(payload) {
  const res = await api.post("/api/jobs", payload);
  return unwrap(res.data);
}

export async function updateJob(jobId, payload) {
  const res = await api.put(`/api/jobs/${jobId}`, payload);
  return unwrap(res.data);
}

export async function deleteJob(jobId) {
  const res = await api.delete(`/api/jobs/${jobId}`);
  return unwrap(res.data);
}
