import type {
  AwardItem,
  BookItem,
  CourseItem,
  GalleryPhotoItem,
  InterestItem,
  LanguageItem,
  PublicationItem,
  ReferenceItem,
  TimeSegment,
  WebsiteItem,
} from "../../types/resume";
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
import EditableText from "../editor/EditableText";
import { useTemplateBindings } from "./TemplateContext";
import type { ResumeSection } from "../../types/resume";

const IconCal = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);
const IconLink = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
  </svg>
);

function normalizePercents(segments: TimeSegment[]): number[] {
  const sum = segments.reduce((a, s) => a + Math.max(0, s.percent), 0) || 1;
  return segments.map((s) => (Math.max(0, s.percent) / sum) * 100);
}

/** Annular sector for SVG donut (angles in radians, SVG y-down). */
function timeChartDonutSlicePath(
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

export function LanguagesBlock({ section }: { section: ResumeSection }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "languages") return null;
  const { languages } = section.data;

  function commit(next: LanguageItem[]) {
    dispatch({
      type: "SET_SECTION_DATA",
      resumeId,
      sectionId: section.id,
      data: { type: "languages", languages: next },
    });
  }

  return (
    <div className="rcp-lang-grid">
      {languages.map((lang) => (
        <div key={lang.id} className="rcp-lang">
          <div>
            <EditableText
              as="div"
              className="rcp-lang-name"
              value={lang.name}
              placeholder="Language"
              onCommit={(v) =>
                commit(languages.map((l) => (l.id === lang.id ? { ...l, name: v } : l)))
              }
            />
            <EditableText
              as="div"
              className="rcp-lang-level-label"
              value={lang.proficiencyLabel}
              placeholder="Level"
              onCommit={(v) =>
                commit(languages.map((l) => (l.id === lang.id ? { ...l, proficiencyLabel: v } : l)))
              }
            />
            <div className="rcp-lang-dots" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((lv) =>
                mode === "edit" ? (
                  <button
                    key={lv}
                    type="button"
                    className={`rcp-lang-dot${lang.level >= lv ? " is-on" : ""}`}
                    onClick={() =>
                      commit(languages.map((l) => (l.id === lang.id ? { ...l, level: lv as LanguageItem["level"] } : l)))
                    }
                    contentEditable={false}
                  />
                ) : (
                  <span key={lv} className={`rcp-lang-dot${lang.level >= lv ? " is-on" : ""}`} />
                ),
              )}
            </div>
          </div>
          {mode === "edit" && (
            <button
              type="button"
              className="rcp-mini-remove"
              contentEditable={false}
              onClick={() => commit(languages.filter((l) => l.id !== lang.id))}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...languages, newLanguage()])}>
          + Add language
        </button>
      )}
    </div>
  );
}

export function CoursesBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "courses") return null;
  const { courses } = section.data;

  function commit(next: CourseItem[]) {
    dispatch({
      type: "SET_SECTION_DATA",
      resumeId,
      sectionId: section.id,
      data: { type: "courses", courses: next },
    });
  }

  return (
    <div className="rcp-courses-grid">
      {courses.map((c) => {
        const hide = new Set(c.hiddenFields ?? []);
        return (
        <div key={c.id} className="rcp-course-card">
          <EditableText
            as="div"
            className="rcp-item-title"
            value={c.title}
            placeholder="Course title"
            onCommit={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, title: v } : x)))}
          />
          {!hide.has("provider") && (
            <div className="rcp-item-sub" style={{ color: accent }}>
              <EditableText
                value={c.provider}
                placeholder="Provider"
                onCommit={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, provider: v } : x)))}
              />
            </div>
          )}
          {!hide.has("dateRange") && (
            <div className="rcp-course-meta">
              <span className="rcp-inline-ico">
                <IconCal />
              </span>
              <EditableText
                value={c.dateRange}
                placeholder="Dates"
                onCommit={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, dateRange: v } : x)))}
              />
            </div>
          )}
          {!hide.has("description") && (
            <EditableText
              as="div"
              className="rcp-course-desc"
              value={c.description}
              placeholder="Short description…"
              multiline
              onCommit={(v) => commit(courses.map((x) => (x.id === c.id ? { ...x, description: v } : x)))}
            />
          )}
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(courses.filter((x) => x.id !== c.id))}>
              Remove
            </button>
          )}
        </div>
        );
      })}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...courses, newCourse()])}>
          + Add course
        </button>
      )}
    </div>
  );
}

