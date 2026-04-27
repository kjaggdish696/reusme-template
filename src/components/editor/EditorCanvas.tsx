import { useEffect, useRef, useState } from "react";
import type { Resume } from "../../types/resume";
import { TemplateRenderer } from "../templates/TemplateRenderer";
import InlineFormatToolbar from "./InlineFormatToolbar";

interface Props {
  resume: Resume;
  printRef?: React.MutableRefObject<HTMLDivElement | null>;
  /** Off-screen 1:1 clone for PDF raster export (avoids zoom transforms on the live canvas). */
  pdfSnapshotRef?: React.MutableRefObject<HTMLDivElement | null>;
  pdfExportSnapshot?: boolean;
  selectedSectionId: string | null;
  onSelectSection: (id: string | null) => void;
  mode?: "edit" | "preview";
}

const ZOOMS = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.5];
const A4_WIDTH_PX = 794;

export default function EditorCanvas({
  resume,
  printRef,
  pdfSnapshotRef,
  pdfExportSnapshot = false,
  selectedSectionId,
  onSelectSection,
  mode = "edit",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.9);
  const [autoFit, setAutoFit] = useState(true);

  useEffect(() => {
    if (!autoFit) return;
    const wrap = wrapperRef.current;
    if (!wrap) return;
    function fit() {
      if (!wrap) return;
      const padding = 96;
      const available = wrap.clientWidth - padding;
      const next = Math.max(0.4, Math.min(1.2, available / A4_WIDTH_PX));
      setZoom(Number(next.toFixed(2)));
    }
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [autoFit]);

  function step(delta: number) {
    setAutoFit(false);
    const idx = ZOOMS.findIndex((z) => z >= zoom);
    const next = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, idx + delta))];
    setZoom(next);
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#f3f4f9]">
      {mode === "edit" && (
        <div className="no-print z-20 flex justify-center border-b border-ink-100 bg-white/95 px-4 py-2 backdrop-blur">
          <InlineFormatToolbar />
        </div>
      )}
      <div
        ref={wrapperRef}
        className="thin-scroll flex-1 overflow-auto p-8"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onSelectSection(null);
        }}
      >
        <div className="mx-auto" style={{ width: A4_WIDTH_PX * zoom }}>
          <div
            ref={(node) => {
              if (printRef) printRef.current = node;
            }}
            className="print-area shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              width: A4_WIDTH_PX,
              borderRadius: 4,
              overflow: mode === "edit" ? "visible" : "hidden",
            }}
          >
            <TemplateRenderer
              resume={resume}
              mode={mode}
              selectedSectionId={selectedSectionId}
              onSelectSection={onSelectSection}
            />
          </div>
        </div>
        {mode === "edit" && (
          <p className="mt-6 text-center text-[11px] text-ink-400">
            Click any text to edit · Hover a section for drag · hide · remove · Click a skills block to switch to <strong>Pie</strong>, <strong>Bars</strong>, <strong>Dots</strong> or <strong>Tags</strong>.
          </p>
        )}
      </div>

      {/* Hidden full-size preview used only for PDF snapshot (no zoom, no editor chrome). */}
      {pdfExportSnapshot && (
        <div
          aria-hidden
          className="no-print"
          style={{
            position: "fixed",
            left: "-14000px",
            top: 0,
            width: A4_WIDTH_PX,
            pointerEvents: "none",
          }}
        >
          <div
            ref={(node) => {
              if (pdfSnapshotRef) pdfSnapshotRef.current = node;
            }}
            className="print-area"
            style={{
              width: A4_WIDTH_PX,
              overflow: "hidden",
              borderRadius: 0,
              boxShadow: "none",
            }}
          >
            <TemplateRenderer
              resume={resume}
              mode="preview"
              shadowless
              selectedSectionId={null}
              onSelectSection={() => {}}
            />
          </div>
        </div>
      )}

      {/* Floating zoom controls */}
      <div className="no-print absolute bottom-5 right-5 z-20 inline-flex flex-col items-stretch overflow-hidden rounded-xl border border-ink-200 bg-white text-sm shadow-pop">
        <button
          type="button"
          onClick={() => step(1)}
          className="grid h-8 w-10 place-items-center hover:bg-ink-50"
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setAutoFit(true)}
          className="grid h-7 w-10 place-items-center text-[10.5px] font-semibold text-ink-600 hover:bg-ink-50"
          title="Auto-fit page"
        >
          {autoFit ? "Fit" : `${Math.round(zoom * 100)}%`}
        </button>
        <button
          type="button"
          onClick={() => step(-1)}
          className="grid h-8 w-10 place-items-center hover:bg-ink-50"
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}
