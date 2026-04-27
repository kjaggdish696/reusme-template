import type { HeaderLayout, Resume } from "../../types/resume";
import { useEditor } from "../../store/EditorContext";
import { cn } from "../../lib/classnames";
import { FONT_PRESETS, PALETTES } from "../templates/palettes";

interface Props {
  resume: Resume;
}

const PAGE_BACKGROUNDS = [
  { id: "white", name: "White", value: "#ffffff" },
  { id: "ivory", name: "Ivory", value: "#fdfaf3" },
  { id: "cream", name: "Cream", value: "#fbf6ec" },
  { id: "mist", name: "Mist", value: "#f4f6fb" },
  { id: "sand", name: "Sand", value: "#f5efe6" },
  { id: "midnight", name: "Midnight", value: "#0f172a" },
];

const HEADER_LAYOUTS: { id: HeaderLayout; label: string; hint: string }[] = [
  { id: "stack-left", label: "Stacked left", hint: "Name top, role under it" },
  { id: "stack-center", label: "Centered", hint: "Name centered, role below" },
  { id: "inline", label: "Inline", hint: "Name · Role on one line" },
  { id: "split", label: "Split", hint: "Name left, contacts right" },
];

export default function CustomizationPanel({ resume }: Props) {
  const { dispatch } = useEditor();

  function setTheme(patch: Partial<Resume["theme"]>) {
    dispatch({ type: "UPDATE_THEME", resumeId: resume.id, theme: patch });
  }

  return (
    <div className="space-y-5">
      <Group title="Theme · Accent">
        <div className="flex flex-wrap items-center gap-2">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setTheme({ accentColor: p.accent })}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-lg ring-2 ring-transparent transition",
                resume.theme.accentColor.toLowerCase() === p.accent.toLowerCase() && "ring-ink-900",
              )}
              style={{ background: p.accent }}
              title={p.name}
            >
              {resume.theme.accentColor.toLowerCase() === p.accent.toLowerCase() && (
                <span className="text-[10px] text-white">✓</span>
              )}
            </button>
          ))}
          <label className="flex items-center gap-2 rounded-lg border border-ink-100 px-2 py-1 text-[11px] font-semibold text-ink-600">
            Custom
            <input
              type="color"
              value={resume.theme.accentColor}
              onChange={(e) => setTheme({ accentColor: e.target.value })}
              className="h-6 w-9 cursor-pointer rounded border-0"
            />
          </label>
        </div>
      </Group>

      <Group title="Page background">
        <div className="flex flex-wrap items-center gap-2">
          {PAGE_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => setTheme({ pageBackground: bg.value })}
              className={cn(
                "h-8 w-8 rounded-lg border border-ink-100 ring-2 ring-transparent transition",
                resume.theme.pageBackground.toLowerCase() === bg.value.toLowerCase() &&
                  "ring-ink-900",
              )}
              style={{ background: bg.value }}
              title={bg.name}
            />
          ))}
          <label className="flex items-center gap-2 rounded-lg border border-ink-100 px-2 py-1 text-[11px] font-semibold text-ink-600">
            Custom
            <input
              type="color"
              value={resume.theme.pageBackground}
              onChange={(e) => setTheme({ pageBackground: e.target.value })}
              className="h-6 w-9 cursor-pointer rounded border-0"
            />
          </label>
        </div>
      </Group>

      <Group title="Typography · Font">
        <div className="grid gap-1.5">
          {FONT_PRESETS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTheme({ fontFamily: f.id })}
              className={cn(
                "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-[13px] transition",
                resume.theme.fontFamily === f.id
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              <span style={{ fontFamily: f.family }}>{f.name}</span>
              {resume.theme.fontFamily === f.id && <span>✓</span>}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Header layout">
        <div className="grid grid-cols-2 gap-2">
          {HEADER_LAYOUTS.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => setTheme({ headerLayout: h.id })}
              title={h.hint}
              className={cn(
                "flex flex-col items-stretch gap-1.5 rounded-lg border px-2.5 py-2 text-left transition",
                resume.theme.headerLayout === h.id
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              <HeaderPreview layout={h.id} />
              <div>
                <div className="text-[12px] font-semibold leading-tight">{h.label}</div>
                <div className="text-[10px] text-ink-500">{h.hint}</div>
              </div>
            </button>
          ))}
        </div>
      </Group>

      <Group title="Heading style">
        <div className="grid grid-cols-2 gap-2">
          {(["upper", "normal"] as const).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setTheme({ headingStyle: h })}
              className={cn(
                "rounded-lg border px-3 py-2 text-[12.5px] font-semibold capitalize",
                resume.theme.headingStyle === h
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              {h === "upper" ? "UPPERCASE" : "Sentence case"}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Layout · Density">
        <div className="grid grid-cols-3 gap-2">
          {(["compact", "normal", "relaxed"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTheme({ spacing: s })}
              className={cn(
                "rounded-lg border px-2 py-2 text-[12.5px] font-semibold capitalize",
                resume.theme.spacing === s
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Line height">
        <div className="grid grid-cols-3 gap-2">
          {(["tight", "normal", "loose"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTheme({ lineHeight: s })}
              className={cn(
                "rounded-lg border px-2 py-2 text-[12.5px] font-semibold capitalize",
                resume.theme.lineHeight === s
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>

      <Group title="Font size">
        <div className="grid grid-cols-3 gap-2">
          {(["sm", "md", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setTheme({ fontSize: s })}
              className={cn(
                "rounded-lg border px-2 py-2 text-[12.5px] font-semibold uppercase",
                resume.theme.fontSize === s
                  ? "border-brand-400 bg-brand-50 text-brand-700"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-500">
        {title}
      </div>
      {children}
    </section>
  );
}

function HeaderPreview({ layout }: { layout: HeaderLayout }) {
  const bar = "h-1 rounded-full bg-current opacity-80";
  const small = "h-[3px] rounded-full bg-current opacity-40";

  if (layout === "stack-left") {
    return (
      <div className="flex h-8 flex-col justify-center gap-0.5 rounded-md border border-ink-100 bg-white px-2">
        <div className={`${bar} w-3/5`} />
        <div className={`${small} w-2/5`} />
        <div className="mt-1 flex gap-1">
          <div className={`${small} w-3`} />
          <div className={`${small} w-4`} />
          <div className={`${small} w-3`} />
        </div>
      </div>
    );
  }
  if (layout === "stack-center") {
    return (
      <div className="flex h-8 flex-col items-center justify-center gap-0.5 rounded-md border border-ink-100 bg-white px-2">
        <div className={`${bar} w-3/5`} />
        <div className={`${small} w-2/5`} />
        <div className="mt-1 flex gap-1">
          <div className={`${small} w-3`} />
          <div className={`${small} w-4`} />
          <div className={`${small} w-3`} />
        </div>
      </div>
    );
  }
  if (layout === "inline") {
    return (
      <div className="flex h-8 flex-col justify-center gap-0.5 rounded-md border border-ink-100 bg-white px-2">
        <div className="flex items-center gap-1.5">
          <div className={`${bar} w-1/3`} />
          <span className="text-[8px] opacity-30">·</span>
          <div className={`${small} w-1/4`} />
        </div>
        <div className="mt-1 flex gap-1">
          <div className={`${small} w-3`} />
          <div className={`${small} w-4`} />
          <div className={`${small} w-3`} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-8 items-center justify-between rounded-md border border-ink-100 bg-white px-2">
      <div className="flex flex-col gap-0.5">
        <div className={`${bar} w-12`} />
        <div className={`${small} w-8`} />
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <div className={`${small} w-6`} />
        <div className={`${small} w-5`} />
        <div className={`${small} w-6`} />
      </div>
    </div>
  );
}
