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
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [cat, setCat] = useState<TemplateConfig["category"] | "all">("all");

  const visible = useMemo<TemplateConfig[]>(
    () => (cat === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat)),
    [cat],
  );

  function handleSelect(tplId: string) {
    if (tplId === resume.templateId || switchingId) return;
    
    setSwitchingId(tplId);
    
    // Delay the dispatch slightly to show the "Opening..." state
    setTimeout(() => {
      dispatch({ type: "CHANGE_TEMPLATE", resumeId: resume.id, templateId: tplId });
      setSwitchingId(null);
    }, 500);
  }

  return (
    <div>
      <div className="mb-4 -mx-1 flex flex-wrap gap-1.5 px-1">
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
          "grid gap-4",
          compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {visible.map((tpl) => {
          const active = tpl.id === resume.templateId;
          const isSwitching = tpl.id === switchingId;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id)}
              disabled={switchingId !== null}
              className={cn(
                "group relative flex flex-col items-center overflow-hidden rounded-2xl border bg-white p-2.5 text-left transition-all duration-300",
                active
                  ? "border-brand-500 ring-4 ring-brand-500/10 shadow-lg"
                  : "border-ink-100 hover:border-brand-300 hover:shadow-pop",
                switchingId && !isSwitching && "opacity-60",
              )}
            >
              <div className="grid w-full place-items-center rounded-xl bg-ink-50/50 p-1 group-hover:bg-brand-50/30 transition-colors">
                <TemplateThumb template={tpl} scale={compact ? 0.22 : 0.27} />
              </div>
              <div className="mt-3 flex w-full items-start justify-between gap-2 px-1">
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-bold text-ink-900">{tpl.name}</div>
                  <div className="truncate text-[10px] font-bold uppercase tracking-widest text-ink-400">
                    {tpl.previewLabel}
                  </div>
                </div>
                {tpl.premium && (
                  <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-amber-700 shadow-sm">
                    Pro
                  </span>
                )}
              </div>
              {active && !isSwitching && (
                <div className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-white shadow-lg animate-in zoom-in duration-300">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}

              {isSwitching && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-brand-600/90 text-white animate-in fade-in duration-300">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white mb-2" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Opening...</span>
                </div>
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
        "rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all",
        active
          ? "bg-ink-900 text-white shadow-md scale-105"
          : "border border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:bg-ink-50",
      )}
    >
      {label}
    </button>
  );
}