export function WebsitesBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "websites") return null;
  const { websites } = section.data;

  function commit(next: WebsiteItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "websites", websites: next } });
  }

  return (
    <ul className="rcp-web-list">
      {websites.map((w) => (
        <li key={w.id} className="rcp-web-row">
          <span className="rcp-web-ico" style={{ color: accent }}>
            🔗
          </span>
          <div className="rcp-web-main">
            <EditableText
              className="rcp-web-platform"
              value={w.platform}
              placeholder="Platform"
              onCommit={(v) => commit(websites.map((x) => (x.id === w.id ? { ...x, platform: v } : x)))}
            />
            <EditableText
              className="rcp-web-user"
              value={w.username}
              placeholder="username or handle"
              onCommit={(v) => commit(websites.map((x) => (x.id === w.id ? { ...x, username: v } : x)))}
            />
            <EditableText
              className="rcp-web-url"
              value={w.url}
              placeholder="URL"
              onCommit={(v) => commit(websites.map((x) => (x.id === w.id ? { ...x, url: v } : x)))}
            />
          </div>
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(websites.filter((x) => x.id !== w.id))}>
              ✕
            </button>
          )}
        </li>
      ))}
      {mode === "edit" && (
        <li>
          <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...websites, newWebsite()])}>
            + Add link
          </button>
        </li>
      )}
    </ul>
  );
}

export function AwardsBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "awards") return null;
  const { awards } = section.data;

  function commit(next: AwardItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "awards", awards: next } });
  }

  return (
    <div className="rcp-awards-grid">
      {awards.map((a) => (
        <div key={a.id} className="rcp-award">
          <EditableText
            className="rcp-award-ico"
            value={a.icon}
            placeholder="🏅"
            onCommit={(v) => commit(awards.map((x) => (x.id === a.id ? { ...x, icon: v } : x)))}
          />
          <div>
            <EditableText
              as="div"
              className="rcp-item-title"
              value={a.title}
              placeholder="Award"
              onCommit={(v) => commit(awards.map((x) => (x.id === a.id ? { ...x, title: v } : x)))}
            />
            <div className="rcp-item-sub" style={{ color: accent }}>
              <EditableText
                value={a.issuer}
                placeholder="Issuer"
                onCommit={(v) => commit(awards.map((x) => (x.id === a.id ? { ...x, issuer: v } : x)))}
              />
            </div>
          </div>
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(awards.filter((x) => x.id !== a.id))}>
              ✕
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...awards, newAward()])}>
          + Add award
        </button>
      )}
    </div>
  );
}

export function ReferencesBlock({ section }: { section: ResumeSection }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "references") return null;
  const { references } = section.data;

  function commit(next: ReferenceItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "references", references: next } });
  }

  return (
    <div className="rcp-refs-grid">
      {references.map((ref) => (
        <div key={ref.id} className="rcp-ref">
          <EditableText
            as="div"
            className="rcp-item-title"
            value={ref.name}
            placeholder="Name"
            onCommit={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, name: v } : x)))}
          />
          <EditableText
            as="div"
            className="rcp-ref-role"
            value={ref.role}
            placeholder="Title / relationship"
            onCommit={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, role: v } : x)))}
          />
          <EditableText
            className="rcp-ref-line"
            value={ref.email}
            placeholder="email@company.com"
            onCommit={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, email: v } : x)))}
          />
          <EditableText
            className="rcp-ref-line"
            value={ref.phone}
            placeholder="Phone"
            onCommit={(v) => commit(references.map((x) => (x.id === ref.id ? { ...x, phone: v } : x)))}
          />
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(references.filter((x) => x.id !== ref.id))}>
              Remove
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...references, newReference()])}>
          + Add reference
        </button>
      )}
    </div>
  );
}

export function QuoteBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch } = useTemplateBindings();
  if (section.data.type !== "quote") return null;

  function patch(p: Partial<{ quote: string; attribution: string }>) {
    if (section.data.type !== "quote") return;
    dispatch({
      type: "SET_SECTION_DATA",
      resumeId,
      sectionId: section.id,
      data: {
        type: "quote",
        quote: p.quote ?? section.data.quote,
        attribution: p.attribution ?? section.data.attribution,
      },
    });
  }

  return (
    <div className="rcp-quote">
      <EditableText
        as="div"
        className="rcp-quote__text"
        style={{ color: accent }}
        value={section.data.quote}
        placeholder="Your favorite quote…"
        multiline
        onCommit={(v) => patch({ quote: v })}
      />
      <EditableText
        as="div"
        className="rcp-quote__attr"
        value={section.data.attribution}
        placeholder="Attribution"
        onCommit={(v) => patch({ attribution: v })}
      />
    </div>
  );
}

