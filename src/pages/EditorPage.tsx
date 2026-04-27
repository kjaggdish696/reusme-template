import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEditor, useResume } from "../store/EditorContext";
import StructureOutline from "../components/editor/StructureOutline";
import CustomizationPanel from "../components/editor/CustomizationPanel";
import TemplatePicker from "../components/editor/TemplatePicker";
import EditorCanvas from "../components/editor/EditorCanvas";
import QuickThemeBar from "../components/editor/QuickThemeBar";
import SectionDetails from "../components/editor/SectionDetails";
import { printToPDF, rasterizeToPDF } from "../lib/export";
import { downloadDocx } from "../lib/exportDocx";
import { cn } from "../lib/classnames";

type Tab = "outline" | "details" | "templates" | "design";
type ViewMode = "edit" | "preview";

export default function EditorPage() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const resume = useResume(resumeId);
  const { dispatch, canUndo, canRedo, saveStatus, saveActiveResume } = useEditor();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const pdfSnapshotRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("outline");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  /** Mounts a hidden 1:1 preview clone for raster PDF export. */
  const [pdfExportSnapshot, setPdfExportSnapshot] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

  const [panelWidth, setPanelWidth] = useState(320);

  /** Selecting a section on the canvas opens Details immediately (no second rail click). */
  function handleSelectSection(id: string | null) {
    setSelectedSectionId(id);
    if (id !== null && viewMode === "edit") {
      setTab("details");
    }
  }

  useEffect(() => {
    if (!resume) return;
    dispatch({ type: "SET_ACTIVE", resumeId: resume.id });
  }, [resume, dispatch]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const isEditing =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      const meta = e.ctrlKey || e.metaKey;

      // Ctrl + S for Save
      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveActiveResume();
        return;
      }

      if (meta && e.key.toLowerCase() === "p") {
        e.preventDefault();
        printToPDF();
        return;
      }
      if (isEditing) return;
      if (meta && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "UNDO" });
      } else if (
        (meta && e.shiftKey && e.key.toLowerCase() === "z") ||
        (meta && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        dispatch({ type: "REDO" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, saveActiveResume]);

  if (!resume) return <Navigate to="/dashboard" replace />;

  async function handleRasterExport() {
    setExporting(true);
    flushSync(() => setPdfExportSnapshot(true));
    try {
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r())),
      );
      if (document.fonts?.ready) {
        try {
          await document.fonts.ready;
        } catch {
          /* ignore */
        }
      }
      let el = pdfSnapshotRef.current;
      if (!el) {
        await new Promise<void>((r) => setTimeout(r, 80));
        el = pdfSnapshotRef.current;
      }
      if (!el) {
        window.alert(
          "Could not prepare the export view. Use the menu → “Print · Save as PDF”, or try again.",
        );
        return;
      }
      const safeName =
        `${(resume!.title || "resume").replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_")}.pdf`;
      await rasterizeToPDF(el, safeName);
    } catch (e) {
      console.error(e);
      window.alert(
        "Could not build the PDF file. Use the menu → “Print · Save as PDF” for a reliable export, or try again.",
      );
    } finally {
      setPdfExportSnapshot(false);
      setExporting(false);
      setDownloadOpen(false);
    }
  }

  async function handleDocx() {
    setExporting(true);
    try {
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await downloadDocx(resume!);
    } catch (e) {
      console.error(e);
      window.alert("Could not create the Word file. Check the console for details and try again.");
    } finally {
      setExporting(false);
      setDownloadOpen(false);
    }
  }

  function handleShare() {
    const url = `${window.location.origin}/share/${resume!.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => undefined);
      alert(`Share link copied to clipboard:\n${url}`);
    } else {
      alert(`Share link:\n${url}`);
    }
  }

  return (
    <div className="flex h-[calc(100vh-57px)] flex-col bg-ink-50">
      {/* App top bar */}
      <div className="no-print sticky top-0 z-30 flex items-center gap-2 border-b border-ink-100 bg-white px-3 py-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold text-ink-700 hover:bg-ink-100"
          title="Back to dashboard"
        >
          <span aria-hidden>←</span> Back
        </button>
        <div className="mx-1 h-5 w-px bg-ink-100" />
        <input
          value={resume.title}
          onChange={(e) =>
            dispatch({ type: "RENAME_RESUME", resumeId: resume.id, title: e.target.value })
          }
          className="min-w-[8rem] max-w-[18rem] flex-shrink rounded-md border border-transparent bg-transparent px-2 py-1 text-[14px] font-bold tracking-tight outline-none hover:border-ink-200 focus:border-brand-400"
          placeholder="Untitled Resume"
        />

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => saveActiveResume()}
            disabled={saveStatus === "saving"}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-bold transition",
              saveStatus === "saved"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100",
            )}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Save"}
          </button>
          <div className="mx-1 h-5 w-px bg-ink-100" />
          <ToolBtn
            disabled={!canUndo}
            onClick={() => dispatch({ type: "UNDO" })}
            title="Undo (Ctrl/Cmd + Z)"
            label="↶"
          />
          <ToolBtn
            disabled={!canRedo}
            onClick={() => dispatch({ type: "REDO" })}
            title="Redo (Ctrl/Cmd + Shift + Z)"
            label="↷"
          />
          <div className="mx-1 h-5 w-px bg-ink-100" />
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <div className="mx-1 h-5 w-px bg-ink-100" />
          <button
            type="button"
            onClick={handleShare}
            className="hidden rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink-700 hover:border-ink-300 sm:inline-flex"
          >
            Share
          </button>
          <div className="relative inline-flex overflow-hidden rounded-lg shadow-pop">
            <button
              type="button"
              onClick={handleRasterExport}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 bg-brand-600 px-3 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              title="Download resume as PDF"
            >
              <DownloadIcon />
              {exporting ? "Generating…" : "Download PDF"}
            </button>
            <div className="w-px bg-brand-700/40" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setDownloadOpen((o) => !o)}
              className="inline-flex items-center bg-brand-600 px-2 py-1.5 text-[12.5px] font-semibold text-white transition hover:bg-brand-700"
              title="More download options"
              aria-haspopup="menu"
              aria-expanded={downloadOpen}
            >
              <span className="text-[10px]">▾</span>
            </button>
            {downloadOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDownloadOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-ink-100 bg-white p-1.5 shadow-pop">
                  <DownloadItem
                    title={exporting ? "Generating…" : "Download PDF · one-click"}
                    description="Snapshot the page to a single PDF download."
                    disabled={exporting}
                    onClick={handleRasterExport}
                  />
                  <DownloadItem
                    title="Print · pixel-perfect PDF"
                    description="Browser print → 'Save as PDF'. Vector text & ATS-friendly."
                    onClick={() => {
                      printToPDF();
                      setDownloadOpen(false);
                    }}
                  />
                  <DownloadItem
                    title={exporting ? "Preparing…" : "Download Word (.docx)"}
                    description="Editable Word file from your data (AT-friendly; rich summary is plain text)."
                    disabled={exporting}
                    onClick={handleDocx}
                  />
                  <DownloadItem
                    title="Copy share link"
                    description="Copy a public read-only link."
                    onClick={() => {
                      handleShare();
                      setDownloadOpen(false);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main shell: rail + panel + canvas */}
      <div 
        className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[60px_var(--panel-width)_1fr]"
        style={{ "--panel-width": `${panelWidth}px` } as any}
      >
        {/* Slim icon rail */}
        <nav className="hidden flex-col items-center gap-1 border-r border-ink-100 bg-white py-3 lg:flex">
          <RailButton active={tab === "outline"} onClick={() => setTab("outline")} icon="≡" label="Outline" />
          <RailButton active={tab === "details"} onClick={() => setTab("details")} icon="✎" label="Details" />
          <RailButton active={tab === "templates"} onClick={() => setTab("templates")} icon="◫" label="Templates" />
          <RailButton active={tab === "design"} onClick={() => setTab("design")} icon="✦" label="Design" />
        </nav>

        {/* Side panel */}
        <aside className="thin-scroll flex min-h-0 flex-col overflow-hidden border-r border-ink-100 bg-white">
          <div className="lg:hidden border-b border-ink-100 px-3 py-2">
            <div className="flex items-center gap-1">
              {(["outline", "details", "templates", "design"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition",
                    tab === t ? "bg-brand-600 text-white" : "text-ink-600 hover:bg-ink-100",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mb-4 flex items-center justify-between border-b border-ink-100 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
                {tab}
              </span>
              <button
                type="button"
                onClick={() => setPanelWidth((w) => (w === 320 ? 500 : 320))}
                className="rounded-md border border-ink-100 bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-600 transition hover:bg-ink-50"
              >
                {panelWidth === 320 ? "Expand ⤢" : "Collapse ⤡"}
              </button>
            </div>

            {tab === "outline" && (
              <div className="space-y-4">
                <StructureOutline
                  resume={resume}
                  selectedSectionId={selectedSectionId}
                  onSelectSection={handleSelectSection}
                />
                <QuickThemeBar
                  resume={resume}
                  onOpenTemplates={() => setTab("templates")}
                  onOpenDesign={() => setTab("design")}
                />
              </div>
            )}
            {tab === "details" && (
              <SectionDetails
                resume={resume}
                selectedSectionId={selectedSectionId}
                onSelectSection={handleSelectSection}
                readOnlyText={viewMode === "preview"}
              />
            )}
            {tab === "templates" && (
              <div>
                <p className="mb-3 text-xs text-ink-500">
                  Switch templates anytime — your content stays exactly the same.
                </p>
                <TemplatePicker resume={resume} compact />
              </div>
            )}
            {tab === "design" && <CustomizationPanel resume={resume} />}
          </div>
        </aside>

        {/* Canvas area */}
        <EditorCanvas
          resume={resume}
          printRef={printRef}
          pdfSnapshotRef={pdfSnapshotRef}
          pdfExportSnapshot={pdfExportSnapshot}
          selectedSectionId={selectedSectionId}
          onSelectSection={handleSelectSection}
          mode={viewMode}
        />
      </div>
    </div>
  );
}

function SaveStatus({ status }: { status: "idle" | "saving" | "saved" }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium text-ink-500">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "saving" ? "animate-pulse bg-amber-400" : "bg-emerald-500",
        )}
      />
      {status === "saving" ? "Saving…" : "Auto-saved"}
      {status !== "saving" && (
        <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
          <path d="M3 8l3 3 7-7" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function ToolBtn({
  onClick,
  title,
  label,
  disabled,
}: {
  onClick: () => void;
  title: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="grid h-8 w-8 place-items-center rounded-md text-ink-700 hover:bg-ink-100 disabled:opacity-30"
    >
      {label}
    </button>
  );
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-md bg-ink-100/70 p-0.5">
      <button
        type="button"
        onClick={() => onChange("edit")}
        className={cn(
          "rounded px-2 py-0.5 text-[11px] font-semibold",
          value === "edit" ? "bg-white text-ink-900 shadow" : "text-ink-500",
        )}
        title="Edit mode"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => onChange("preview")}
        className={cn(
          "rounded px-2 py-0.5 text-[11px] font-semibold",
          value === "preview" ? "bg-white text-ink-900 shadow" : "text-ink-500",
        )}
        title="Preview mode"
      >
        Preview
      </button>
    </div>
  );
}

function DownloadItem({
  title,
  description,
  onClick,
  disabled,
}: {
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="block w-full rounded-lg px-3 py-2 text-left text-[12.5px] hover:bg-ink-50 disabled:opacity-50"
    >
      <div className="font-semibold text-ink-900">{title}</div>
      <div className="mt-0.5 text-[11px] text-ink-500">{description}</div>
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m6 11 6 6 6-6" />
      <path d="M5 21h14" />
    </svg>
  );
}

function RailButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative grid h-11 w-11 place-items-center rounded-lg text-base font-bold transition",
        active ? "bg-brand-600 text-white shadow-pop" : "text-ink-500 hover:bg-ink-100",
      )}
      title={label}
    >
      <span aria-hidden>{icon}</span>
      <span className="sr-only">{label}</span>
    </button>
  );
}

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M5.6 5.6 8 8" />
      <path d="M16 16l2.4 2.4" />
      <path d="M5.6 18.4 8 16" />
      <path d="M16 8l2.4-2.4" />
    </svg>
  );
}
