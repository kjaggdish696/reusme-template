import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEditor } from "../store/EditorContext";
import { makeBlankResume } from "../data/seed";
import { useAuth } from "../store/AuthContext";
import ResumeMiniPreview from "../components/templates/ResumeMiniPreview";
import { createResume, deleteResume } from "../lib/api";

export default function DashboardPage() {
  const { state, dispatch } = useEditor();
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleCreate(templateId: string) {
    const localResume = makeBlankResume(templateId, "Untitled Resume");
    try {
      const dbResume = await createResume({
        title: localResume.title,
        templateId: localResume.templateId,
        data: localResume as unknown as object,
      });
      localResume.id = dbResume.id!;
      
      dispatch({ type: "CREATE_RESUME", resume: localResume });
      navigate(`/editor/${localResume.id}`);
    } catch (e: any) {
      console.error("Failed to create resume in database", e);
      alert(`Failed to create resume. Error: ${e?.response?.data?.detail || e.message}`);
    }
  }

  async function duplicate(resumeId: string) {
    const original = state.resumes.find((r) => r.id === resumeId);
    if (!original) return;
    
    // Deep copy the original resume's data
    const copy = JSON.parse(JSON.stringify(original));
    copy.title = `${original.title} (Copy)`;
    copy.updatedAt = new Date().toISOString();
    
    try {
      const dbResume = await createResume({
        title: copy.title,
        templateId: copy.templateId,
        data: copy,
      });
      copy.id = dbResume.id!; // Assign real backend ID
      dispatch({ type: "DUPLICATE_RESUME", resumeId, newResume: copy });
    } catch (e: any) {
      console.error("Failed to duplicate resume in database", e);
      alert(`Failed to duplicate resume. Error: ${e?.response?.data?.detail || e.message}`);
    }
  }

  const totalSections = state.resumes.reduce((acc, r) => acc + r.sections.length, 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">Dashboard</span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"}.
        </h1>
        <p className="text-sm text-ink-500">
          Manage every version of your resume. Duplicate, customize, and export with one click.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Resumes" value={state.resumes.length} />
        <Stat label="Sections" value={totalSections} />
        <Stat label="Auto-save" value="Active" tone="emerald" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">Your resumes</h2>
          <p className="text-sm text-ink-500">{state.resumes.length} saved · synced to your cloud account</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/templates")}
          className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-pop hover:bg-brand-700"
        >
          + New resume
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {state.resumes.map((resume, idx) => {
          return (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-pop"
            >
              <button
                type="button"
                onClick={() => navigate(`/editor/${resume.id}`)}
                className="relative h-52 w-full shrink-0 cursor-pointer overflow-hidden border-0 bg-transparent p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                aria-label={`Open ${resume.title}`}
              >
                <ResumeMiniPreview resume={resume} />
              </button>
              <div className="border-t border-ink-100 px-4 py-3">
                <div className="mb-2 min-w-0">
                  <div className="truncate text-sm font-bold text-ink-900">{resume.title}</div>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-500">
                  <span>Updated {timeAgo(resume.updatedAt)}</span>
                  <div className="flex items-center gap-1">
                    <IconBtn title="Duplicate" onClick={() => duplicate(resume.id)} icon="⎘" />
                    <IconBtn
                      title="Delete"
                      danger
                      onClick={async () => {
                        if (confirm(`Delete "${resume.title}"? This cannot be undone.`)) {
                          try {
                            await deleteResume(resume.id);
                            dispatch({ type: "DELETE_RESUME", resumeId: resume.id });
                          } catch (e: any) {
                            console.error("Failed to delete resume", e);
                            alert(`Failed to delete resume. Error: ${e?.response?.data?.detail || e.message}`);
                          }
                        }
                      }}
                      icon="✕"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        <button
          type="button"
          onClick={() => handleCreate("aurora")}
          className="flex min-h-[260px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-200 bg-white/60 text-ink-500 transition hover:border-brand-400 hover:bg-brand-50/40 hover:text-brand-700"
        >
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-2xl text-white shadow-pop">
            +
          </span>
          <span className="text-sm font-semibold">Start from blank</span>
          <span className="text-xs text-ink-400">Modern template, ready to edit</span>
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "emerald" }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      <div className="text-xs font-semibold uppercase tracking-widest text-ink-400">{label}</div>
      <div
        className={`mt-2 text-3xl font-extrabold tracking-tight ${tone === "emerald" ? "text-emerald-600" : "text-ink-900"}`}
      >
        {value}
      </div>
    </div>
  );
}

function IconBtn({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: string;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`grid h-7 w-7 place-items-center rounded-lg border transition ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-ink-100 text-ink-500 hover:bg-ink-50"
      }`}
    >
      {icon}
    </button>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