export function InterestsBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "interests") return null;
  const { interests } = section.data;

  function commit(next: InterestItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "interests", interests: next } });
  }

  return (
    <div className="rcp-interests-grid">
      {interests.map((it) => (
        <div key={it.id} className="rcp-interest">
          <span className="rcp-interest-ico" style={{ color: accent }}>
            <EditableText
              value={it.icon}
              placeholder="❤"
              onCommit={(v) => commit(interests.map((x) => (x.id === it.id ? { ...x, icon: v } : x)))}
            />
          </span>
          <div>
            <EditableText
              as="div"
              className="rcp-item-title"
              value={it.title}
              placeholder="Interest"
              onCommit={(v) => commit(interests.map((x) => (x.id === it.id ? { ...x, title: v } : x)))}
            />
            <EditableText
              as="div"
              className="rcp-interest-body"
              value={it.body}
              placeholder="A sentence about this interest…"
              multiline
              onCommit={(v) => commit(interests.map((x) => (x.id === it.id ? { ...x, body: v } : x)))}
            />
          </div>
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(interests.filter((x) => x.id !== it.id))}>
              ✕
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...interests, newInterest()])}>
          + Add interest
        </button>
      )}
    </div>
  );
}

export function BooksBlock({ section }: { section: ResumeSection }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "books") return null;
  const { books } = section.data;

  function commit(next: BookItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "books", books: next } });
  }

  async function onFile(bookId: string, file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      commit(books.map((b) => (b.id === bookId ? { ...b, coverUrl: url } : b)));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rcp-books-row">
      {books.map((b) => (
        <div key={b.id} className="rcp-book">
          <div className="rcp-book-cover">
            {b.coverUrl ? (
              <img src={b.coverUrl} alt="" className="rcp-book-img" />
            ) : (
              <div className="rcp-book-placeholder">Cover</div>
            )}
            {mode === "edit" && (
              <label className="rcp-book-upload" contentEditable={false}>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && void onFile(b.id, e.target.files[0])} />
                +
              </label>
            )}
          </div>
          <EditableText
            as="div"
            className="rcp-book-title"
            value={b.title}
            placeholder="Title"
            onCommit={(v) => commit(books.map((x) => (x.id === b.id ? { ...x, title: v } : x)))}
          />
          <EditableText
            as="div"
            className="rcp-book-author"
            value={b.author}
            placeholder="Author"
            onCommit={(v) => commit(books.map((x) => (x.id === b.id ? { ...x, author: v } : x)))}
          />
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(books.filter((x) => x.id !== b.id))}>
              Remove
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...books, newBook()])}>
          + Add book
        </button>
      )}
    </div>
  );
}

export function PublicationsBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "publications") return null;
  const { publications } = section.data;

  function commit(next: PublicationItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "publications", publications: next } });
  }

  return (
    <div className="rcp-stack">
      {publications.map((p) => (
        <div key={p.id} className="rcp-item">
          <EditableText
            as="div"
            className="rcp-item-title"
            value={p.title}
            placeholder="Title"
            onCommit={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, title: v } : x)))}
          />
          <div className="rcp-item-sub" style={{ color: accent }}>
            <EditableText
              value={p.publisher}
              placeholder="Publisher"
              onCommit={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, publisher: v } : x)))}
            />
          </div>
          <div className="rcp-pub-meta">
            <span className="rcp-inline-ico">
              <IconCal />
            </span>
            <EditableText
              value={p.date}
              placeholder="Date"
              onCommit={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, date: v } : x)))}
            />
            <span className="rcp-inline-ico">
              <IconLink />
            </span>
            <EditableText
              value={p.link}
              placeholder="URL"
              onCommit={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, link: v } : x)))}
            />
          </div>
          <EditableText
            as="div"
            className="rcp-summary"
            value={p.summary}
            placeholder="Summary…"
            multiline
            onCommit={(v) => commit(publications.map((x) => (x.id === p.id ? { ...x, summary: v } : x)))}
          />
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(publications.filter((x) => x.id !== p.id))}>
              Remove
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...publications, newPublication()])}>
          + Add publication
        </button>
      )}
    </div>
  );
}

