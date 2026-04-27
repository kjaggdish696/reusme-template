import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { editorReducer, initialEditorState } from "./editorReducer";
import type { EditorAction, EditorState } from "./editorReducer";
import type { Resume } from "../types/resume";
import { getResumes, createResume, saveResume, deleteResume } from "../lib/api";
import { makeBlankResume, makeSampleResume } from "../data/seed";
import { firebaseAuth } from "../lib/firebase";

const ACTIVE_KEY = "rcp.activeResume.v1";

interface EditorContextValue {
  state: EditorState;
  dispatch: (a: EditorAction) => void;
  saveActiveResume: () => Promise<void>;
  saveStatus: "idle" | "saving" | "saved";
  lastSavedAt: number | null;
  canUndo: boolean;
  canRedo: boolean;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const saveTimer = useRef<number | null>(null);

  // ── Load resumes from the backend on mount (once user is signed in) ─────────
  useEffect(() => {
    const unsub = firebaseAuth.onAuthStateChanged(async (fbUser) => {
      if (!fbUser) {
        // Not signed in — clear state and wait
        setHydrated(false);
        return;
      }

      try {
        const resumes = (await getResumes()) as unknown as Resume[];
        const activeResumeId = resumes.length > 0 ? resumes[0].id : null;

        if (resumes.length > 0) {
          dispatch({ type: "INIT", resumes, activeResumeId });
        } else {
          // NO RESUMES IN DATABASE
          // Instead of seeding local data, we just initialize as empty.
          // The user must click "Create Resume" to add one to the database.
          dispatch({ type: "INIT", resumes: [], activeResumeId: null });
        }
      } catch (err) {
        console.error("Failed to load resumes from API:", err);
        // Do NOT fallback to local data. Show empty state if API fails.
        dispatch({ type: "INIT", resumes: [], activeResumeId: null });
      } finally {
        setHydrated(true);
      }
    });
    return unsub;
  }, []);

  const saveActiveResume = useCallback(async () => {
    if (!state.activeResumeId) return;

    const activeResume = state.resumes.find((r) => r.id === state.activeResumeId);
    if (!activeResume) return;

    setSaveStatus("saving");
    try {
      await saveResume(activeResume.id, {
        title: activeResume.title,
        templateId: activeResume.templateId,
        data: activeResume as unknown as object,
      });
      setSaveStatus("saved");
      setLastSavedAt(Date.now());
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("idle");
      alert("Failed to save. Please check your connection.");
    }
  }, [state.resumes, state.activeResumeId]);

  // Reset "saved" badge after 2.5 s (longer for manual save visibility)
  useEffect(() => {
    if (saveStatus !== "saved") return;
    const id = window.setTimeout(() => setSaveStatus("idle"), 2500);
    return () => window.clearTimeout(id);
  }, [saveStatus]);

  const dispatchStable = useCallback((a: EditorAction) => dispatch(a), []);

  const value = useMemo<EditorContextValue>(
    () => ({
      state,
      dispatch: dispatchStable,
      saveActiveResume,
      saveStatus,
      lastSavedAt,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
    }),
    [state, dispatchStable, saveActiveResume, saveStatus, lastSavedAt],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useActiveResume(): Resume | null {
  const { state } = useEditor();
  return state.resumes.find((r) => r.id === state.activeResumeId) ?? null;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useResume(resumeId: string | undefined): Resume | null {
  const { state } = useEditor();
  if (!resumeId) return null;
  return state.resumes.find((r) => r.id === resumeId) ?? null;
}

