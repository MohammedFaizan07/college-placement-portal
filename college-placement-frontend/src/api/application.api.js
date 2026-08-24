import api, { unwrap } from "./axios";

// Student applies to a job — POST /api/jobs/:jobId/apply
export async function applyToJob(jobId) {
  const res = await api.post(`/api/jobs/${jobId}/apply`);
  return unwrap(res.data);
}

// Student views their own applications — GET /api/applications/my-applications
export async function getMyApplications() {
  const res = await api.get("/api/applications/my-applications");
  const data = unwrap(res.data);
  return Array.isArray(data) ? data : (data?.applications ?? []);
}

// Company views applicants for a job — GET /api/applications/job/:jobId
export async function getJobApplicants(jobId) {
  const res = await api.get(`/api/applications/job/${jobId}`);
  const data = unwrap(res.data);
  return Array.isArray(data) ? data : (data?.applications ?? []);
}

// Company updates an application status — PUT /api/applications/:applicationId/status
export async function updateApplicationStatus(applicationId, status) {
  const res = await api.put(`/api/applications/${applicationId}/status`, { status });
  return unwrap(res.data);
}
