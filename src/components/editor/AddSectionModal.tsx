import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionType } from "../../types/resume";
import { SECTION_LABELS } from "../../data/sectionFactories";
import { cn } from "../../lib/classnames";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (type: SectionType) => void;
  existingTypes: Set<SectionType>;
}

interface SectionSpec {
  type: SectionType;
  preview: React.ReactNode;
  premium?: boolean;
}

const SECTIONS: SectionSpec[] = [
  { type: "summary", preview: <SummaryPreview /> },
  { type: "experience", preview: <ExperiencePreview /> },
  { type: "volunteering", preview: <VolunteeringPreview /> },
  { type: "education", preview: <EducationPreview /> },
  { type: "skills", preview: <SkillsPreview /> },
  { type: "projects", preview: <ProjectsPreview /> },
  { type: "certifications", preview: <CertificationsPreview /> },
  { type: "achievements", preview: <AchievementsPreview /> },
  { type: "strengths", preview: <StrengthsPreview /> },
  { type: "languages", preview: <LanguagesPreview /> },
  { type: "courses", preview: <CoursesPreview /> },
  { type: "websites", preview: <WebsitesPreview /> },
  { type: "awards", preview: <AwardsPreview /> },
  { type: "references", preview: <ReferencesPreview /> },
  { type: "quote", preview: <QuotePreview /> },
  { type: "interests", preview: <InterestsPreview /> },
  { type: "books", preview: <BooksPreview /> },
  { type: "publications", preview: <PublicationsPreview /> },
  { type: "photos", preview: <PhotosPreview /> },
  { type: "timeChart", preview: <TimeChartPreview /> },
  { type: "signature", preview: <SignaturePreview /> },
  { type: "custom", preview: <CustomPreview /> },
];

