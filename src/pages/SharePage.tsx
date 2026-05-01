import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSharedResume } from "../lib/api";
import { TemplateRenderer } from "../components/templates/TemplateRenderer";
import type { Resume } from "../types/resume";

export default function SharePage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!resumeId) return;
    getSharedResume(resumeId)
      .then((data) => setResume(data as unknown as Resume))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [resumeId]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50">
        <p className="animate-pulse text-sm text-ink-500">Loading resume…</p>
      </div>
    );
  }

  if (notFound || !resume) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50 px-6 text-center">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Not found</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            This resume isn't available.
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            It may have been deleted, or the link is invalid.
          </p>
          <Link to="/" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
            ← Back to Nano Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-100 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Public preview</div>
            <h1 className="text-xl font-bold text-ink-900">{resume.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-semibold text-ink-700 hover:border-ink-300"
            >
              Print / Save PDF
            </button>
            <Link
              to="/"
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white shadow-pop hover:bg-brand-700"
            >
              Build your own →
            </Link>
          </div>
        </div>
        <div className="print-area flex justify-center">
          <TemplateRenderer resume={resume} />
        </div>
      </div>
    </div>
  );
}

