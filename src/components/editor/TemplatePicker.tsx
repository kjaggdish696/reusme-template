import { useState, useMemo } from "react";
import type { Resume } from "../../types/resume";
import { useEditor } from "../../store/EditorContext";
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  type TemplateConfig,
} from "../../data/mockTemplates";
import TemplateThumb from "../templates/TemplateThumb";
import { cn } from "../../lib/classnames";

interface Props {
  resume: Resume;
  compact?: boolean;
}

export default function TemplatePicker({ resume, compact }: Props) {
  const { dispatch } = useEditor();
  const [cat, setCat] = useState<TemplateConfig["category"] | "all">("all");

  const visible = useMemo<TemplateConfig[]>(
    () => (cat === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat)),
    [cat],
  );

  return (
    <div>
      <div className="mb-3 -mx-1 flex flex-wrap gap-1.5 px-1">
        <FilterChip label={`All (${TEMPLATES.length})`} active={cat === "all"} onClick={() => setCat("all")} />
        {TEMPLATE_CATEGORIES.map((c) => {
          const count = TEMPLATES.filter((t) => t.category === c.id).length;
          return (
            <FilterChip
              key={c.id}
              label={`${c.label} (${count})`}
              active={cat === c.id}
              onClick={() => setCat(c.id)}
            />
          );
        })}
      </div>
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {visible.map((tpl) => {
          const active = tpl.id === resume.templateId;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() =>
                dispatch({ type: "CHANGE_TEMPLATE", resumeId: resume.id, templateId: tpl.id })
              }
              className={cn(
                "group relative flex flex-col items-center overflow-hidden rounded-xl border bg-white p-2 text-left shadow-soft transition",
                active
                  ? "border-brand-500 ring-2 ring-brand-200"
                  : "border-ink-100 hover:border-ink-300",
              )}
            >
              <div className="grid w-full place-items-center">
                <TemplateThumb template={tpl} scale={compact ? 0.22 : 0.27} />
              </div>
              <div className="mt-2 flex w-full items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-ink-900">{tpl.name}</div>
                  <div className="truncate text-[10px] uppercase tracking-widest text-ink-400">
                    {tpl.previewLabel}
                  </div>
                </div>
                {tpl.premium && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-700">
                    Pro
                  </span>
                )}
              </div>
              {active && (
                <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-[11px] text-white">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition",
        active
          ? "bg-ink-900 text-white"
          : "border border-ink-200 bg-white text-ink-600 hover:border-ink-300",
      )}
    >
      {label}
    </button>
  );
}