export default function AddSectionModal({ open, onClose, onAdd, existingTypes }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const categories: { label: string; types: SectionType[]; color: string }[] = [
    { label: "Core Essentials", types: ["summary", "experience", "education", "skills"], color: "bg-blue-600" },
    { label: "Professional Extras", types: ["projects", "certifications", "achievements", "volunteering", "awards", "publications"], color: "bg-indigo-600" },
    { label: "Personal & Social", types: ["languages", "interests", "websites", "photos", "quote", "books"], color: "bg-rose-600" },
    { label: "Specific & Tools", types: ["courses", "timeChart", "signature", "references", "custom"], color: "bg-emerald-600" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-ink-950/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Add a new section"
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative overflow-hidden bg-brand-600 px-8 py-7 text-white">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black tracking-tight sm:text-2xl">Add a new section</h2>
                    <p className="mt-1 text-[13px] font-medium text-brand-100">
                      Bring your story to life with specialized content blocks
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white transition-all hover:bg-white hover:text-brand-700"
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Grid Content */}
              <div className="thin-scroll max-h-[calc(92vh-160px)] overflow-y-auto px-8 pb-16 pt-8">
                <div className="space-y-16">
                  {categories.map((cat) => (
                    <div key={cat.label} className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className={cn("h-8 px-4 flex items-center rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg", cat.color)}>
                          {cat.label}
                        </div>
                        <div className="h-px flex-1 bg-ink-100" />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {cat.types.map((type) => {
                          const spec = SECTIONS.find(s => s.type === type);
                          if (!spec) return null;
                          const used = existingTypes.has(spec.type) && (spec.type === "personal" || spec.type === "summary");
                          
                          return (
                            <button
                              key={spec.type}
                              type="button"
                              onClick={() => {
                                onAdd(spec.type);
                                onClose();
                              }}
                              className={cn(
                                "group relative flex flex-col overflow-hidden rounded-[1.5rem] border-2 bg-white p-1.5 text-left transition-all duration-500",
                                "hover:-translate-y-2 hover:shadow-2xl",
                                used ? "border-ink-100 opacity-60 cursor-not-allowed" : "border-ink-50 hover:border-brand-500"
                              )}
                              disabled={used}
                            >
                              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[1.25rem] bg-ink-50/50 p-4 transition-colors group-hover:bg-brand-50/10">
                                <div className="scale-[0.85] origin-top transition-transform duration-500 group-hover:scale-[0.9]">
                                  {spec.preview}
                                </div>
                                
                                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-600/0 transition-all duration-500 group-hover:bg-brand-600/90">
                                  <div className="translate-y-4 rounded-full bg-white px-6 py-2.5 text-[12px] font-black text-brand-700 opacity-0 shadow-2xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                    ADD THIS SECTION
                                  </div>
                                </div>
                                
                                {spec.premium && (
                                  <span className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[12px] shadow-sm" title="Premium style">
                                    ✨
                                  </span>
                                )}
                              </div>
                              
                              <div className="px-4 py-4">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-[14px] font-black text-ink-900 group-hover:text-brand-700 transition-colors">
                                    {SECTION_LABELS[spec.type]}
                                  </span>
                                  {used && (
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-black text-emerald-700 uppercase tracking-widest shadow-sm">
                                      Active
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ===== Mini visual previews (mock data, drawn with simple primitives) ===== */

function PreviewHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-ink-200 pb-1 text-[11px] font-bold tracking-widest text-ink-800">
      {children}
    </div>
  );
}

function Line({ width = "100%", thin }: { width?: string; thin?: boolean }) {
  return (
    <div
      className={cn("rounded-full", thin ? "h-1 bg-ink-100" : "h-1.5 bg-ink-100")}
      style={{ width }}
    />
  );
}

function SummaryPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>SUMMARY</PreviewHeading>
      <div className="space-y-1 pt-1">
        <Line width="100%" thin />
        <Line width="92%" thin />
        <Line width="78%" thin />
      </div>
    </div>
  );
}

function ExperiencePreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>EXPERIENCE</PreviewHeading>
      <div className="pt-1">
        <div className="text-[10.5px] font-bold text-ink-900">Deputy Finance Director</div>
        <div className="text-[9.5px] font-semibold text-brand-600">City of New York</div>
        <div className="text-[8.5px] text-ink-400">2013 – 2014 · New York, NY</div>
        <ul className="mt-1 list-disc space-y-0.5 pl-3 text-[8.5px] text-ink-600">
          <li>Oversaw financial analysis of 70 buildings.</li>
          <li>Anchored 6-person team with $3 billion plan.</li>
          <li>Co-created advisory committee.</li>
        </ul>
      </div>
    </div>
  );
}

function EducationPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>EDUCATION</PreviewHeading>
      <div className="pt-1">
        <div className="text-[10px] font-bold text-ink-900">Master of Business Administration</div>
        <div className="text-[9px] font-semibold text-brand-600">Columbia University</div>
        <div className="text-[8.5px] text-ink-400">2017</div>
      </div>
      <div>
        <div className="text-[10px] font-bold text-ink-900">B.S. Computer Science</div>
        <div className="text-[9px] font-semibold text-brand-600">Worcester Polytechnic Institute</div>
        <div className="text-[8.5px] text-ink-400">10/2010 – 06/2014</div>
      </div>
    </div>
  );
}

function SkillsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>SKILLS</PreviewHeading>
      <div className="text-[9.5px] font-semibold text-brand-600">Frontend</div>
      <div className="flex flex-wrap gap-1">
        {["ReactJS", "MongoDB", "Redis", "Angular 2", "TypeScript", "Gulp", "Webpack", "Node.js"].map((s) => (
          <span
            key={s}
            className="rounded-md border border-ink-200 px-1.5 py-0.5 text-[8.5px] font-semibold text-ink-700"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>PROJECTS</PreviewHeading>
      <div className="pt-1">
        <div className="text-[10.5px] font-bold text-ink-900">Polaris Design System</div>
        <div className="text-[9px] font-semibold text-brand-600">Figma · Tokens · Storybook</div>
        <ul className="mt-1 list-disc space-y-0.5 pl-3 text-[8.5px] text-ink-600">
          <li>80+ components across web and mobile.</li>
          <li>4k GitHub stars and featured publications.</li>
        </ul>
      </div>
    </div>
  );
}

function CertificationsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>CERTIFICATIONS</PreviewHeading>
      <div className="pt-1">
        <div className="text-[10px] font-bold text-ink-900">Google Analytics Individual Qualification</div>
        <div className="text-[9px] text-ink-500">Google</div>
      </div>
      <div>
        <div className="text-[10px] font-bold text-ink-900">Contextual Marketing</div>
        <div className="text-[9px] text-ink-500">Hubspot Academy</div>
      </div>
    </div>
  );
}

function AchievementsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>AWARDS</PreviewHeading>
      <ul className="space-y-1 pt-1">
        <li className="flex items-start gap-2">
          <span className="mt-0.5 text-amber-500">★</span>
          <div>
            <div className="text-[10px] font-bold text-ink-900">Dean's List</div>
            <div className="text-[8.5px] text-ink-500">Cornell School of Engineering</div>
          </div>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 text-emerald-600">⌑</span>
          <div>
            <div className="text-[10px] font-bold text-ink-900">Valedictorian</div>
            <div className="text-[8.5px] text-ink-500">South Boston High School</div>
          </div>
        </li>
      </ul>
    </div>
  );
}

function CustomPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>CUSTOM TITLE</PreviewHeading>
      <div className="space-y-1.5 pt-1">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 grid h-3.5 w-3.5 place-items-center rounded-full bg-brand-100 text-[8px] text-brand-700">i</span>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-ink-900">Inspired &amp; Challenged</div>
            <div className="text-[8.5px] text-ink-500">
              more than 1 million children to love science, nature, and engineering through #ScienceForAll
            </div>
          </div>
          <div className="text-[8px] text-ink-400">10/2014 – 06/2015</div>
        </div>
      </div>
    </div>
  );
}

function VolunteeringPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>VOLUNTEERING</PreviewHeading>
      <div className="pt-1">
        <div className="text-[10.5px] font-bold text-ink-900">Executive Member</div>
        <div className="text-[9.5px] font-semibold text-brand-600">AIESEC</div>
        <div className="text-[8.5px] text-ink-400">09/2014 – Present</div>
        <Line width="100%" thin />
      </div>
    </div>
  );
}

function LanguagesPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>LANGUAGES</PreviewHeading>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div>
          <div className="text-[10px] font-bold text-ink-900">English</div>
          <div className="text-[8.5px] text-ink-500">Native</div>
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={cn("h-1.5 w-1.5 rounded-full", i <= 5 ? "bg-brand-500" : "bg-ink-200")} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold text-ink-900">Spanish</div>
          <div className="text-[8.5px] text-ink-500">Advanced</div>
          <div className="mt-1 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={cn("h-1.5 w-1.5 rounded-full", i <= 4 ? "bg-brand-500" : "bg-ink-200")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>TRAINING / COURSES</PreviewHeading>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div>
          <div className="text-[10px] font-bold text-ink-900">Creative Writing</div>
          <Line width="90%" thin />
        </div>
        <div>
          <div className="text-[10px] font-bold text-ink-900">UX Research</div>
          <Line width="85%" thin />
        </div>
      </div>
    </div>
  );
}

function WebsitesPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>FIND ME ONLINE</PreviewHeading>
      <div className="space-y-1 pt-1 text-[9px]">
        <div className="flex items-center gap-1.5">
          <span className="text-brand-600">in</span>
          <span className="font-semibold text-ink-800">LinkedIn</span>
          <span className="text-ink-500">/username</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-brand-600">f</span>
          <span className="font-semibold text-ink-800">Facebook</span>
          <span className="text-ink-500">/username</span>
        </div>
      </div>
    </div>
  );
}

function AwardsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>AWARDS</PreviewHeading>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="flex gap-1">
          <span className="text-amber-500">🏅</span>
          <div>
            <div className="text-[10px] font-bold text-ink-900">Dean&apos;s List</div>
            <div className="text-[8.5px] text-ink-500">Cornell</div>
          </div>
        </div>
        <div className="flex gap-1">
          <span className="text-brand-500">🌐</span>
          <div>
            <div className="text-[10px] font-bold text-ink-900">Hackathon</div>
            <div className="text-[8.5px] text-ink-500">1st place</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReferencesPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>REFERENCES</PreviewHeading>
      <div className="grid grid-cols-2 gap-2 pt-1 text-[8.5px]">
        <div>
          <div className="font-bold text-ink-900">Jane Doe</div>
          <div className="text-ink-500">jane@co.com</div>
          <div className="text-ink-500">+1 555…</div>
        </div>
        <div>
          <div className="font-bold text-ink-900">John Smith</div>
          <div className="text-ink-500">john@co.com</div>
        </div>
      </div>
    </div>
  );
}

function QuotePreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>MY LIFE PHILOSOPHY</PreviewHeading>
      <div className="pt-1 text-[10px] font-semibold italic text-brand-600 leading-snug">“Be the change you wish to see in the world.”</div>
      <div className="text-right text-[8.5px] text-ink-500">— Attribution</div>
    </div>
  );
}

function InterestsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>INTERESTS</PreviewHeading>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="flex gap-1">
          <span className="text-rose-500">❤</span>
          <div>
            <div className="text-[10px] font-bold text-ink-900">TEDx</div>
            <Line width="80%" thin />
          </div>
        </div>
        <div className="flex gap-1">
          <span className="text-brand-500">👍</span>
          <div>
            <div className="text-[10px] font-bold text-ink-900">Espresso</div>
            <Line width="75%" thin />
          </div>
        </div>
      </div>
    </div>
  );
}

function BooksPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>BOOKS</PreviewHeading>
      <div className="flex justify-center gap-2 pt-1">
        <div className="h-14 w-10 rounded-sm bg-ink-200" />
        <div className="h-14 w-10 rounded-sm bg-ink-200" />
      </div>
    </div>
  );
}

function PublicationsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>PUBLICATIONS</PreviewHeading>
      <div className="pt-1">
        <div className="text-[10px] font-bold text-ink-900">Dublin 101</div>
        <div className="text-[9px] font-semibold text-brand-600">Dublin Globe</div>
        <div className="text-[8.5px] text-ink-400">📅 2020 · 🔗 link</div>
        <Line width="95%" thin />
      </div>
    </div>
  );
}

function PhotosPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>PHOTOS</PreviewHeading>
      <div className="grid grid-cols-3 gap-1 pt-1">
        <div className="aspect-square rounded-md bg-ink-200" />
        <div className="aspect-square rounded-md bg-ink-200" />
        <div className="aspect-square rounded-md bg-ink-200" />
      </div>
    </div>
  );
}

function previewTimeSlice(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
): string {
  const x0o = cx + rOuter * Math.cos(a0);
  const y0o = cy + rOuter * Math.sin(a0);
  const x1o = cx + rOuter * Math.cos(a1);
  const y1o = cy + rOuter * Math.sin(a1);
  const x0i = cx + rInner * Math.cos(a0);
  const y0i = cy + rInner * Math.sin(a0);
  const x1i = cx + rInner * Math.cos(a1);
  const y1i = cy + rInner * Math.sin(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0o} ${y0o} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rInner} ${rInner} 0 ${large} 0 ${x0i} ${y0i} Z`;
}

function TimeChartPreview() {
  const brand = "#4f46e5";
  const vb = 200;
  const cx = vb / 2;
  const cy = vb / 2;
  const rOuter = 68;
  const rInner = 40;
  const n = 4;
  const gapRad = (1.25 * Math.PI) / 180;
  const totalArc = Math.PI * 2 - n * gapRad;
  const seg = totalArc / n;
  let cursor = -Math.PI / 2;
  const slices: string[] = [];
  const mids: number[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = cursor;
    const a1 = cursor + seg;
    cursor = a1 + gapRad;
    mids.push((a0 + a1) / 2);
    slices.push(previewTimeSlice(cx, cy, rOuter, rInner, a0, a1));
  }
  const labelR = 90;
  const leaderOuter = rOuter + 1;
  const leaderInner = labelR - 10;
  const letterR = 8;

  return (
    <div className="space-y-1.5">
      <PreviewHeading>MY TIME</PreviewHeading>
      <div className="flex flex-col items-center gap-1.5 pt-1">
        <svg viewBox={`0 0 ${vb} ${vb}`} className="h-14 w-14 shrink-0" aria-hidden>
          {slices.map((d, i) => (
            <path key={i} d={d} fill={brand} />
          ))}
          <g stroke="#0f172a" strokeWidth={1} fill="none">
            {mids.map((mid, i) => {
              const x1 = cx + leaderOuter * Math.cos(mid);
              const y1 = cy + leaderOuter * Math.sin(mid);
              const x2 = cx + leaderInner * Math.cos(mid);
              const y2 = cy + leaderInner * Math.sin(mid);
              return <line key={i} x1={x2} y1={y2} x2={x1} y2={y1} />;
            })}
          </g>
          {mids.map((mid, i) => {
            const lx = cx + labelR * Math.cos(mid);
            const ly = cy + labelR * Math.sin(mid);
            const letter = String.fromCharCode(65 + i);
            return (
              <g key={i} transform={`translate(${lx},${ly})`}>
                <circle r={letterR} fill="#0f172a" />
                <text
                  x={0}
                  y={0}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  fontSize={10}
                  fontWeight={700}
                >
                  {letter}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="w-full space-y-0.5 text-[8px] text-ink-600">
          <div className="flex items-center gap-1">
            <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-ink-900 text-[7px] font-bold text-white">
              A
            </span>
            Designing
          </div>
          <div className="flex items-center gap-1">
            <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-ink-900 text-[7px] font-bold text-white">
              B
            </span>
            Learning
          </div>
        </div>
      </div>
    </div>
  );
}

function SignaturePreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>SIGNATURE</PreviewHeading>
      <div className="pt-2 font-['Segoe_Script',cursive] text-lg text-ink-700">Your Name</div>
    </div>
  );
}

function StrengthsPreview() {
  return (
    <div className="space-y-1.5">
      <PreviewHeading>STRENGTHS</PreviewHeading>
      <div className="flex gap-2 pt-1">
        <span className="text-brand-600">📈</span>
        <div>
          <div className="text-[10px] font-bold text-ink-900">Go-getter</div>
          <Line width="92%" thin />
        </div>
      </div>
    </div>
  );
}
