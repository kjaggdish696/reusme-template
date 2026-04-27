import { useLayoutEffect, useRef, useState } from "react";
import type { Resume } from "../../types/resume";
import { TemplateRenderer } from "./TemplateRenderer";

/** Approximate A4 size in CSS px (210×297 mm at 96dpi). */
const PAGE_W = 794;
const PAGE_H = 1123;

interface Props {
  resume: Resume;
}

/**
 * Live thumbnail of a saved resume for dashboard cards — same rendering as the editor, scaled down.
 */
export default function ResumeMiniPreview({ resume }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.14);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function measure() {
      const box = containerRef.current;
      if (!box) return;
      const { width, height } = box.getBoundingClientRect();
      if (width < 16 || height < 16) return;
      const s = Math.min((width - 4) / PAGE_W, (height - 4) / PAGE_H);
      setScale(Math.max(0.08, Math.min(s, 0.45)));
    }

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full items-center justify-center bg-gradient-to-b from-ink-100 to-ink-50 p-1"
    >
      <div
        className="shrink-0"
        style={{
          width: `calc(210mm * ${scale})`,
          height: `calc(297mm * ${scale})`,
          overflow: "hidden",
          borderRadius: 6,
          boxShadow: "0 2px 10px rgba(15,23,42,0.1)",
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
    </div>
  );
}
