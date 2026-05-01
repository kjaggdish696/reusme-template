import { Link } from "react-router-dom";

const BLOGS = [
  {
    title: "How to Make an ATS-Friendly Resume in 2026",
    date: "May 1, 2026",
    readTime: "6 min read",
    body:
      "An ATS-friendly resume uses clear section titles, consistent formatting, and role-specific keywords from the job description. Keep layouts clean, avoid text-heavy graphics, and focus on measurable impact in each bullet point.",
  },
  {
    title: "Resume Summary vs Objective: Which One Gets More Interviews?",
    date: "May 1, 2026",
    readTime: "5 min read",
    body:
      "Most professionals benefit from a short summary that highlights years of experience, core skills, and top achievements. Objectives are useful for freshers or career switchers who need to show direction and intent.",
  },
  {
    title: "Top Resume Keywords Recruiters Search for in Tech Jobs",
    date: "May 1, 2026",
    readTime: "7 min read",
    body:
      "Recruiters search for specific skills, tools, and outcomes. Add keywords naturally across your summary, experience, and skills sections. Include technical stacks, ownership signals, and quantified results to improve discoverability.",
  },
  {
    title: "How to Write Resume Bullet Points That Show Impact",
    date: "May 1, 2026",
    readTime: "5 min read",
    body:
      "Use an action + context + result formula. Start with a strong verb, explain what you improved, and include numbers where possible. Impact-driven bullets help your resume stand out in recruiter scans and interviews.",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-ink-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
          ← Back to Nano Resume
        </Link>

        <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-8 shadow-soft">
          <div className="text-xs font-semibold uppercase tracking-widest text-brand-600">Nano Resume Blog</div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900">
            Resume Tips, Career Guides, and Job Search SEO Content
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">
            Learn how to build a better resume, optimize for ATS systems, and improve interview chances with practical
            writing frameworks.
          </p>

          <div className="mt-8 space-y-5">
            {BLOGS.map((blog) => (
              <article key={blog.title} className="rounded-2xl border border-ink-100 p-5">
                <h2 className="text-xl font-bold text-ink-900">{blog.title}</h2>
                <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">
                  {blog.date} · {blog.readTime}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{blog.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