export function SignatureBlock({ section }: { section: ResumeSection }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "signature") return null;

  function patch(p: Partial<{ imageUrl: string; signedName: string }>) {
    if (section.data.type !== "signature") return;
    dispatch({
      type: "SET_SECTION_DATA",
      resumeId,
      sectionId: section.id,
      data: {
        type: "signature",
        imageUrl: p.imageUrl ?? section.data.imageUrl,
        signedName: p.signedName ?? section.data.signedName,
      },
    });
  }

  async function onFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => patch({ imageUrl: String(reader.result || "") });
    reader.readAsDataURL(file);
  }

  return (
    <div className="rcp-signature">
      {section.data.imageUrl ? (
        <img src={section.data.imageUrl} alt="Signature" className="rcp-signature-img" />
      ) : (
        <EditableText
          as="div"
          className="rcp-signature-text"
          value={section.data.signedName}
          placeholder="Sign your name"
          onCommit={(v) => patch({ signedName: v })}
        />
      )}
      {mode === "edit" && (
        <label className="rcp-sig-upload" contentEditable={false}>
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && void onFile(e.target.files[0])} />
          Upload signature image
        </label>
      )}
    </div>
  );
}

export function PhotosBlock({ section }: { section: ResumeSection }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "photos") return null;
  const { photos } = section.data;

  function commit(next: GalleryPhotoItem[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "photos", photos: next } });
  }

  async function onFile(id: string, file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || "");
      commit(photos.map((p) => (p.id === id ? { ...p, url } : p)));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rcp-photos-grid">
      {photos.map((p) => (
        <figure key={p.id} className="rcp-photo-cell">
          <div className="rcp-photo-frame">
            {p.url ? <img src={p.url} alt="" className="rcp-photo-img" /> : <div className="rcp-photo-ph">Photo</div>}
            {mode === "edit" && (
              <label className="rcp-photo-upload" contentEditable={false}>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => e.target.files?.[0] && void onFile(p.id, e.target.files[0])} />
                +
              </label>
            )}
          </div>
          <figcaption>
            <EditableText
              className="rcp-photo-cap"
              value={p.caption}
              placeholder="Caption"
              onCommit={(v) => commit(photos.map((x) => (x.id === p.id ? { ...x, caption: v } : x)))}
            />
          </figcaption>
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(photos.filter((x) => x.id !== p.id))}>
              Remove
            </button>
          )}
        </figure>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...photos, newGalleryPhoto()])}>
          + Add photo
        </button>
      )}
    </div>
  );
}

export function StrengthsBlock({ section }: { section: ResumeSection }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "strengths") return null;
  const { strengths } = section.data;

  function commit(next: typeof strengths) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "strengths", strengths: next } });
  }

  return (
    <div className="rcp-stack">
      {strengths.map((it) => (
        <div key={it.id} className="rcp-strength">
          <span className="rcp-strength-ico">
            <EditableText
              value={it.icon ?? ""}
              placeholder="📈"
              onCommit={(v) => commit(strengths.map((x) => (x.id === it.id ? { ...x, icon: v } : x)))}
            />
          </span>
          <div>
            <EditableText
              as="div"
              className="rcp-item-title"
              value={it.title}
              placeholder="Strength"
              onCommit={(v) => commit(strengths.map((x) => (x.id === it.id ? { ...x, title: v } : x)))}
            />
            <EditableText
              as="div"
              className="rcp-strength-desc"
              value={it.description}
              placeholder="Why it matters…"
              multiline
              onCommit={(v) => commit(strengths.map((x) => (x.id === it.id ? { ...x, description: v } : x)))}
            />
          </div>
          {mode === "edit" && (
            <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(strengths.filter((x) => x.id !== it.id))}>
              ✕
            </button>
          )}
        </div>
      ))}
      {mode === "edit" && (
        <button type="button" className="rcp-add-inline" contentEditable={false} onClick={() => commit([...strengths, newAchievement()])}>
          + Add strength
        </button>
      )}
    </div>
  );
}

