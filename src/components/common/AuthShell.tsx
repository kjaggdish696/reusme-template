import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-500 p-12 text-white lg:flex">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold opacity-90">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">RC</span>
          ResumeCraft Pro
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Build a job-winning resume in <span className="underline decoration-amber-300/80 decoration-4">minutes</span>.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/90">
            Recruiter-tested templates, structured editor, real-time preview, and one-click PDF export — everything you need to ship a polished resume.
          </p>
          <ul className="space-y-3 text-sm text-white/85">
            {[
              "4 modern, ATS-friendly templates",
              "Drag-and-drop sections and items",
              "Auto-save · Undo / Redo",
              "PDF export & shareable link",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-white/20 text-[11px]">✓</span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-5 text-sm leading-relaxed backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/70">Trusted workflow</div>
          <p className="mt-2 text-white/90">
            "Switched templates twice without losing a single bullet. The drag-and-drop editor is a game-changer."
          </p>
          <div className="mt-3 text-xs text-white/70">— Priya, Senior Engineer</div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white">RC</span>
            ResumeCraft Pro
          </Link>
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">{title}</h2>
            <p className="mt-2 text-sm text-ink-500">{subtitle}</p>
          </div>
          {children}
          <div className="mt-8 text-center text-sm text-ink-500">{footer}</div>
        </div>
      </div>
    </div>
  );
}
