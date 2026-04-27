import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateConfig } from "../data/mockTemplates";
import { useEditor } from "../store/EditorContext";
import { makeBlankResume } from "../data/seed";
import TemplateThumb from "../components/templates/TemplateThumb";
import { cn } from "../lib/classnames";
import { createResume } from "../lib/api";

type Cat = TemplateConfig["category"] | "all";

export default function TemplatesPage() {
  const { dispatch } = useEditor();
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat>("all");
  const [loadingTemplateId, setLoadingTemplateId] = useState<string | null>(null);

  const visible = useMemo<TemplateConfig[]>(
    () => (cat === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.category === cat)),
    [cat],
  );

  async function startWithTemplate(templateId: string) {
    const localResume = makeBlankResume(templateId, "Untitled Resume");
    setLoadingTemplateId(templateId);
    try {
      const dbResume = await createResume({
        title: localResume.title,
        templateId: localResume.templateId,
        data: localResume as unknown as object,
      });
      localResume.id = dbResume.id;
      
      dispatch({ type: "CREATE_RESUME", resume: localResume });
      navigate(`/editor/${localResume.id}`);
    } catch (e: any) {
      console.error("Failed to create resume from template", e);
      alert(`Failed to create resume. Error: ${e?.response?.data?.detail || e.message}`);
    } finally {
      setLoadingTemplateId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Template gallery
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {TEMPLATES.length}+ professional templates.
        </h1>
        <p className="max-w-2xl text-sm text-ink-500">
          Six structurally different layouts, ten color palettes, and four typographic systems —
          every template is editable inline and switching never loses your content.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
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

      <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {visible.map((tpl, idx) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx, 12) * 0.03 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-pop"
          >
            <div className="grid w-full place-items-center bg-ink-50/40 py-3 rounded-xl">
              <TemplateThumb template={tpl} scale={0.32} />
            </div>
            <div className="flex flex-1 flex-col px-2 pt-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="truncate text-base font-bold text-ink-900">{tpl.name}</div>
                  <div className="truncate text-[10px] uppercase tracking-widest text-ink-400">
                    {tpl.previewLabel}
                  </div>
                </div>
                {tpl.premium && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-amber-700">
                    Pro
                  </span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 flex-1 text-[12.5px] text-ink-500">
                {tpl.description}
              </p>
              <div className="mt-3 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => startWithTemplate(tpl.id)}
                  disabled={loadingTemplateId !== null}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-pop hover:bg-brand-700 disabled:opacity-50"
                >
                  {loadingTemplateId === tpl.id ? "Creating..." : "Use this template →"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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
        "rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest transition",
        active
          ? "bg-ink-900 text-white"
          : "border border-ink-200 bg-white text-ink-600 hover:border-ink-300",
      )}
    >
      {label}
    </button>
  );
}
