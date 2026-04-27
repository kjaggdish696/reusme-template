import { useState } from "react";
import type { ReactNode } from "react";
import type {
  AchievementItem,
  CertificationItem,
  ContactKey,
  EducationItem,
  ExperienceItem,
  PersonalInfo,
  PhotoShape,
  PhotoSize,
  ProjectItem,
  Resume,
  SkillChartStyle,
  SkillItem,
} from "../../types/resume";
import { useEditor } from "../../store/EditorContext";
import {
  newAchievement,
  newCertification,
  newEducation,
  newExperience,
  newProject,
  newSkill,
} from "../../data/sectionFactories";
import { cn } from "../../lib/classnames";
import EditableText from "./EditableText";
import { CompactRichTextToolbar } from "./InlineFormatToolbar";
import { ExtraSectionForms } from "./ExtraSectionForms";

interface Props {
  resume: Resume;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  /** When true, rich fields are read-only (e.g. global Preview mode). */
  readOnlyText?: boolean;
}

const CONTACT_FIELDS: { key: ContactKey; label: string; placeholder: string }[] = [
  { key: "email", label: "Email", placeholder: "your@email.com" },
  { key: "phone", label: "Phone", placeholder: "+1 555 000 0000" },
  { key: "location", label: "Location", placeholder: "City, Country" },
  { key: "website", label: "Website", placeholder: "your-site.com" },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/handle" },
  { key: "github", label: "GitHub", placeholder: "github.com/handle" },
];

export default function SectionDetails({
  resume,
  selectedSectionId,
  onSelectSection,
  readOnlyText = false,
}: Props) {
  const { dispatch } = useEditor();

  const section =
    resume.sections.find((s) => s.id === selectedSectionId) ??
    resume.sections.find((s) => s.type === "personal") ??
    resume.sections[0];

  if (!section) return <Empty>No section to edit.</Empty>;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Editing
        </p>
        <select
          value={section.id}
          onChange={(e) => onSelectSection(e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-2.5 py-2 text-[13px] font-semibold focus:border-brand-400 focus:outline-none"
        >
          {resume.sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <p className="mt-2 text-[11px] text-ink-500">
          Edit any field below — or click the text on the canvas for inline editing.
        </p>
      </div>

      {section.data.type === "personal" && (
        <PersonalDetails
          resumeId={resume.id}
          sectionId={section.id}
          personal={section.data.personal}
        />
      )}

      {section.data.type === "summary" && (
        <Card>
          <Label>Summary</Label>
          <p className="mb-1.5 text-[11px] text-ink-500">
            <strong>Format bar</strong> (below) matches the main canvas toolbar: bold, lists, link,
            indent. <strong>Shortcuts at line start:</strong> type <code className="rounded bg-ink-100 px-1">*</code> or{" "}
            <code className="rounded bg-ink-100 px-1">-</code> then <strong>Space</strong> for bullets, or{" "}
            <code className="rounded bg-ink-100 px-1">1.</code> / <code className="rounded bg-ink-100 px-1">1)</code> then{" "}
            <strong>Space</strong> for a numbered list. <strong>Ctrl/Cmd+B</strong> = bold. Same behavior on the
            resume canvas.
          </p>
          {!readOnlyText && <CompactRichTextToolbar />}
          <div className="min-h-[7rem] rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-[13px]">
            <EditableText
              as="div"
              richText
              multiline
              readOnly={readOnlyText}
              className="rcp-summary"
              value={section.data.summary}
              placeholder="Brief professional summary…"
              onCommit={(v) =>
                dispatch({
                  type: "UPDATE_SUMMARY",
                  resumeId: resume.id,
                  sectionId: section.id,
                  summary: v,
                })
              }
            />
          </div>
        </Card>
      )}

      {section.data.type === "custom" && (
        <Card>
          <Label>Content</Label>
          <p className="mb-1.5 text-[11px] text-ink-500">
            Same formatting as the canvas: toolbar below, or line-start <code className="rounded bg-ink-100 px-1">*</code>{" "}
            / <code className="rounded bg-ink-100 px-1">-</code> + Space, <code className="rounded bg-ink-100 px-1">1.</code> + Space, and
            <strong> Ctrl/Cmd+B</strong> for bold.
          </p>
          {!readOnlyText && <CompactRichTextToolbar />}
          <div className="min-h-[7rem] rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-[13px]">
            <EditableText
              as="div"
              richText
              multiline
              readOnly={readOnlyText}
              className="rcp-summary"
              value={section.data.content}
              placeholder="Languages, hobbies, publications…"
              onCommit={(v) =>
                dispatch({
                  type: "UPDATE_CUSTOM",
                  resumeId: resume.id,
                  sectionId: section.id,
                  content: v,
                })
              }
            />
          </div>
        </Card>
      )}

      {section.data.type === "skills" && (
        <SkillsDetails
          resumeId={resume.id}
          sectionId={section.id}
          skills={section.data.skills}
          chartStyle={section.data.chartStyle ?? "bars"}
          accent={resume.theme.accentColor}
        />
      )}

      {(section.data.type === "experience" || section.data.type === "volunteering") && (
        <ExperienceDetails
          resumeId={resume.id}
          sectionId={section.id}
          items={section.data.experiences}
          addLabel={section.data.type === "volunteering" ? "+ Add volunteer role" : "+ Add experience"}
          readOnly={readOnlyText}
        />
      )}

      {section.data.type === "education" && (
        <EducationDetails
          resumeId={resume.id}
          sectionId={section.id}
          items={section.data.education}
          readOnly={readOnlyText}
        />
      )}

      {section.data.type === "projects" && (
        <ProjectDetails
          resumeId={resume.id}
          sectionId={section.id}
          items={section.data.projects}
          readOnly={readOnlyText}
        />
      )}

      {section.data.type === "certifications" && (
        <CertificationDetails
          resumeId={resume.id}
          sectionId={section.id}
          items={section.data.certifications}
        />
      )}

      {section.data.type === "achievements" && (
        <AchievementDetails
          resumeId={resume.id}
          sectionId={section.id}
          items={section.data.achievements}
        />
      )}

      <ExtraSectionForms section={section} resumeId={resume.id} />

      {section.type !== "personal" && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <Label className="mb-0">Section visibility</Label>
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "TOGGLE_SECTION_VISIBILITY",
                  resumeId: resume.id,
                  sectionId: section.id,
                })
              }
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
                section.visible
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "bg-ink-100 text-ink-600 hover:bg-ink-200",
              )}
            >
              {section.visible ? "Visible · click to hide" : "Hidden · click to show"}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
 * Personal
 * ========================================================== */