export function TimeChartBlock({ section, accent }: { section: ResumeSection; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  if (section.data.type !== "timeChart") return null;
  const { segments } = section.data;
  const norm = normalizePercents(segments);

  const vb = 200;
  const cx = vb / 2;
  const cy = vb / 2;
  const rOuter = 68;
  const rInner = 40;
  const labelR = 90;
  const leaderOuter = rOuter + 1;
  const leaderInner = labelR - 10;
  const letterR = 9;
  const gapRad = segments.length > 1 ? (1.25 * Math.PI) / 180 : 0;
  const twoPi = Math.PI * 2;
  const totalArc = Math.max(0.0001, twoPi - segments.length * gapRad);

  let cursor = -Math.PI / 2;
  const sliceMeta = segments.map((seg, i) => {
    const span = (norm[i]! / 100) * totalArc;
    const a0 = cursor;
    const a1 = cursor + span;
    cursor = a1 + gapRad;
    const mid = (a0 + a1) / 2;
    const path = timeChartDonutSlicePath(cx, cy, rOuter, rInner, a0, a1);
    const lx = cx + labelR * Math.cos(mid);
    const ly = cy + labelR * Math.sin(mid);
    const x1 = cx + leaderOuter * Math.cos(mid);
    const y1 = cy + leaderOuter * Math.sin(mid);
    const x2 = cx + leaderInner * Math.cos(mid);
    const y2 = cy + leaderInner * Math.sin(mid);
    return { seg, i, path, mid, lx, ly, x1, y1, x2, y2 };
  });

  function commit(next: TimeSegment[]) {
    dispatch({ type: "SET_SECTION_DATA", resumeId, sectionId: section.id, data: { type: "timeChart", segments: next } });
  }

  return (
    <div className="rcp-timechart">
      <div className="rcp-timechart-chart">
        <svg viewBox={`0 0 ${vb} ${vb}`} className="rcp-timechart-svg" aria-hidden="true">
          {segments.length === 0 ? (
            <circle
              cx={cx}
              cy={cy}
              r={(rOuter + rInner) / 2}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={rOuter - rInner}
            />
          ) : (
            <>
              <g className="rcp-timechart-slices">
                {sliceMeta.map(({ seg, path }) => (
                  <path key={seg.id} d={path} fill={accent} />
                ))}
              </g>
              <g className="rcp-timechart-callouts" fill="none" stroke="#0f172a" strokeWidth={1.1}>
                {sliceMeta.map(({ seg, x1, y1, x2, y2 }) => (
                  <line key={seg.id} x1={x2} y1={y2} x2={x1} y2={y1} />
                ))}
              </g>
              <g className="rcp-timechart-letters">
                {sliceMeta.map(({ seg, i, lx, ly }) => (
                  <g key={seg.id} transform={`translate(${lx},${ly})`}>
                    <circle r={letterR} fill="#0f172a" />
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize={11}
                      fontWeight={700}
                      style={{ fontFamily: "system-ui, Segoe UI, sans-serif" }}
                    >
                      {String.fromCharCode(65 + i)}
                    </text>
                  </g>
                ))}
              </g>
            </>
          )}
        </svg>
      </div>
      <ul className="rcp-timechart-legend">
        {segments.map((seg, i) => (
          <li key={seg.id} className="rcp-timechart-row">
            <span className="rcp-timechart-key">{String.fromCharCode(65 + i)}</span>
            <EditableText
              as="div"
              className="rcp-timechart-label"
              value={seg.label}
              placeholder="Activity"
              onCommit={(v) => commit(segments.map((x) => (x.id === seg.id ? { ...x, label: v } : x)))}
            />
            {mode === "edit" && (
              <input
                type="number"
                className="rcp-timechart-pct"
                value={seg.percent}
                min={0}
                max={100}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  commit(segments.map((x) => (x.id === seg.id ? { ...x, percent: Number.isFinite(n) ? n : 0 } : x)));
                }}
                contentEditable={false}
              />
            )}
            {mode !== "edit" && <span className="rcp-timechart-pct-ro">{Math.round(norm[i] ?? 0)}%</span>}
            {mode === "edit" && (
              <button type="button" className="rcp-mini-remove" contentEditable={false} onClick={() => commit(segments.filter((x) => x.id !== seg.id))}>
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
      {mode === "edit" && (
        <button
          type="button"
          className="rcp-add-inline"
          contentEditable={false}
          onClick={() => commit([...segments, newTimeSegment("New", 10)])}
        >
          + Add segment
        </button>
      )}
    </div>
  );
}
