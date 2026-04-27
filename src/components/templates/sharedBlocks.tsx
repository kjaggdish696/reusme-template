import { useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import EditableText from "../editor/EditableText";
import { useTemplateBindings } from "./TemplateContext";
import {
  newAchievement,
  newCertification,
  newEducation,
  newExperience,
  newProject,
  newSkill,
} from "../../data/sectionFactories";
import type {
  AchievementItem,
  CertificationItem,
  ContactKey,
  EducationItem,
  ExperienceItem,
  HeaderLayout,
  PersonalInfo,
  ProjectItem,
  SkillChartStyle,
  SkillItem,
} from "../../types/resume";

interface BaseProps {
  sectionId: string;
}

/* ---------- Tiny inline icons (currentColor) ---------- */
const IconMail = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 7 9-7" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92V21a1 1 0 0 1-1.11 1A19.86 19.86 0 0 1 2 4.11 1 1 0 0 1 3 3h4.09a1 1 0 0 1 1 .75l1 4a1 1 0 0 1-.27 1L7.21 10.21a16 16 0 0 0 6.58 6.58l1.46-1.46a1 1 0 0 1 1-.27l4 1a1 1 0 0 1 .75 1z" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);
const IconLinkedin = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.55v13.5H.22V8zm7.4 0h4.36v1.85h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v6.51h-4.55v-5.77c0-1.38-.03-3.16-1.92-3.16-1.93 0-2.23 1.5-2.23 3.05v5.88H7.62V8z" />
  </svg>
);
const IconGithub = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.7 5.39-5.27 5.68.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

interface ContactSpec {
  key: ContactKey;
  label: string;
  icon: ReactNode;
  placeholder: string;
  value: string;
}