/* ============================================================
 * PhotoEditor — lets user upload, swap, restyle, or remove the
 * profile photo from inside the Personal Details panel.
 * ========================================================== */

const PHOTO_SHAPES: { id: PhotoShape; label: string; preview: string }[] = [
  { id: "round", label: "Circle", preview: "50%" },
  { id: "rounded", label: "Rounded", preview: "20%" },
  { id: "square", label: "Square", preview: "0%" },
];

const PHOTO_SIZES: { id: PhotoSize; label: string; px: number }[] = [
  { id: "sm", label: "Small", px: 56 },
  { id: "md", label: "Medium", px: 80 },
  { id: "lg", label: "Large", px: 110 },
  { id: "xl", label: "X-Large", px: 140 },
];

const PHOTO_BORDER_PRESETS = ["", "#ffffff", "#1f2640", "#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

function PhotoEditor({
  personal,
  onChange,
}: {
  personal: PersonalInfo;
  onChange: (patch: Partial<PersonalInfo>) => void;
}) {
  const photo = personal.photo ?? { url: "", shape: "round" as PhotoShape, size: "md" as PhotoSize, border: "" };
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setPhoto(patch: Partial<typeof photo>) {
    onChange({ photo: { ...photo, ...patch } });
  }

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image is too large — please pick something under 4 MB.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const compressed = await compressImage(dataUrl, 720);
      setPhoto({ url: compressed });
    } catch (e) {
      console.error(e);
      setError("Could not read that image — try a different file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-4 max-w-full rounded-xl border border-ink-100 bg-ink-50/40 p-3">
      <div className="mb-2 flex min-w-0 items-center justify-between gap-2">
        <span className="min-w-0 text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Profile photo
        </span>
        {photo.url && (
          <button
            type="button"
            onClick={() => setPhoto({ url: "" })}
            className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <label
          className="group relative flex h-[84px] w-[84px] shrink-0 cursor-pointer items-center justify-center self-start overflow-hidden border-2 border-dashed border-ink-200 bg-white text-center text-[10px] font-semibold text-ink-500 transition hover:border-brand-400 hover:text-brand-600"
          style={{
            borderRadius:
              photo.shape === "round" ? "50%" : photo.shape === "rounded" ? "16%" : "6%",
          }}
          title={photo.url ? "Replace photo" : "Upload photo"}
        >
          {photo.url ? (
            <img src={photo.url} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 leading-tight">{busy ? "Uploading…" : "Click to\nupload"}</span>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
              e.target.value = "";
            }}
          />
        </label>

        <div className="min-w-0 w-full space-y-2">
          <div className="min-w-0">
            <Label>Shape</Label>
            <div className="mt-1 grid min-w-0 grid-cols-3 gap-1">
              {PHOTO_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPhoto({ shape: s.id })}
                  className={cn(
                    "flex min-w-0 w-full flex-col items-center gap-1 rounded-md border px-1 py-1.5 text-center text-[10px] font-semibold leading-tight transition",
                    photo.shape === s.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 bg-white text-ink-600 hover:border-ink-300",
                  )}
                >
                  <span
                    className="block bg-ink-300"
                    style={{ width: 18, height: 18, borderRadius: s.preview }}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <Label>Size</Label>
            <div className="mt-1 grid min-w-0 grid-cols-2 gap-1">
              {PHOTO_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPhoto({ size: s.id })}
                  className={cn(
                    "min-w-0 rounded-md border px-1 py-1.5 text-center text-[10px] font-semibold leading-tight transition",
                    photo.size === s.id
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-ink-200 bg-white text-ink-600 hover:border-ink-300",
                  )}
                  title={`${s.px}px`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <Label>Border ring</Label>
            <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
              {PHOTO_BORDER_PRESETS.map((c) => (
                <button
                  key={c || "none"}
                  type="button"
                  onClick={() => setPhoto({ border: c })}
                  title={c || "No border"}
                  className={cn(
                    "h-6 w-6 rounded-full border transition",
                    photo.border === c
                      ? "ring-2 ring-brand-400 ring-offset-1"
                      : "ring-0 hover:scale-110",
                  )}
                  style={{
                    background: c || "repeating-linear-gradient(45deg,#fff,#fff 4px,#e5e7eb 4px,#e5e7eb 8px)",
                    borderColor: "#cbd5e1",
                  }}
                />
              ))}
              <input
                type="color"
                value={photo.border || "#000000"}
                onChange={(e) => setPhoto({ border: e.target.value })}
                className="h-6 w-7 cursor-pointer rounded border border-ink-200 bg-transparent"
                title="Custom border color"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-[11px] font-semibold text-rose-600">{error}</p>}
      {!photo.url && !error && (
        <p className="mt-2 text-[11px] text-ink-500">
          Upload a square portrait for best results. PNG / JPG / WebP, up to 4 MB.
        </p>
      )}
    </div>
  );
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function compressImage(dataUrl: string, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function PersonalDetails({
  resumeId,
  sectionId,
  personal,
}: {
  resumeId: string;
  sectionId: string;
  personal: PersonalInfo;
}) {
  const { dispatch } = useEditor();
  const hidden = new Set<ContactKey>(personal.hiddenContacts ?? []);

  function update(patch: Partial<PersonalInfo>) {
    dispatch({ type: "UPDATE_PERSONAL", resumeId, sectionId, personal: patch });
  }
  function toggle(key: ContactKey) {
    if (hidden.has(key)) {
      update({
        hiddenContacts: (personal.hiddenContacts ?? []).filter((k) => k !== key),
      });
    } else {
      update({
        hiddenContacts: Array.from(new Set([...(personal.hiddenContacts ?? []), key])),
      });
    }
  }

  return (
    <Card>
      <PhotoEditor personal={personal} onChange={update} />
      <Label>Identity</Label>
      <div className="space-y-2">
        <Field
          label="Full name"
          value={personal.fullName}
          onChange={(v) => update({ fullName: v })}
          placeholder="Aanya Sharma"
        />
        <Field
          label="Role / Headline"
          value={personal.role}
          onChange={(v) => update({ role: v })}
          placeholder="Senior Product Designer"
        />
      </div>
      <div className="mt-4">
        <Label>Contact fields</Label>
        <p className="mb-2 text-[11px] text-ink-500">
          Toggle any field to hide it from the resume — for example, hide GitHub if you
          don&apos;t have one.
        </p>
        <div className="space-y-2">
          {CONTACT_FIELDS.map((f) => {
            const isHidden = hidden.has(f.key);
            return (
              <div
                key={f.key}
                className={cn(
                  "rounded-lg border p-2 transition",
                  isHidden ? "border-ink-100 bg-ink-50/50" : "border-ink-100 bg-white",
                )}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-ink-700">{f.label}</span>
                  <button
                    type="button"
                    onClick={() => toggle(f.key)}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-bold transition",
                      isHidden
                        ? "bg-ink-200 text-ink-600 hover:bg-ink-300"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                    )}
                    title={
                      isHidden
                        ? "Show this field on the resume"
                        : "Hide this field from the resume"
                    }
                  >
                    {isHidden ? "Show" : "Hide"}
                  </button>
                </div>
                <input
                  type="text"
                  value={personal[f.key] ?? ""}
                  onChange={(e) =>
                    update({ [f.key]: e.target.value } as Partial<PersonalInfo>)
                  }
                  placeholder={f.placeholder}
                  disabled={isHidden}
                  className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12.5px] outline-none focus:border-brand-300 disabled:opacity-50"
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
 * Skills
 * ========================================================== */

function SkillsDetails({
  resumeId,
  sectionId,
  skills,
  chartStyle,
  accent,
}: {
  resumeId: string;
  sectionId: string;
  skills: SkillItem[];
  chartStyle: SkillChartStyle;
  accent: string;
}) {
  const { dispatch } = useEditor();
  return (
    <Card>
      <Label>Visualization</Label>
      <div className="grid grid-cols-4 gap-1.5">
        {(["bars", "donut", "dots", "tags"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() =>
              dispatch({ type: "SET_SKILLS_CHART", resumeId, sectionId, chartStyle: s })
            }
            className={cn(
              "rounded-lg border px-2 py-2 text-[11.5px] font-semibold capitalize transition",
              chartStyle === s
                ? "border-brand-400 bg-brand-50 text-brand-700"
                : "border-ink-100 hover:border-ink-300",
            )}
          >
            {s === "donut" ? "Pie" : s}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <Label>Skills</Label>
        <ul className="space-y-1.5">
          {skills.map((sk) => (
            <li key={sk.id} className="rounded-lg border border-ink-100 bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sk.name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_SKILL",
                      resumeId,
                      sectionId,
                      itemId: sk.id,
                      patch: { name: e.target.value },
                    })
                  }
                  className="flex-1 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12.5px] outline-none focus:border-brand-300"
                  placeholder="Skill"
                />
                <input
                  type="text"
                  value={sk.category}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_SKILL",
                      resumeId,
                      sectionId,
                      itemId: sk.id,
                      patch: { category: e.target.value },
                    })
                  }
                  className="w-24 rounded-md border border-ink-100 bg-ink-50/50 px-1.5 py-0.5 text-[10.5px] text-ink-600 outline-none focus:border-brand-300"
                  placeholder="Category"
                  title="Skill category / group"
                />
                <RemoveBtn
                  onClick={() =>
                    dispatch({ type: "REMOVE_SKILL", resumeId, sectionId, itemId: sk.id })
                  }
                />
              </div>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "UPDATE_SKILL",
                        resumeId,
                        sectionId,
                        itemId: sk.id,
                        patch: { level: lv as 1 | 2 | 3 | 4 | 5 },
                      })
                    }
                    className="h-2 flex-1 rounded-full transition"
                    style={{ background: sk.level >= lv ? accent : "#e5e7ef" }}
                    aria-label={`Level ${lv}`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
        <AddRowBtn
          label="+ Add skill"
          onClick={() =>
            dispatch({ type: "ADD_SKILL", resumeId, sectionId, item: newSkill() })
          }
        />
      </div>
    </Card>
  );
}

/* ============================================================
 * Experience
 * ========================================================== */

function ExperienceDetails({
  resumeId,
  sectionId,
  items,
  addLabel = "+ Add experience",
  readOnly = false,
}: {
  resumeId: string;
  sectionId: string;
  items: ExperienceItem[];
  addLabel?: string;
  readOnly?: boolean;
}) {
  const { dispatch } = useEditor();
  function update(itemId: string, patch: Partial<ExperienceItem>) {
    dispatch({ type: "UPDATE_EXPERIENCE", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_EXPERIENCE", resumeId, sectionId, itemId });
  }
  function reorder(from: number, to: number) {
    dispatch({ type: "REORDER_EXPERIENCES", resumeId, sectionId, from, to });
  }
  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="rounded-lg border border-ink-100 bg-ink-50/50 p-2">
          <p className="mb-2 text-[10px] leading-snug text-ink-500">
            In <strong>Highlights</strong>, click a bullet then use <strong>Format</strong> or{" "}
            <kbd className="rounded bg-white px-1 font-mono text-[10px]">Ctrl+B</kbd> for bold (same as the
            canvas).
          </p>
          <CompactRichTextToolbar />
        </div>
      )}
      {items.map((it, idx) => (
        <EntryCard
          key={it.id}
          title={it.position || it.company || "Untitled role"}
          subtitle={it.company}
          index={idx}
          total={items.length}
          onMoveUp={() => idx > 0 && reorder(idx, idx - 1)}
          onMoveDown={() => idx < items.length - 1 && reorder(idx, idx + 1)}
          onRemove={() => remove(it.id)}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field
              label="Position"
              value={it.position}
              onChange={(v) => update(it.id, { position: v })}
              placeholder="Senior Product Designer"
            />
            <Field
              label="Company"
              value={it.company}
              onChange={(v) => update(it.id, { company: v })}
              placeholder="Acme Inc."
            />
            <Field
              label="Location"
              value={it.location}
              onChange={(v) => update(it.id, { location: v })}
              placeholder="Remote · Bengaluru"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Start"
                value={it.startDate}
                onChange={(v) => update(it.id, { startDate: v })}
                placeholder="Jan 2022"
              />
              <Field
                label="End"
                value={it.endDate}
                onChange={(v) => update(it.id, { endDate: v })}
                placeholder={it.current ? "Present" : "Mar 2024"}
                disabled={it.current}
              />
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-[12px] text-ink-700">
            <input
              type="checkbox"
              checked={it.current}
              onChange={(e) => update(it.id, { current: e.target.checked, endDate: e.target.checked ? "" : it.endDate })}
              className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-300"
            />
            I currently work here
          </label>

          <BulletList
            label="Highlights"
            bullets={it.bullets}
            onChange={(bullets) => update(it.id, { bullets })}
            placeholder="Designed onboarding that lifted activation 23%."
            readOnly={readOnly}
          />
        </EntryCard>
      ))}
      <AddEntryBtn
        label={addLabel}
        onClick={() =>
          dispatch({
            type: "ADD_EXPERIENCE",
            resumeId,
            sectionId,
            item: newExperience(),
          })
        }
      />
    </div>
  );
}

/* ============================================================
 * Education
 * ========================================================== */

function EducationDetails({
  resumeId,
  sectionId,
  items,
  readOnly = false,
}: {
  resumeId: string;
  sectionId: string;
  items: EducationItem[];
  readOnly?: boolean;
}) {
  const { dispatch } = useEditor();
  function update(itemId: string, patch: Partial<EducationItem>) {
    dispatch({ type: "UPDATE_EDUCATION", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_EDUCATION", resumeId, sectionId, itemId });
  }
  function reorder(from: number, to: number) {
    dispatch({ type: "REORDER_EDUCATION", resumeId, sectionId, from, to });
  }
  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="rounded-lg border border-ink-100 bg-ink-50/50 p-2">
          <p className="mb-2 text-[10px] leading-snug text-ink-500">
            For <strong>Coursework / honors</strong> bullets, select text then use <strong>Format</strong> or{" "}
            <kbd className="rounded bg-white px-1 font-mono text-[10px]">Ctrl+B</kbd>.
          </p>
          <CompactRichTextToolbar />
        </div>
      )}
      {items.map((it, idx) => (
        <EntryCard
          key={it.id}
          title={it.degree || it.institution || "New education"}
          subtitle={it.institution}
          index={idx}
          total={items.length}
          onMoveUp={() => idx > 0 && reorder(idx, idx - 1)}
          onMoveDown={() => idx < items.length - 1 && reorder(idx, idx + 1)}
          onRemove={() => remove(it.id)}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field
              label="Degree"
              value={it.degree}
              onChange={(v) => update(it.id, { degree: v })}
              placeholder="B.Tech"
            />
            <Field
              label="Field of study"
              value={it.field}
              onChange={(v) => update(it.id, { field: v })}
              placeholder="Computer Science"
            />
            <Field
              label="Institution"
              value={it.institution}
              onChange={(v) => update(it.id, { institution: v })}
              placeholder="IIT Bombay"
            />
            <Field
              label="Grade"
              value={it.grade}
              onChange={(v) => update(it.id, { grade: v })}
              placeholder="9.1 CGPA"
            />
            <Field
              label="Start"
              value={it.startDate}
              onChange={(v) => update(it.id, { startDate: v })}
              placeholder="2018"
            />
            <Field
              label="End"
              value={it.endDate}
              onChange={(v) => update(it.id, { endDate: v })}
              placeholder="2022"
            />
          </div>

          <BulletList
            label="Coursework / honors"
            bullets={it.bullets}
            onChange={(bullets) => update(it.id, { bullets })}
            placeholder="Dean's list · Research assistant in HCI lab"
            readOnly={readOnly}
          />
        </EntryCard>
      ))}
      <AddEntryBtn
        label="+ Add education"
        onClick={() =>
          dispatch({ type: "ADD_EDUCATION", resumeId, sectionId, item: newEducation() })
        }
      />
    </div>
  );
}

/* ============================================================
 * Projects
 * ========================================================== */

function ProjectDetails({
  resumeId,
  sectionId,
  items,
  readOnly = false,
}: {
  resumeId: string;
  sectionId: string;
  items: ProjectItem[];
  readOnly?: boolean;
}) {
  const { dispatch } = useEditor();
  function update(itemId: string, patch: Partial<ProjectItem>) {
    dispatch({ type: "UPDATE_PROJECT", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_PROJECT", resumeId, sectionId, itemId });
  }
  function reorder(from: number, to: number) {
    dispatch({ type: "REORDER_PROJECTS", resumeId, sectionId, from, to });
  }
  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="rounded-lg border border-ink-100 bg-ink-50/50 p-2">
          <p className="mb-2 text-[10px] leading-snug text-ink-500">
            In <strong>Highlights</strong>, select text then use <strong>Format</strong> or{" "}
            <kbd className="rounded bg-white px-1 font-mono text-[10px]">Ctrl+B</kbd>.
          </p>
          <CompactRichTextToolbar />
        </div>
      )}
      {items.map((it, idx) => (
        <EntryCard
          key={it.id}
          title={it.name || "New project"}
          subtitle={it.techStack}
          index={idx}
          total={items.length}
          onMoveUp={() => idx > 0 && reorder(idx, idx - 1)}
          onMoveDown={() => idx < items.length - 1 && reorder(idx, idx + 1)}
          onRemove={() => remove(it.id)}
        >
          <Field
            label="Project name"
            value={it.name}
            onChange={(v) => update(it.id, { name: v })}
            placeholder="Polaris Design System"
          />
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field
              label="Link"
              value={it.link}
              onChange={(v) => update(it.id, { link: v })}
              placeholder="https://github.com/you/polaris"
            />
            <Field
              label="Tech stack"
              value={it.techStack}
              onChange={(v) => update(it.id, { techStack: v })}
              placeholder="React · Tokens · Storybook"
            />
          </div>

          <BulletList
            label="Highlights"
            bullets={it.bullets}
            onChange={(bullets) => update(it.id, { bullets })}
            placeholder="80+ components shipped across web and mobile."
            readOnly={readOnly}
          />
        </EntryCard>
      ))}
      <AddEntryBtn
        label="+ Add project"
        onClick={() =>
          dispatch({ type: "ADD_PROJECT", resumeId, sectionId, item: newProject() })
        }
      />
    </div>
  );
}

/* ============================================================
 * Certifications
 * ========================================================== */

function CertificationDetails({
  resumeId,
  sectionId,
  items,
}: {
  resumeId: string;
  sectionId: string;
  items: CertificationItem[];
}) {
  const { dispatch } = useEditor();
  function update(itemId: string, patch: Partial<CertificationItem>) {
    dispatch({ type: "UPDATE_CERTIFICATION", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_CERTIFICATION", resumeId, sectionId, itemId });
  }
  function reorder(from: number, to: number) {
    dispatch({ type: "REORDER_CERTIFICATIONS", resumeId, sectionId, from, to });
  }
  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <EntryCard
          key={it.id}
          title={it.name || "New certification"}
          subtitle={it.issuer}
          index={idx}
          total={items.length}
          onMoveUp={() => idx > 0 && reorder(idx, idx - 1)}
          onMoveDown={() => idx < items.length - 1 && reorder(idx, idx + 1)}
          onRemove={() => remove(it.id)}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field
              label="Name"
              value={it.name}
              onChange={(v) => update(it.id, { name: v })}
              placeholder="AWS Solutions Architect"
            />
            <Field
              label="Issuer"
              value={it.issuer}
              onChange={(v) => update(it.id, { issuer: v })}
              placeholder="Amazon Web Services"
            />
            <Field
              label="Date"
              value={it.date}
              onChange={(v) => update(it.id, { date: v })}
              placeholder="Mar 2024"
            />
            <Field
              label="Link"
              value={it.link}
              onChange={(v) => update(it.id, { link: v })}
              placeholder="credly.com/…"
            />
          </div>
        </EntryCard>
      ))}
      <AddEntryBtn
        label="+ Add certification"
        onClick={() =>
          dispatch({
            type: "ADD_CERTIFICATION",
            resumeId,
            sectionId,
            item: newCertification(),
          })
        }
      />
    </div>
  );
}

/* ============================================================
 * Achievements
 * ========================================================== */

function AchievementDetails({
  resumeId,
  sectionId,
  items,
}: {
  resumeId: string;
  sectionId: string;
  items: AchievementItem[];
}) {
  const { dispatch } = useEditor();
  function update(itemId: string, patch: Partial<AchievementItem>) {
    dispatch({ type: "UPDATE_ACHIEVEMENT", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_ACHIEVEMENT", resumeId, sectionId, itemId });
  }
  function reorder(from: number, to: number) {
    dispatch({ type: "REORDER_ACHIEVEMENTS", resumeId, sectionId, from, to });
  }
  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <EntryCard
          key={it.id}
          title={it.title || "New achievement"}
          index={idx}
          total={items.length}
          onMoveUp={() => idx > 0 && reorder(idx, idx - 1)}
          onMoveDown={() => idx < items.length - 1 && reorder(idx, idx + 1)}
          onRemove={() => remove(it.id)}
        >
          <Field
            label="Title"
            value={it.title}
            onChange={(v) => update(it.id, { title: v })}
            placeholder="Hackathon — 1st place"
          />
          <Field
            label="Icon (emoji, optional)"
            value={it.icon ?? ""}
            onChange={(v) => update(it.id, { icon: v })}
            placeholder="◆ or 🏆"
          />
          <div className="mt-2">
            <Label>Description</Label>
            <textarea
              value={it.description}
              onChange={(e) => update(it.id, { description: e.target.value })}
              rows={3}
              placeholder="Built a real-time multiplayer trivia app in 24 hours."
              className="w-full resize-y rounded-lg border border-ink-200 px-3 py-2 text-[12.5px] outline-none focus:border-brand-400"
            />
          </div>
        </EntryCard>
      ))}
      <AddEntryBtn
        label="+ Add achievement"
        onClick={() =>
          dispatch({
            type: "ADD_ACHIEVEMENT",
            resumeId,
            sectionId,
            item: newAchievement(),
          })
        }
      />
    </div>
  );
}

