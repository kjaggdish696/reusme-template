import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ResumeMiniPreview from "../components/templates/ResumeMiniPreview";
import { makeSampleResume } from "../data/seed";
import type { Resume } from "../types/resume";

/** One cached demo resume per template id so previews stay stable across re-renders. */
const landingDemoCache = new Map<string, Resume>();
function landingDemoResume(templateId: string): Resume {
  if (!landingDemoCache.has(templateId)) {
    landingDemoCache.set(templateId, makeSampleResume(templateId));
  }
  return landingDemoCache.get(templateId)!;
}

const LANDING_LAYOUT_CARDS: {
  label: string;
  templateId: string;
  description: string;
}[] = [
  {
    label: "Modern",
    templateId: "aurora",
    description: "Sidebar + main column — great for skills-forward resumes.",
  },
  {
    label: "Classic",
    templateId: "standard",
    description: "Single column, ATS-friendly, recruiter-tested.",
  },
  {
    label: "Creative",
    templateId: "bloom",
    description: "Gradient header for bold first impressions.",
  },
  {
    label: "Minimal",
    templateId: "linen",
    description: "Serif typography and calm whitespace.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Floating Glass Header */}
      <div className="fixed left-0 right-0 top-4 z-50 mx-auto max-w-5xl px-4 sm:px-6">
        <header className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-glass backdrop-blur-md transition-all hover:bg-white/85 md:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-extrabold text-white shadow-pop transition-transform group-hover:scale-105">NR</span>
            <div className="hidden sm:block">
              <div className="text-base font-extrabold tracking-tight text-ink-900">Nano <span className="text-brand-600">Resume</span></div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-bold text-ink-600 md:flex">
            <a href="#features" className="transition-colors hover:text-brand-600">Features</a>
            <a href="#templates" className="transition-colors hover:text-brand-600">Templates</a>
            <a href="#pricing" className="transition-colors hover:text-brand-600">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-ink-700 transition-colors hover:bg-white/80 sm:block">
              Sign in
            </Link>
            <Link to="/register" className="rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white shadow-pop transition-all hover:scale-105 hover:bg-brand-600 hover:shadow-glow">
              Start Free
            </Link>
          </div>
        </header>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-32 lg:pb-24 lg:pt-40">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-700 shadow-soft"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" /> Loved by 25,000+ professionals
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="mt-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl"
            >
              The resume builder for people who care about the <span className="text-brand-600">details</span>.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600"
            >
              Pick a recruiter-tested template, fill in your story with our structured editor, watch the live preview, and export a print-perfect PDF in one click.
            </motion.p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-pop hover:bg-brand-700"
              >
                Build my resume — it's free
                <span aria-hidden>→</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-700 hover:border-ink-300"
              >
                I already have an account
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500">
              <span className="inline-flex items-center gap-2">✓ No credit card required</span>
              <span className="inline-flex items-center gap-2">✓ ATS-friendly</span>
              <span className="inline-flex items-center gap-2">✓ PDF & share link</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 hidden h-32 w-32 rounded-full bg-brand-200/60 blur-3xl lg:block" />
            <div className="absolute -right-10 bottom-0 hidden h-40 w-40 rounded-full bg-amber-200/60 blur-3xl lg:block" />
            <ResumePreviewCard />
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Everything you need</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            A premium editor, without the fuss.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-lg">
                {feat.icon}
              </div>
              <div className="text-base font-semibold text-ink-900">{feat.title}</div>
              <p className="mt-1 text-sm text-ink-600">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Templates</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Four hand-crafted layouts. Switch any time, never lose a word.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_LAYOUT_CARDS.map((t) => (
            <Link
              key={t.templateId}
              to="/register"
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-pop"
            >
              <div className="relative h-52 w-full shrink-0 overflow-hidden bg-ink-100">
                <ResumeMiniPreview resume={landingDemoResume(t.templateId)} />
              </div>
              <div className="border-t border-ink-100 p-4">
                <div className="text-sm font-bold text-ink-900">{t.label}</div>
                <p className="mt-1 text-xs leading-relaxed text-ink-600">{t.description}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:gap-2">
                  Get started free
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-600 p-10 text-white shadow-pop">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                100% Free while we are in Beta.
              </h2>
              <p className="mt-3 max-w-xl text-base text-white/85">
                All premium features, including all templates and shareable links, are currently free to use. No credit card, no subscription, no catch.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:bg-white/90"
              >
                Create your free account →
              </Link>
            </div>
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-sm uppercase tracking-widest text-white/70">Beta Access</div>
              <div className="mt-1 text-4xl font-extrabold">Free <span className="text-base font-medium opacity-70">for now</span></div>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2">✓ All premium templates</li>
                <li className="flex gap-2">✓ Public share links</li>
                <li className="flex gap-2">✓ Unlimited PDF exports</li>
                <li className="flex gap-2">✓ No watermarks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink-500 sm:flex-row">
        <span>© {new Date().getFullYear()} Nano Resume · Built with care</span>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-ink-700">Privacy</a>
          <a href="#" className="hover:text-ink-700">Terms</a>
          <a href="#" className="hover:text-ink-700">Contact</a>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: "🧱", title: "Structured editor", desc: "Per-section forms for experience, education, skills, projects, certifications and more." },
  { icon: "🪄", title: "Live preview", desc: "Every keystroke reflects in the print-perfect A4 preview, with zoom controls." },
  { icon: "🔁", title: "Drag & drop", desc: "Reorder sections and items with smooth, accessible drag-and-drop." },
  { icon: "🎨", title: "Customize design", desc: "Fonts, accent color, spacing, sizing, and per-section visibility toggles." },
  { icon: "📄", title: "PDF export", desc: "One-click PDF that matches your screen exactly, ready for ATS scanners." },
  { icon: "💾", title: "Auto-save & history", desc: "Cloud auto-save, with full undo/redo so you never lose work." },
];

function ResumePreviewCard() {
  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-3 shadow-pop">
      <div className="flex items-center justify-between rounded-2xl bg-ink-50 px-4 py-2 text-xs text-ink-500">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live preview · auto-saved
        </span>
        <span className="font-mono">A4 · 100%</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl bg-brand-700 p-4 text-white">
          <div className="text-[10px] uppercase tracking-widest opacity-70">Jagdish Kumar</div>
          <div className="text-base font-bold">Sr. Data Scientist</div>
          <div className="mt-3 space-y-1 text-[11px] opacity-90">
            <div>jagdish@datasci.io</div>
            <div>+91 98765 43210</div>
            <div>Mumbai, India</div>
          </div>
          <div className="mt-4 text-[10px] uppercase tracking-widest opacity-70">Skills</div>
          <div className="mt-2 space-y-2 text-[11px]">
            {[
              { l: "Machine Learning", v: 95 },
              { l: "Python / PyTorch", v: 90 },
              { l: "SQL / Spark", v: 95 },
              { l: "NLP", v: 80 },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex justify-between">
                  <span>{s.l}</span>
                  <span className="opacity-70">{s.v}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full rounded-full bg-white" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 p-2">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-700">Summary</div>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-700">
              7+ years building production-grade ML. Led a recommendations engine redesign at Flipkart that lifted CTR 18%.
            </p>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-700">Experience</div>
            <div className="mt-1 text-[11px]">
              <div className="flex justify-between font-semibold text-ink-900">
                <span>Senior Data Scientist · Flipkart</span>
                <span className="text-ink-400">2022 – Present</span>
              </div>
              <ul className="mt-1 list-disc pl-4 text-ink-600">
                <li>Real-time recommendation engine for 45M+ users.</li>
                <li>Architected scalable feature store in 3 days.</li>
              </ul>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-700">Education</div>
            <div className="mt-1 text-[11px] text-ink-700">
              <div className="flex justify-between font-semibold text-ink-900">
                <span>IIT Madras · M.Tech Data Science</span>
                <span className="text-ink-400">2016 – 2018</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
