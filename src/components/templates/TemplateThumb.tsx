import { useMemo } from "react";
import type { TemplateConfig } from "../../data/mockTemplates";
import { makeSampleResume } from "../../data/seed";
import { TemplateRenderer } from "./TemplateRenderer";

interface Props {
  template: TemplateConfig;
  scale?: number;
}

const thumbCache = new Map<string, any>();

export default function TemplateThumb({ template, scale = 0.32 }: Props) {
  const resume = useMemo(() => {
    if (!thumbCache.has(template.id)) {
      const base = makeSampleResume(template.id);
      thumbCache.set(template.id, {
        ...base,
        templateId: template.id,
        theme: { ...base.theme, ...template.defaults },
      });
    }
    return thumbCache.get(template.id)!;
  }, [template]);

  return (
    <div
      className="rcp-thumb"
      style={{
        width: `calc(210mm * ${scale})`,
        height: `calc(297mm * ${scale})`,
        overflow: "hidden",
        borderRadius: 6,
        boxShadow: "0 1px 0 rgba(15,23,42,0.06), 0 6px 16px rgba(15,23,42,0.08)",
        background: "#fff",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: "210mm",
          height: "297mm",
          pointerEvents: "none",
        }}
      >
        <TemplateRenderer resume={resume} shadowless mode="preview" />
      </div>
    </div>
  );
}
