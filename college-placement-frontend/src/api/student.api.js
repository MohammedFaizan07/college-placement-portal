import api, { unwrap } from "./axios";

export async function getStudentProfile() {
  const res = await api.get("/api/students/profile");
  return unwrap(res.data);
}

export async function updateStudentProfile(payload) {
  const res = await api.put("/api/students/profile", payload);
  return unwrap(res.data);
}

// field name is "resume" — confirmed from backend upload.middleware.js
export async function uploadResume(file, onProgress) {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await api.post("/api/students/resume", formData, {
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return unwrap(res.data);
}
