import api, { unwrap } from "./axios";

// Public endpoint — no auth required
export async function getStatistics() {
  const res = await api.get("/api/statistics");
  return unwrap(res.data);
}