/* ============================================================
 * Reusable bits
 * ========================================================== */

function BulletList({
  label,
  bullets,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string;
  bullets: string[];
  onChange: (bullets: string[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  function add() {
    onChange([...bullets, ""]);
  }
  function update(i: number, v: string) {
    onChange(bullets.map((b, idx) => (idx === i ? v : b)));
  }
  function remove(i: number) {
    onChange(bullets.filter((_, idx) => idx !== i));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= bullets.length) return;
    const next = [...bullets];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="mt-3">
      <Label>{label}</Label>
      {bullets.length === 0 && (
        <p className="mb-2 text-[11px] italic text-ink-400">No bullets yet.</p>
      )}
      <ul className="space-y-1.5">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="group flex items-start gap-1.5 rounded-lg border border-ink-100 bg-white px-2 py-1.5"
          >
            <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-500" />
            <EditableText
              richText
              as="div"
              readOnly={readOnly}
              className="rcp-bullet-rich min-h-[22px] flex-1 border-none bg-transparent px-0.5 py-0 text-[12.5px] leading-snug text-ink-800 outline-none"
              value={b}
              placeholder={placeholder}
              onCommit={(v) => update(i, v)}
              onEnter={add}
              onBackspaceEmpty={() => {
                if (bullets.length > 1) remove(i);
              }}
            />
            {!readOnly && (
              <div className="flex flex-none items-center gap-0.5">
                <IconBtn title="Move up" disabled={i === 0} onClick={() => move(i, -1)}>
                  ▲
                </IconBtn>
                <IconBtn
                  title="Move down"
                  disabled={i === bullets.length - 1}
                  onClick={() => move(i, 1)}
                >
                  ▼
                </IconBtn>
                <IconBtn title="Remove bullet" onClick={() => remove(i)} danger>
                  ✕
                </IconBtn>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!readOnly && <AddRowBtn label="+ Add bullet" onClick={add} />}
    </div>
  );
}

function EntryCard({
  title,
  subtitle,
  index,
  total,
  children,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  title: string;
  subtitle?: string;
  index: number;
  total: number;
  children: ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-soft">
      <div className="flex items-center gap-1.5 border-b border-ink-50 bg-ink-50/40 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left"
          title={open ? "Collapse" : "Expand"}
        >
          <span
            className={cn(
              "inline-block text-[10px] text-ink-400 transition-transform",
              open ? "rotate-90" : "",
            )}
          >
            ▶
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12.5px] font-bold text-ink-900">{title}</div>
            {subtitle && (
              <div className="truncate text-[10.5px] text-ink-500">{subtitle}</div>
            )}
          </div>
        </button>
        <IconBtn title="Move up" disabled={index === 0} onClick={onMoveUp}>
          ▲
        </IconBtn>
        <IconBtn title="Move down" disabled={index === total - 1} onClick={onMoveDown}>
          ▼
        </IconBtn>
        <IconBtn title="Remove" onClick={onRemove} danger>
          ✕
        </IconBtn>
      </div>
      {open && <div className="p-3">{children}</div>}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-3 shadow-soft">{children}</div>
  );
}

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink-500",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-[12.5px] outline-none transition focus:border-brand-400",
          disabled && "opacity-50",
        )}
      />
    </label>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
  danger,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "grid h-6 w-6 place-items-center rounded text-[10px] text-ink-500 transition",
        "hover:bg-ink-100 hover:text-ink-700 disabled:cursor-not-allowed disabled:opacity-30",
        danger && "hover:bg-red-50 hover:text-red-600",
      )}
    >
      {children}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Remove"
      className="grid h-6 w-6 flex-none place-items-center rounded text-[10px] text-ink-400 transition hover:bg-red-50 hover:text-red-600"
    >
      ✕
    </button>
  );
}

function AddRowBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 w-full rounded-lg border border-dashed border-brand-300 bg-brand-50/60 px-3 py-1.5 text-[11.5px] font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
    >
      {label}
    </button>
  );
}

function AddEntryBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-brand-300 bg-brand-50/40 px-3 py-2.5 text-[12.5px] font-bold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
    >
      {label}
    </button>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-ink-500">{children}</p>;
}
