import type { HeaderLayout, Resume } from "../../types/resume";
import { useEditor } from "../../store/EditorContext";
import { FONT_PRESETS, PALETTES } from "../templates/palettes";
import { cn } from "../../lib/classnames";

const HEADER_LAYOUT_LABELS: Record<HeaderLayout, string> = {
  "stack-left": "Stacked left",
  "stack-center": "Centered",
  inline: "Inline",
  split: "Split (name · contacts)",
};

interface Props {
  resume: Resume;
  onOpenTemplates?: () => void;
  onOpenDesign?: () => void;
}

/**
 * Compact "Theme & Layout" inline panel that mirrors the SaaS reference.
 * Shows the current Template / Font / Primary color / Background and lets
 * users tweak each one without leaving the Outline view.
 */
export default function QuickThemeBar({ resume, onOpenTemplates, onOpenDesign }: Props) {
  const { dispatch } = useEditor();

  function setTheme(patch: Partial<Resume["theme"]>) {
    dispatch({ type: "UPDATE_THEME", resumeId: resume.id, theme: patch });
  }

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-3 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Theme &amp; Layout
        </p>
        <button
          type="button"
          onClick={onOpenDesign}
          className="text-[11px] font-semibold text-brand-700 hover:underline"
        >
          More
        </button>
      </div>
      <div className="space-y-2">
        <Row icon={<TplIcon />} label="Layout">
          <button
            type="button"
            onClick={onOpenTemplates}
            className="rounded-md border border-ink-100 bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink-700 hover:border-ink-300"
            title="Browse layouts and structure"
          >
            Change layout <span className="text-[9px] text-ink-400">▾</span>
          </button>
        </Row>
        <Row icon={<FontIcon />} label="Font">
          <select
            value={resume.theme.fontFamily}
            onChange={(e) => setTheme({ fontFamily: e.target.value })}
            className="rounded-md border border-ink-100 bg-white px-2 py-1 text-[11.5px] font-semibold text-ink-700"
          >
            {FONT_PRESETS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </Row>
        <Row icon={<DotIcon color={resume.theme.accentColor} />} label="Primary Color">
          <div className="flex items-center gap-1">
            {PALETTES.slice(0, 5).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setTheme({ accentColor: p.accent })}
                className={cn(
                  "h-5 w-5 rounded-full ring-2 ring-transparent",
                  resume.theme.accentColor.toLowerCase() === p.accent.toLowerCase() &&
                    "ring-ink-700",
                )}
                style={{ background: p.accent }}
                title={p.name}
              />
            ))}
            <input
              type="color"
              value={resume.theme.accentColor}
              onChange={(e) => setTheme({ accentColor: e.target.value })}
              className="h-5 w-6 cursor-pointer rounded border-0 p-0"
              title="Custom color"
            />
          </div>
        </Row>
        <Row icon={<BgIcon color={resume.theme.pageBackground} />} label="Background">
          <input
            type="color"
            value={resume.theme.pageBackground}
            onChange={(e) => setTheme({ pageBackground: e.target.value })}
            className="h-6 w-9 cursor-pointer rounded border border-ink-100 p-0"
            title="Page background"
          />
        </Row>
        <Row icon={<HeaderIcon />} label="Header layout">
          <select
            value={resume.theme.headerLayout}
            onChange={(e) => setTheme({ headerLayout: e.target.value as HeaderLayout })}
            className="rounded-md border border-ink-100 bg-white px-2 py-1 text-[11.5px] font-semibold text-ink-700"
            title="Name + role layout"
          >
            {(Object.keys(HEADER_LAYOUT_LABELS) as HeaderLayout[]).map((id) => (
              <option key={id} value={id}>
                {HEADER_LAYOUT_LABELS[id]}
              </option>
            ))}
          </select>
        </Row>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg px-1 py-1">
      <div className="flex items-center gap-2 text-[12px] text-ink-600">
        <span className="grid h-5 w-5 place-items-center text-ink-500">{icon}</span>
        {label}
      </div>
      {children}
    </div>
  );
}

function TplIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 9v12" />
    </svg>
  );
}
function FontIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 19l5-14h2l5 14M7 14h10" />
    </svg>
  );
}
function DotIcon({ color }: { color: string }) {
  return (
    <span className="block h-3 w-3 rounded-full" style={{ background: color }} />
  );
}
function BgIcon({ color }: { color: string }) {
  return (
    <span
      className="block h-3 w-3 rounded-sm border border-ink-200"
      style={{ background: color }}
    />
  );
}
function HeaderIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <path d="M3 14h12M3 18h8" />
    </svg>
  );
}
