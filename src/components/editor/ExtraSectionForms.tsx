import type { CourseOptionalFieldKey, ResumeSection } from "../../types/resume";
import { useEditor } from "../../store/EditorContext";
import {
  newAward,
  newBook,
  newCourse,
  newGalleryPhoto,
  newInterest,
  newLanguage,
  newPublication,
  newReference,
  newTimeSegment,
  newWebsite,
  newAchievement,
} from "../../data/sectionFactories";
import { cn } from "../../lib/classnames";

export function ExtraSectionForms({ section, resumeId }: { section: ResumeSection; resumeId: string }) {
  const { dispatch } = useEditor();
  const sid = section.id;

  function Card({ children }: { children: React.ReactNode }) {
    return <div className="rounded-xl border border-ink-100 bg-white p-3 space-y-3">{children}</div>;
  }
  function Label({ children }: { children: React.ReactNode }) {
    return <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">{children}</p>;
  }
  function Field({
    label,
    value,
    onChange,
    placeholder,
    multiline,
    disabled,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    multiline?: boolean;
    disabled?: boolean;
  }) {
    const fieldClass =
      "w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-[12.5px] outline-none focus:border-brand-400 disabled:opacity-50";
    return (
      <label className="block">
        <span className="mb-0.5 block text-[10.5px] font-semibold uppercase tracking-wider text-ink-500">
          {label}
        </span>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            disabled={disabled}
            className={fieldClass}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={fieldClass}
          />
        )}
      </label>
    );
  }

  switch (section.data.type) {
    case "languages": {
      const { languages } = section.data;
      const commitLanguages = (next: typeof languages) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "languages", languages: next } });
      };
      return (
        <Card>
          <Label>Languages</Label>
          {languages.map((lang) => (
            <div key={lang.id} className="rounded-lg border border-ink-100 p-2 space-y-2">
              <Field label="Language" value={lang.name} onChange={(v) => commitLanguages(languages.map((l) => (l.id === lang.id ? { ...l, name: v } : l)))} />
              <Field
                label="Proficiency label"
                value={lang.proficiencyLabel}
                onChange={(v) => commitLanguages(languages.map((l) => (l.id === lang.id ? { ...l, proficiencyLabel: v } : l)))}
                placeholder="e.g. Fluent"
              />
              <label className="block text-[10.5px] font-semibold text-ink-500">Level (dots)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() =>
                      commitLanguages(languages.map((l) => (l.id === lang.id ? { ...l, level: lv as (typeof l)["level"] } : l)))
                    }
                    className={cn("h-2 flex-1 rounded-full transition", lang.level >= lv ? "bg-brand-500" : "bg-ink-200")}
                  />
                ))}
              </div>
              <button
                type="button"
                className="text-[11px] font-semibold text-rose-600"
                onClick={() => commitLanguages(languages.filter((l) => l.id !== lang.id))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commitLanguages([...languages, newLanguage()])}
          >
            + Add language
          </button>
        </Card>
      );
    }
    case "courses": {
      const { courses } = section.data;

      const commit = (next: typeof courses) => {
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: { type: "courses", courses: next },
        });
      };

      function toggleCourseField(courseId: string, key: CourseOptionalFieldKey) {
        commit(
          courses.map((x) => {
            if (x.id !== courseId) return x;
            const h = new Set(x.hiddenFields ?? []);
            if (h.has(key)) h.delete(key);
            else h.add(key);
            const arr = Array.from(h);
            return { ...x, hiddenFields: arr.length ? arr : undefined };
          }),
        );
      }

      const optionalRows: { key: CourseOptionalFieldKey; label: string }[] = [
        { key: "provider", label: "Provider" },
        { key: "dateRange", label: "Dates" },
        { key: "description", label: "Description" },
      ];

      return (
        <Card>
          <Label>Training & courses</Label>
          <p className="text-[11px] text-ink-500">
            For each course, turn optional fields off if you don&apos;t need them on the resume. Title always shows.
          </p>
          {courses.map((c) => {
            const hidden = new Set<CourseOptionalFieldKey>(c.hiddenFields ?? []);
            return (
            <div key={c.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Title" value={c.title} onChange={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, title: v } : x)))} />
              <div className="flex flex-wrap gap-1.5 rounded-md border border-ink-100 bg-ink-50/40 px-2 py-1.5">
                <span className="w-full text-[10px] font-semibold text-ink-600">On resume</span>
                {optionalRows.map(({ key, label }) => {
                  const isHidden = hidden.has(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCourseField(c.id, key)}
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[10px] font-bold transition",
                        isHidden
                          ? "bg-ink-200 text-ink-600 hover:bg-ink-300"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                      )}
                      title={isHidden ? `Show ${label} for this course` : `Hide ${label} for this course`}
                    >
                      {label}: {isHidden ? "off" : "on"}
                    </button>
                  );
                })}
              </div>
              <Field
                label="Provider"
                value={c.provider}
                disabled={hidden.has("provider")}
                onChange={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, provider: v } : x)))}
              />
              <Field
                label="Dates"
                value={c.dateRange}
                disabled={hidden.has("dateRange")}
                onChange={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, dateRange: v } : x)))}
              />
              <Field
                label="Description"
                value={c.description}
                multiline
                disabled={hidden.has("description")}
                onChange={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, description: v } : x)))}
              />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(courses.filter((x) => x.id !== c.id))}>
                Remove
              </button>
            </div>
            );
          })}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...courses, newCourse()])}
          >
            + Add course
          </button>
        </Card>
      );
    }
    case "websites": {
      const { websites } = section.data;
      const commit = (next: typeof websites) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "websites", websites: next } });
      };
      return (
        <Card>
          <Label>Links</Label>
          {websites.map((w) => (
            <div key={w.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Platform" value={w.platform} onChange={(v) => commit(websites.map((x) => (x.id === w.id ? { ...x, platform: v } : x)))} />
              <Field label="Username / handle" value={w.username} onChange={(v) => commit(websites.map((x) => (x.id === w.id ? { ...x, username: v } : x)))} />
              <Field label="URL" value={w.url} onChange={(v) => commit(websites.map((x) => (x.id === w.id ? { ...x, url: v } : x)))} />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(websites.filter((x) => x.id !== w.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...websites, newWebsite()])}
          >
            + Add link
          </button>
        </Card>
      );
    }
    case "awards": {
      const { awards } = section.data;
      const commit = (next: typeof awards) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "awards", awards: next } });
      };
      return (
        <Card>
          <Label>Awards</Label>
          {awards.map((a) => (
            <div key={a.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Icon (emoji)" value={a.icon} onChange={(v) => commit(awards.map((x) => (x.id === a.id ? { ...x, icon: v } : x)))} />
              <Field label="Title" value={a.title} onChange={(v) => commit(awards.map((x) => (x.id === a.id ? { ...x, title: v } : x)))} />
              <Field label="Issuer" value={a.issuer} onChange={(v) => commit(awards.map((x) => (x.id === a.id ? { ...x, issuer: v } : x)))} />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(awards.filter((x) => x.id !== a.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...awards, newAward()])}
          >
            + Add award
          </button>
        </Card>
      );
    }
    case "references": {
      const { references } = section.data;
      const commit = (next: typeof references) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "references", references: next } });
      };
      return (
        <Card>
          <Label>References</Label>
          {references.map((ref) => (
            <div key={ref.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Name" value={ref.name} onChange={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, name: v } : x)))} />
              <Field label="Title" value={ref.role} onChange={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, role: v } : x)))} />
              <Field label="Email" value={ref.email} onChange={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, email: v } : x)))} />
              <Field label="Phone" value={ref.phone} onChange={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, phone: v } : x)))} />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(references.filter((x) => x.id !== ref.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...references, newReference()])}
          >
            + Add reference
          </button>
        </Card>
      );
    }
    case "quote": {
      const d = section.data;
      const patchQuote = (p: Partial<{ quote: string; attribution: string }>) => {
        if (section.data.type !== "quote") return;
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: {
            type: "quote",
            quote: p.quote ?? section.data.quote,
            attribution: p.attribution ?? section.data.attribution,
          },
        });
      };
      return (
        <Card>
          <Label>Quote</Label>
          <Field label="Quote" value={d.quote} multiline onChange={(v) => patchQuote({ quote: v })} />
          <Field label="Attribution" value={d.attribution} onChange={(v) => patchQuote({ attribution: v })} />
        </Card>
      );
    }
    case "interests": {
      const { interests } = section.data;
      const commit = (next: typeof interests) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "interests", interests: next } });
      };
      return (
        <Card>
          <Label>Interests</Label>
          {interests.map((it) => (
            <div key={it.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Icon" value={it.icon} onChange={(v) => commit(interests.map((x) => (x.id === it.id ? { ...x, icon: v } : x)))} />
              <Field label="Title" value={it.title} onChange={(v) => commit(interests.map((x) => (x.id === it.id ? { ...x, title: v } : x)))} />
              <Field label="Description" value={it.body} multiline onChange={(v) => commit(interests.map((x) => (x.id === it.id ? { ...x, body: v } : x)))} />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(interests.filter((x) => x.id !== it.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...interests, newInterest()])}
          >
            + Add interest
          </button>
        </Card>
      );
    }
    case "books": {
      const { books } = section.data;
      const commit = (next: typeof books) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "books", books: next } });
      };
      return (
        <Card>
          <Label>Books</Label>
          {books.map((b) => (
            <div key={b.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Title" value={b.title} onChange={(v) => commit(books.map((x) => (x.id === b.id ? { ...x, title: v } : x)))} />
              <Field label="Author" value={b.author} onChange={(v) => commit(books.map((x) => (x.id === b.id ? { ...x, author: v } : x)))} />
              <label className="block text-[10.5px] font-semibold text-ink-500">Cover image</label>
              <input
                type="file"
                accept="image/*"
                className="text-[12px]"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => commit(books.map((x) => (x.id === b.id ? { ...x, coverUrl: String(r.result || "") } : x)));
                  r.readAsDataURL(f);
                  e.target.value = "";
                }}
              />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(books.filter((x) => x.id !== b.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...books, newBook()])}
          >
            + Add book
          </button>
        </Card>
      );
    }
    case "publications": {
      const { publications } = section.data;
      const commit = (next: typeof publications) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "publications", publications: next } });
      };
      return (
        <Card>
          <Label>Publications</Label>
          {publications.map((p) => (
            <div key={p.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Title" value={p.title} onChange={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, title: v } : x)))} />
              <Field label="Publisher" value={p.publisher} onChange={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, publisher: v } : x)))} />
              <Field label="Date" value={p.date} onChange={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, date: v } : x)))} />
              <Field label="Link" value={p.link} onChange={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, link: v } : x)))} />
              <Field label="Summary" value={p.summary} multiline onChange={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, summary: v } : x)))} />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(publications.filter((x) => x.id !== p.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...publications, newPublication()])}
          >
            + Add publication
          </button>
        </Card>
      );
    }
    case "signature": {
      const d = section.data;
      const patchSig = (p: Partial<{ imageUrl: string; signedName: string }>) => {
        if (section.data.type !== "signature") return;
        dispatch({
          type: "SET_SECTION_DATA",
          resumeId,
          sectionId: sid,
          data: {
            type: "signature",
            imageUrl: p.imageUrl ?? section.data.imageUrl,
            signedName: p.signedName ?? section.data.signedName,
          },
        });
      };
      return (
        <Card>
          <Label>Signature</Label>
          <Field label="Signed name (if no image)" value={d.signedName} onChange={(v) => patchSig({ signedName: v })} />
          <label className="block text-[10.5px] font-semibold text-ink-500">Signature image</label>
          <input
            type="file"
            accept="image/*"
            className="text-[12px]"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => patchSig({ imageUrl: String(r.result || "") });
              r.readAsDataURL(f);
              e.target.value = "";
            }}
          />
          {d.imageUrl && (
            <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => patchSig({ imageUrl: "" })}>
              Remove image
            </button>
          )}
        </Card>
      );
    }
    case "photos": {
      const { photos } = section.data;
      const commit = (next: typeof photos) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "photos", photos: next } });
      };
      return (
        <Card>
          <Label>Photo gallery</Label>
          {photos.map((p) => (
            <div key={p.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Caption" value={p.caption} onChange={(v) => commit(photos.map((x) => (x.id === p.id ? { ...x, caption: v } : x)))} />
              <label className="block text-[10.5px] font-semibold text-ink-500">Image</label>
              <input
                type="file"
                accept="image/*"
                className="text-[12px]"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = () => commit(photos.map((x) => (x.id === p.id ? { ...x, url: String(r.result || "") } : x)));
                  r.readAsDataURL(f);
                  e.target.value = "";
                }}
              />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(photos.filter((x) => x.id !== p.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...photos, newGalleryPhoto()])}
          >
            + Add photo
          </button>
        </Card>
      );
    }
    case "strengths": {
      const { strengths } = section.data;
      const commit = (next: typeof strengths) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "strengths", strengths: next } });
      };
      return (
        <Card>
          <Label>Strengths</Label>
          {strengths.map((it) => (
            <div key={it.id} className="space-y-2 rounded-lg border border-ink-100 p-2">
              <Field label="Icon" value={it.icon ?? ""} onChange={(v) => commit(strengths.map((x) => (x.id === it.id ? { ...x, icon: v } : x)))} />
              <Field label="Title" value={it.title} onChange={(v) => commit(strengths.map((x) => (x.id === it.id ? { ...x, title: v } : x)))} />
              <Field label="Description" value={it.description} multiline onChange={(v) => commit(strengths.map((x) => (x.id === it.id ? { ...x, description: v } : x)))} />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(strengths.filter((x) => x.id !== it.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...strengths, newAchievement()])}
          >
            + Add strength
          </button>
        </Card>
      );
    }
    case "timeChart": {
      const { segments } = section.data;
      const commit = (next: typeof segments) => {
        dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: sid, data: { type: "timeChart", segments: next } });
      };
      return (
        <Card>
          <Label>Time breakdown</Label>
          <p className="text-[11px] text-ink-500">Percentages are scaled to a full circle automatically.</p>
          {segments.map((seg) => (
            <div key={seg.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-ink-100 p-2">
              <input
                type="text"
                value={seg.label}
                onChange={(e) => commit(segments.map((x) => (x.id === seg.id ? { ...x, label: e.target.value } : x)))}
                className="min-w-[120px] flex-1 rounded-md border border-ink-200 px-2 py-1 text-[12px]"
                placeholder="Label"
              />
              <input
                type="number"
                value={seg.percent}
                min={0}
                max={100}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  commit(segments.map((x) => (x.id === seg.id ? { ...x, percent: Number.isFinite(n) ? n : 0 } : x)));
                }}
                className="w-16 rounded-md border border-ink-200 px-2 py-1 text-[12px]"
              />
              <button type="button" className="text-[11px] font-semibold text-rose-600" onClick={() => commit(segments.filter((x) => x.id !== seg.id))}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-brand-300 py-2 text-[12px] font-bold text-brand-700"
            onClick={() => commit([...segments, newTimeSegment("Activity", 10)])}
          >
            + Add segment
          </button>
        </Card>
      );
    }
    default:
      return null;
  }
}
