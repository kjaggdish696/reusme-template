// Axios API client for the FastAPI backend.
// Every request automatically attaches the Firebase ID token as a Bearer token.
import axios from "axios";
import { firebaseAuth } from "./firebase";

const BASE_URL = "http://127.0.0.1:8001";

export const apiClient = axios.create({ baseURL: BASE_URL });

// ─── Auth interceptor ────────────────────────────────────────────────────────
// Attaches the current user's Firebase ID token to every request.
apiClient.interceptors.request.use(async (config) => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ─── Resume API ───────────────────────────────────────────────────────────────
export interface ResumePayload {
  id?: string;
  title: string;
  templateId: string;
  data: object;
  createdAt?: string;
  lastModified?: string;
}

export const getResumes = () =>
  apiClient.get<ResumePayload[]>("/resumes").then((r) => {
    return r.data.map((payload) => {
      // Unwrap the nested "data" JSON so the frontend reducer gets the full Resume object
      const resume = payload.data as any;
      // Force the ID to be the real Firestore document ID
      resume.id = payload.id;
      resume.title = payload.title;
      return resume;
    });
  });

export const createResume = (payload: ResumePayload) =>
  apiClient.post<ResumePayload>("/resumes", payload).then((r) => r.data);

export const saveResume = (id: string, payload: Partial<ResumePayload>) =>
  apiClient.patch<ResumePayload>(`/resumes/${id}`, payload).then((r) => r.data);

export const deleteResume = (id: string) =>
  apiClient.delete(`/resumes/${id}`);

export const getSharedResume = (id: string) =>
  apiClient.get<ResumePayload>(`/resumes/${id}/share`).then((r) => {
    const resume = r.data.data as any;
    resume.id = r.data.id;
    resume.title = r.data.title;
    return resume;
  });

// ─── User Profile API ─────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  country?: string | null;
  city?: string | null;
  age?: number | null;
}

export const getMyProfile = () =>
  apiClient.get<UserProfile>("/users/me").then((r) => r.data);

export const updateMyProfile = (payload: Partial<UserProfile>) =>
  apiClient.patch<UserProfile>("/users/me", payload).then((r) => r.data);

// ─── Upload API ───────────────────────────────────────────────────────────────
export const uploadPhoto = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return apiClient
    .post<{ url: string }>("/uploads/photo", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data.url);
};