export function ContactLine({
  sectionId,
  personal,
  layout = "inline",
  light,
}: BaseProps & {
  personal: PersonalInfo;
  layout?: "inline" | "stacked";
  light?: boolean;
}) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  const [addOpen, setAddOpen] = useState(false);

  function update(patch: Partial<PersonalInfo>) {
    dispatch({ type: "UPDATE_PERSONAL", resumeId, sectionId, personal: patch });
  }

  const hidden = new Set<ContactKey>(personal.hiddenContacts ?? []);

  function hide(key: ContactKey) {
    update({ hiddenContacts: Array.from(new Set([...(personal.hiddenContacts ?? []), key])) });
  }
  function show(key: ContactKey) {
    update({
      hiddenContacts: (personal.hiddenContacts ?? []).filter((k) => k !== key),
    });
  }

  const items: ContactSpec[] = [
    { key: "email", label: "Email", icon: <IconMail />, placeholder: "your@email.com", value: personal.email },
    { key: "phone", label: "Phone", icon: <IconPhone />, placeholder: "+1 555 000 0000", value: personal.phone },
    { key: "location", label: "Location", icon: <IconPin />, placeholder: "City, Country", value: personal.location },
    { key: "website", label: "Website", icon: <IconGlobe />, placeholder: "your-site.com", value: personal.website },
    { key: "linkedin", label: "LinkedIn", icon: <IconLinkedin />, placeholder: "linkedin.com/in/handle", value: personal.linkedin },
    { key: "github", label: "GitHub", icon: <IconGithub />, placeholder: "github.com/handle", value: personal.github },
  ];

  const visibleItems =
    mode === "edit"
      ? items.filter((i) => !hidden.has(i.key))
      : items.filter((i) => !hidden.has(i.key) && i.value && i.value.trim());

  const hiddenItems = items.filter((i) => hidden.has(i.key));

  if (mode !== "edit" && !visibleItems.length) return null;

  const cls = layout === "stacked" ? "rcp-contact rcp-contact--stacked" : "rcp-contact";
  return (
    <div className={cls} style={light ? { color: "rgba(255,255,255,0.92)" } : undefined}>
      {visibleItems.map((it) => (
        <span key={it.key} className="rcp-contact__item">
          <span className="rcp-contact__icon" aria-hidden="true">{it.icon}</span>
          <EditableText
            value={it.value}
            placeholder={it.placeholder}
            onCommit={(v) => update({ [it.key]: v } as Partial<PersonalInfo>)}
          />
          {mode === "edit" && (
            <button
              type="button"
              className="rcp-contact__hide"
              title={`Hide ${it.label}`}
              onClick={() => hide(it.key)}
              contentEditable={false}
            >
              ✕
            </button>
          )}
        </span>
      ))}
      {mode === "edit" && hiddenItems.length > 0 && (
        <span className="rcp-contact__addwrap" contentEditable={false}>
          <button
            type="button"
            className="rcp-contact__add"
            onClick={() => setAddOpen((o) => !o)}
            title="Show another field"
          >
            + Add field
          </button>
          {addOpen && (
            <span className="rcp-contact__menu">
              {hiddenItems.map((it) => (
                <button
                  key={it.key}
                  type="button"
                  className="rcp-contact__menu-item"
                  onClick={() => {
                    show(it.key);
                    setAddOpen(false);
                  }}
                >
                  <span className="rcp-contact__icon" aria-hidden="true">{it.icon}</span>
                  {it.label}
                </button>
              ))}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

export function HeaderName({
  sectionId,
  personal,
  className,
  style,
  roleClassName,
  roleStyle,
}: BaseProps & {
  personal: PersonalInfo;
  className?: string;
  style?: CSSProperties;
  roleClassName?: string;
  roleStyle?: CSSProperties;
}) {
  const { resumeId, dispatch } = useTemplateBindings();
  function update(patch: Partial<PersonalInfo>) {
    dispatch({ type: "UPDATE_PERSONAL", resumeId, sectionId, personal: patch });
  }
  return (
    <>
      <EditableText
        as="div"
        className={className}
        style={style}
        value={personal.fullName}
        placeholder="Your Name"
        onCommit={(v) => update({ fullName: v })}
      />
      <EditableText
        as="div"
        className={roleClassName}
        style={roleStyle}
        value={personal.role}
        placeholder="Your Role"
        onCommit={(v) => update({ role: v })}
      />
    </>
  );
}

/* ----- Profile photo ----- */

const PHOTO_SIZE_PX: Record<NonNullable<PersonalInfo["photo"]>["size"], number> = {
  sm: 56,
  md: 80,
  lg: 110,
  xl: 140,
};

const PHOTO_RADIUS: Record<NonNullable<PersonalInfo["photo"]>["shape"], string> = {
  round: "50%",
  rounded: "14%",
  square: "0%",
};

export function ProfilePhoto({
  personal,
  override,
  className,
  style,
}: {
  personal: PersonalInfo;
  /** Override the saved size (used when sidebars want a smaller crop). */
  override?: { size?: NonNullable<PersonalInfo["photo"]>["size"] };
  className?: string;
  style?: CSSProperties;
}) {
  const photo = personal.photo;
  if (!photo || !photo.url) return null;
  const sz = PHOTO_SIZE_PX[override?.size ?? photo.size];
  const radius = PHOTO_RADIUS[photo.shape];
  return (
    <div
      className={`rcp-photo ${className ?? ""}`.trim()}
      style={{
        width: sz,
        height: sz,
        borderRadius: radius,
        boxShadow: photo.border ? `0 0 0 3px ${photo.border}` : undefined,
        ...style,
      }}
      contentEditable={false}
    >
      <img src={photo.url} alt={personal.fullName || "Profile"} />
    </div>
  );
}

/* ============================================================
 * PersonalHeader — renders Name + Role + Contact in one of four
 * configurable layouts. Used by every template that exposes a
 * regular header (Classic, Minimal, TwoCol, Banner, Sidebar etc.).
 * ========================================================== */

export interface PersonalHeaderProps extends BaseProps {
  personal: PersonalInfo;
  layout: HeaderLayout;
  /** When true, render with white text (e.g. on a colored banner / sidebar). */
  light?: boolean;
  /** Override role color (e.g. accent on light bg). */
  roleColor?: string;
  /** Force-disable variants that don't fit (sidebar always stacks left). */
  forceLayout?: HeaderLayout;
  /** Force the contact list layout (sidebar uses stacked). */
  contactLayout?: "inline" | "stacked";
  /** Custom class for the wrapper. */
  className?: string;
  /** Style for the wrapper. */
  style?: CSSProperties;
  /** Optional rule rendered after the header (used by Two-col, Classic). */
  showRule?: boolean;
  ruleColor?: string;
}

export function PersonalHeader({
  sectionId,
  personal,
  layout,
  light,
  roleColor,
  forceLayout,
  contactLayout: contactLayoutProp,
  className,
  style,
  showRule,
  ruleColor,
}: PersonalHeaderProps) {
  const { resumeId, dispatch } = useTemplateBindings();

  function update(patch: Partial<PersonalInfo>) {
    dispatch({ type: "UPDATE_PERSONAL", resumeId, sectionId, personal: patch });
  }

  const effective: HeaderLayout = forceLayout ?? layout;

  const nameStyle: CSSProperties = light ? { color: "#fff" } : {};
  const roleStyle: CSSProperties = roleColor ? { color: roleColor } : {};

  const wrapperClass = `rcp-header-shell rcp-header-shell--${effective}`;
  const wrapperStyle: CSSProperties = { ...style };

  const NameEl = (
    <EditableText
      as="div"
      className="rcp-name"
      style={nameStyle}
      value={personal.fullName}
      placeholder="Your Name"
      onCommit={(v) => update({ fullName: v })}
    />
  );
  const RoleEl = (
    <EditableText
      as="div"
      className="rcp-role"
      style={roleStyle}
      value={personal.role}
      placeholder="Your Role"
      onCommit={(v) => update({ role: v })}
    />
  );

  const contactLayout: "inline" | "stacked" =
    contactLayoutProp ??
    (effective === "stack-center" || effective === "stack-left" || effective === "inline"
      ? "inline"
      : "stacked");

  const hasPhoto = !!personal.photo?.url;

  if (effective === "inline") {
    return (
      <div className={`${wrapperClass} ${className ?? ""}`} style={wrapperStyle}>
        <div className="rcp-header-inline">
          {hasPhoto && <ProfilePhoto personal={personal} className="rcp-photo--leading" />}
          <div className="rcp-header-inline__text">
            <div className="rcp-header-inline__row">
              {NameEl}
              <span className="rcp-header-inline__sep" aria-hidden="true">·</span>
              {RoleEl}
            </div>
            <ContactLine sectionId={sectionId} personal={personal} layout={contactLayout} light={light} />
          </div>
        </div>
        {showRule && <div className="rcp-header-rule" style={{ background: ruleColor || "currentColor" }} />}
      </div>
    );
  }

  if (effective === "split") {
    return (
      <div className={`${wrapperClass} ${className ?? ""}`} style={wrapperStyle}>
        <div className="rcp-header-split">
          <div className="rcp-header-split__name">
            {hasPhoto && <ProfilePhoto personal={personal} className="rcp-photo--leading" />}
            <div className="rcp-header-split__text">
              {NameEl}
              {RoleEl}
            </div>
          </div>
          <div className="rcp-header-split__contact">
            <ContactLine sectionId={sectionId} personal={personal} layout="stacked" light={light} />
          </div>
        </div>
        {showRule && <div className="rcp-header-rule" style={{ background: ruleColor || "currentColor" }} />}
      </div>
    );
  }

  if (effective === "stack-center") {
    return (
      <div className={`${wrapperClass} ${className ?? ""}`} style={wrapperStyle}>
        {hasPhoto && <ProfilePhoto personal={personal} className="rcp-photo--center" />}
        {NameEl}
        {RoleEl}
        <div className="rcp-header-contact-spacer" aria-hidden="true" />
        <ContactLine sectionId={sectionId} personal={personal} layout={contactLayout} light={light} />
        {showRule && <div className="rcp-header-rule" style={{ background: ruleColor || "currentColor" }} />}
      </div>
    );
  }

  // stack-left
  return (
    <div className={`${wrapperClass} ${className ?? ""}`} style={wrapperStyle}>
      {hasPhoto ? (
        <div className="rcp-header-stack-row">
          <div className="rcp-header-stack-row__text">
            {NameEl}
            {RoleEl}
            <div className="rcp-header-contact-spacer" aria-hidden="true" />
            <ContactLine sectionId={sectionId} personal={personal} layout={contactLayout} light={light} />
          </div>
          <ProfilePhoto personal={personal} />
        </div>
      ) : (
        <>
          {NameEl}
          {RoleEl}
          <div className="rcp-header-contact-spacer" aria-hidden="true" />
          <ContactLine sectionId={sectionId} personal={personal} layout={contactLayout} light={light} />
        </>
      )}
      {showRule && <div className="rcp-header-rule" style={{ background: ruleColor || "currentColor" }} />}
    </div>
  );
}

/* ----- Experience ----- */

export function ExperienceList({
  sectionId,
  items,
  accent,
}: BaseProps & { items: ExperienceItem[]; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  function update(itemId: string, patch: Partial<ExperienceItem>) {
    dispatch({ type: "UPDATE_EXPERIENCE", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_EXPERIENCE", resumeId, sectionId, itemId });
  }
  function add() {
    dispatch({ type: "ADD_EXPERIENCE", resumeId, sectionId, item: newExperience() });
  }

  return (
    <div className="rcp-stack">
      {items.map((it) => (
        <div key={it.id} className="rcp-item">
          <div className="rcp-item-head">
            <div>
              <EditableText
                as="div"
                className="rcp-item-title"
                value={it.position}
                placeholder="Job title"
                onCommit={(v) => update(it.id, { position: v })}
              />
              <div className="rcp-item-sub" style={{ color: accent }}>
                <EditableText
                  value={it.company}
                  placeholder="Company"
                  onCommit={(v) => update(it.id, { company: v })}
                />
                <span className="rcp-sep">·</span>
                <EditableText
                  value={it.location}
                  placeholder="Location"
                  onCommit={(v) => update(it.id, { location: v })}
                />
              </div>
            </div>
            <div className="rcp-item-date">
              <EditableText
                value={it.startDate}
                placeholder="Start"
                onCommit={(v) => update(it.id, { startDate: v })}
              />{" "}
              –{" "}
              {it.current ? (
                <span>Present</span>
              ) : (
                <EditableText
                  value={it.endDate}
                  placeholder="End"
                  onCommit={(v) => update(it.id, { endDate: v })}
                />
              )}
            </div>
          </div>
          <Bullets
            bullets={it.bullets}
            onUpdate={(bullets) => update(it.id, { bullets })}
          />
          {mode === "edit" && (
            <ItemControls onRemove={() => remove(it.id)} />
          )}
        </div>
      ))}
      {mode === "edit" && <AddItemButton label="+ Add role" onClick={add} />}
    </div>
  );
}

/* ----- Education ----- */

export function EducationList({
  sectionId,
  items,
  accent,
}: BaseProps & { items: EducationItem[]; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  function update(itemId: string, patch: Partial<EducationItem>) {
    dispatch({ type: "UPDATE_EDUCATION", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_EDUCATION", resumeId, sectionId, itemId });
  }
  function add() {
    dispatch({ type: "ADD_EDUCATION", resumeId, sectionId, item: newEducation() });
  }
  return (
    <div className="rcp-stack">
      {items.map((it) => (
        <div key={it.id} className="rcp-item">
          <div className="rcp-item-head">
            <div>
              <EditableText
                as="div"
                className="rcp-item-title"
                value={it.institution}
                placeholder="Institution"
                onCommit={(v) => update(it.id, { institution: v })}
              />
              <div className="rcp-item-sub" style={{ color: accent }}>
                <EditableText
                  value={it.degree}
                  placeholder="Degree"
                  onCommit={(v) => update(it.id, { degree: v })}
                />
                <span className="rcp-sep">·</span>
                <EditableText
                  value={it.field}
                  placeholder="Field"
                  onCommit={(v) => update(it.id, { field: v })}
                />
                {(it.grade || mode === "edit") && (
                  <>
                    <span className="rcp-sep">·</span>
                    <EditableText
                      value={it.grade}
                      placeholder="Grade"
                      onCommit={(v) => update(it.id, { grade: v })}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="rcp-item-date">
              <EditableText
                value={it.startDate}
                placeholder="Start"
                onCommit={(v) => update(it.id, { startDate: v })}
              />{" "}
              –{" "}
              <EditableText
                value={it.endDate}
                placeholder="End"
                onCommit={(v) => update(it.id, { endDate: v })}
              />
            </div>
          </div>
          <Bullets bullets={it.bullets} onUpdate={(bullets) => update(it.id, { bullets })} />
          {mode === "edit" && <ItemControls onRemove={() => remove(it.id)} />}
        </div>
      ))}
      {mode === "edit" && <AddItemButton label="+ Add education" onClick={add} />}
    </div>
  );
}

/* ----- Projects ----- */

export function ProjectList({
  sectionId,
  items,
  accent,
}: BaseProps & { items: ProjectItem[]; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  function update(itemId: string, patch: Partial<ProjectItem>) {
    dispatch({ type: "UPDATE_PROJECT", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_PROJECT", resumeId, sectionId, itemId });
  }
  function add() {
    dispatch({ type: "ADD_PROJECT", resumeId, sectionId, item: newProject() });
  }
  return (
    <div className="rcp-stack">
      {items.map((it) => (
        <div key={it.id} className="rcp-item">
          <div className="rcp-item-head">
            <div>
              <EditableText
                as="div"
                className="rcp-item-title"
                value={it.name}
                placeholder="Project name"
                onCommit={(v) => update(it.id, { name: v })}
              />
              <div className="rcp-item-sub" style={{ color: accent }}>
                <EditableText
                  value={it.techStack}
                  placeholder="Tech / tools used"
                  onCommit={(v) => update(it.id, { techStack: v })}
                />
              </div>
            </div>
            <div className="rcp-item-date">
              <EditableText
                value={it.link}
                placeholder="Link"
                onCommit={(v) => update(it.id, { link: v })}
              />
            </div>
          </div>
          <Bullets bullets={it.bullets} onUpdate={(bullets) => update(it.id, { bullets })} />
          {mode === "edit" && <ItemControls onRemove={() => remove(it.id)} />}
        </div>
      ))}
      {mode === "edit" && <AddItemButton label="+ Add project" onClick={add} />}
    </div>
  );
}

/* ----- Certifications ----- */

export function CertificationList({
  sectionId,
  items,
  accent,
}: BaseProps & { items: CertificationItem[]; accent: string }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  function update(itemId: string, patch: Partial<CertificationItem>) {
    dispatch({ type: "UPDATE_CERTIFICATION", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_CERTIFICATION", resumeId, sectionId, itemId });
  }
  function add() {
    dispatch({ type: "ADD_CERTIFICATION", resumeId, sectionId, item: newCertification() });
  }
  return (
    <div className="rcp-stack">
      {items.map((it) => (
        <div key={it.id} className="rcp-cert">
          <div>
            <EditableText
              as="div"
              className="rcp-item-title"
              value={it.name}
              placeholder="Certification"
              onCommit={(v) => update(it.id, { name: v })}
            />
            <div className="rcp-item-sub" style={{ color: accent }}>
              <EditableText
                value={it.issuer}
                placeholder="Issuer"
                onCommit={(v) => update(it.id, { issuer: v })}
              />
              <span className="rcp-sep">·</span>
              <EditableText
                value={it.date}
                placeholder="Date"
                onCommit={(v) => update(it.id, { date: v })}
              />
            </div>
          </div>
          <div className="rcp-item-date">
            <EditableText
              value={it.link}
              placeholder="Link"
              onCommit={(v) => update(it.id, { link: v })}
            />
          </div>
          {mode === "edit" && <ItemControls inline onRemove={() => remove(it.id)} />}
        </div>
      ))}
      {mode === "edit" && <AddItemButton label="+ Add certification" onClick={add} />}
    </div>
  );
}

/* ----- Achievements ----- */

export function AchievementList({
  sectionId,
  items,
}: BaseProps & { items: AchievementItem[] }) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  function update(itemId: string, patch: Partial<AchievementItem>) {
    dispatch({ type: "UPDATE_ACHIEVEMENT", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_ACHIEVEMENT", resumeId, sectionId, itemId });
  }
  function add() {
    dispatch({ type: "ADD_ACHIEVEMENT", resumeId, sectionId, item: newAchievement() });
  }
  return (
    <div className="rcp-stack">
      <ul className="rcp-achieve-list">
        {items.map((it) => (
          <li key={it.id} className="rcp-achieve-row">
            {mode === "edit" ? (
              <EditableText
                className="rcp-achieve-ico"
                value={it.icon ?? ""}
                placeholder="◆"
                onCommit={(v) => update(it.id, { icon: v })}
              />
            ) : (
              <span className="rcp-achieve-ico" aria-hidden="true">
                {(it.icon || "◆").trim() || "◆"}
              </span>
            )}
            <div className="rcp-achieve-body">
              <EditableText
                as="div"
                className="rcp-achievement-title"
                value={it.title}
                placeholder="Achievement title"
                onCommit={(v) => update(it.id, { title: v })}
              />
              {(it.description || mode === "edit") && (
                <EditableText
                  as="div"
                  className="rcp-achieve-desc"
                  value={it.description}
                  placeholder="Description"
                  multiline
                  onCommit={(v) => update(it.id, { description: v })}
                />
              )}
            </div>
            {mode === "edit" && <InlineRemove onClick={() => remove(it.id)} />}
          </li>
        ))}
      </ul>
      {mode === "edit" && <AddItemButton label="+ Add achievement" onClick={add} />}
    </div>
  );
}

/* ----- Skills (bars / tags / dots / donut) ----- */

export function Skills({
  sectionId,
  items,
  accent,
  light,
  chartStyle = "bars",
}: BaseProps & {
  items: SkillItem[];
  accent: string;
  light?: boolean;
  chartStyle?: SkillChartStyle;
}) {
  const { resumeId, dispatch, mode } = useTemplateBindings();
  function update(itemId: string, patch: Partial<SkillItem>) {
    dispatch({ type: "UPDATE_SKILL", resumeId, sectionId, itemId, patch });
  }
  function remove(itemId: string) {
    dispatch({ type: "REMOVE_SKILL", resumeId, sectionId, itemId });
  }
  function add() {
    dispatch({ type: "ADD_SKILL", resumeId, sectionId, item: newSkill() });
  }
  function setStyle(s: SkillChartStyle) {
    dispatch({ type: "SET_SKILLS_CHART", resumeId, sectionId, chartStyle: s });
  }

  const toolbar =
    mode === "edit" ? (
      <div className="rcp-skill-toolbar" contentEditable={false}>
        <span className="rcp-skill-toolbar__lbl">Style</span>
        {(["bars", "donut", "dots", "tags"] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={`rcp-chip${chartStyle === s ? " is-active" : ""}`}
            onClick={() => setStyle(s)}
          >
            {s === "bars" ? "Bars" : s === "donut" ? "Pie" : s === "dots" ? "Dots" : "Tags"}
          </button>
        ))}
      </div>
    ) : null;

  if (chartStyle === "donut") {
    return (
      <div>
        {toolbar}
        <SkillDonut
          items={items}
          accent={accent}
          light={!!light}
          onUpdate={update}
          onRemove={remove}
          onAdd={add}
          editable={mode === "edit"}
        />
      </div>
    );
  }

  if (chartStyle === "tags") {
    return (
      <div>
        {toolbar}
        <div className="rcp-skill-cloud">
          {items.map((s) => (
            <span
              key={s.id}
              className="rcp-skill-tag"
              style={{
                color: light ? "#fff" : accent,
                border: light ? "1px solid rgba(255,255,255,0.4)" : `1px solid ${accent}33`,
                background: light ? "rgba(255,255,255,0.12)" : `${accent}10`,
              }}
            >
              <EditableText
                value={s.name}
                placeholder="Skill"
                onCommit={(v) => update(s.id, { name: v })}
              />
              {mode === "edit" && <InlineRemove onClick={() => remove(s.id)} />}
            </span>
          ))}
          {mode === "edit" && <AddItemButton label="+ Skill" onClick={add} small />}
        </div>
      </div>
    );
  }

  // bars + dots are similar layouts; differ in the level visualization
  return (
    <div>
      {toolbar}
      <div className="rcp-skill-list">
        {items.map((s) => (
          <div key={s.id} className="rcp-skill">
            <div className="rcp-skill-head">
              <EditableText
                value={s.name}
                placeholder="Skill"
                onCommit={(v) => update(s.id, { name: v })}
              />
              {mode === "edit" ? (
                <span className="rcp-skill-cat">
                  {[1, 2, 3, 4, 5].map((lv) => (
                    <button
                      type="button"
                      key={lv}
                      onClick={() => update(s.id, { level: lv as 1 | 2 | 3 | 4 | 5 })}
                      className={`rcp-skill-dot${s.level >= lv ? " is-on" : ""}`}
                      aria-label={`Set skill level ${lv}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    className="rcp-skill-x"
                    title="Remove skill"
                  >
                    ✕
                  </button>
                </span>
              ) : null}
            </div>
            {chartStyle === "dots" ? (
              <div className="rcp-skill-dots">
                {[1, 2, 3, 4, 5].map((lv) => (
                  <span
                    key={lv}
                    className="rcp-skill-dotview"
                    style={{
                      background:
                        s.level >= lv ? (light ? "#fff" : accent) : light ? "rgba(255,255,255,0.25)" : "#e5e7ef",
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                className="rcp-skill-track"
                style={{ background: light ? "rgba(255,255,255,0.18)" : "#e5e7ef" }}
              >
                <div
                  className="rcp-skill-fill"
                  style={{
                    width: `${(s.level / 5) * 100}%`,
                    background: light ? "#fff" : accent,
                  }}
                />
              </div>
            )}
          </div>
        ))}
        {mode === "edit" && <AddItemButton label="+ Add skill" onClick={add} />}
      </div>
    </div>
  );
}

function SkillDonut({
  items,
  accent,
  light,
  onUpdate,
  onRemove,
  onAdd,
  editable,
}: {
  items: SkillItem[];
  accent: string;
  light: boolean;
  onUpdate: (id: string, patch: Partial<SkillItem>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  editable: boolean;
}) {
  const donutFilterId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const total = Math.max(
    1,
    items.reduce((sum, s) => sum + s.level, 0),
  );
  // Build deterministic palette around accent.
  const palette = buildAccentPalette(accent, items.length);

  // SVG donut — rounded caps, balanced ring for a cleaner “pie” read
  const size = 152;
  const radius = 56;
  const stroke = 15;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  /** Tiny gap between slices (degrees), so segments read as separate arcs */
  const gapDeg = items.length > 1 ? 1.2 : 0;
  const gapLen = (gapDeg / 360) * circumference;

  let cumulative = 0;
  const segments = items.map((s, idx) => {
    const value = s.level;
    const fraction = value / total;
    const arcLen = Math.max(0, fraction * circumference - gapLen);
    const dasharray = `${arcLen} ${circumference}`;
    const rotation = (cumulative / total) * 360;
    cumulative += value;
    return {
      key: s.id,
      color: palette[idx % palette.length],
      dasharray,
      rotation,
    };
  });

  return (
    <div className="rcp-donut-wrap">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="rcp-donut"
        aria-hidden="true"
      >
        <defs>
          <filter id={donutFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.12" />
          </filter>
        </defs>
        <g filter={`url(#${donutFilterId})`}>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={light ? "rgba(255,255,255,0.22)" : "#e8ebf4"}
            strokeWidth={stroke}
            fill="none"
          />
          {segments.map((seg) => (
            <circle
              key={seg.key}
              cx={cx}
              cy={cy}
              r={radius}
              stroke={seg.color}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={seg.dasharray}
              transform={`rotate(${seg.rotation - 90} ${cx} ${cy})`}
              strokeLinecap="round"
            />
          ))}
        </g>
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill={light ? "#fff" : "#1e293b"}
        >
          {items.length}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill={light ? "rgba(255,255,255,0.82)" : "#64748b"}
        >
          {items.length === 1 ? "skill" : "skills"}
        </text>
      </svg>
      <ul className="rcp-donut-legend">
        {items.map((s, idx) => (
          <li key={s.id} className="rcp-donut-legend__item">
            <span
              className="rcp-donut-legend__swatch"
              style={{ background: palette[idx % palette.length] }}
            />
            <EditableText
              as="div"
              className="rcp-donut-legend__name"
              value={s.name}
              placeholder="Skill"
              onCommit={(v) => onUpdate(s.id, { name: v })}
            />
            <span className="rcp-donut-legend__lvl">
              {[1, 2, 3, 4, 5].map((lv) => (
                <button
                  type="button"
                  key={lv}
                  onClick={() => editable && onUpdate(s.id, { level: lv as 1 | 2 | 3 | 4 | 5 })}
                  className={`rcp-skill-dotview${s.level >= lv ? " is-on" : ""}`}
                  style={{
                    background: s.level >= lv ? (light ? "#fff" : accent) : light ? "rgba(255,255,255,0.25)" : "#e5e7ef",
                    cursor: editable ? "pointer" : "default",
                  }}
                  aria-label={`Set level ${lv}`}
                  disabled={!editable}
                />
              ))}
            </span>
            {editable && (
              <button
                type="button"
                className="rcp-skill-x"
                title="Remove skill"
                onClick={() => onRemove(s.id)}
              >
                ✕
              </button>
            )}
          </li>
        ))}
        {editable && (
          <li>
            <AddItemButton label="+ Add skill" onClick={onAdd} small />
          </li>
        )}
      </ul>
    </div>
  );
}

function buildAccentPalette(accent: string, count: number): string[] {
  // Build an ordered palette: accent + analogous tints/shades for variety
  const base = parseHex(accent);
  if (!base) {
    return ["#4f46e5", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#22d3ee"];
  }
  const colors: string[] = [];
  const steps = Math.max(count, 6);
  for (let i = 0; i < steps; i++) {
    const t = i / Math.max(1, steps - 1);
    // mix with rotated hue offsets
    const lightenRatio = -0.25 + t * 0.5;
    colors.push(mix(base, lightenRatio, i));
  }
  return colors;
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function mix(base: { r: number; g: number; b: number }, ratio: number, salt: number): string {
  const target = ratio < 0 ? 0 : 255;
  const k = Math.abs(ratio);
  const wobble = ((salt * 17) % 30) - 15;
  const adj = (c: number) => Math.max(0, Math.min(255, Math.round(c * (1 - k) + target * k) + wobble));
  const r = adj(base.r);
  const g = adj(base.g);
  const b = adj(base.b);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/* ----- Bullets ----- */

function Bullets({ bullets, onUpdate }: { bullets: string[]; onUpdate: (next: string[]) => void }) {
  const { mode } = useTemplateBindings();
  const visible = mode === "edit" ? bullets : bullets.filter((b) => b.trim());
  if (!visible.length && mode !== "edit") return null;
  return (
    <ul className="rcp-bullets">
      {bullets.map((b, idx) => (
        <li key={idx}>
          <EditableText
            as="div"
            richText
            className="rcp-bullet-rich"
            value={b}
            placeholder="Achievement-led bullet point with metrics if possible."
            onCommit={(v) => {
              const next = bullets.slice();
              next[idx] = v;
              onUpdate(next);
            }}
            onEnter={() => {
              const next = bullets.slice();
              next.splice(idx + 1, 0, "");
              onUpdate(next);
            }}
            onBackspaceEmpty={() => {
              if (bullets.length === 1) return;
              const next = bullets.slice();
              next.splice(idx, 1);
              onUpdate(next);
            }}
          />
        </li>
      ))}
      {mode === "edit" && (
        <li className="rcp-bullets__add">
          <button
            type="button"
            onClick={() => onUpdate([...bullets, ""])}
            className="rcp-add-mini"
          >
            + bullet
          </button>
        </li>
      )}
    </ul>
  );
}

/* ----- Tiny inline controls ----- */

function ItemControls({ onRemove, inline }: { onRemove: () => void; inline?: boolean }) {
  return (
    <div className={inline ? "rcp-item-controls rcp-item-controls--inline" : "rcp-item-controls"}>
      <button type="button" className="rcp-item-controls__btn" onClick={onRemove} title="Remove">
        ✕ Remove
      </button>
    </div>
  );
}

function InlineRemove({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rcp-inline-remove" title="Remove">
      ✕
    </button>
  );
}

function AddItemButton({
  label,
  onClick,
  small,
}: {
  label: string;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={small ? "rcp-add-btn rcp-add-btn--small" : "rcp-add-btn"}
    >
      {label}
    </button>
  );
}
