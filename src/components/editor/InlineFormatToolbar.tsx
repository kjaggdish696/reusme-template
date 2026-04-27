import { useEffect, useState } from "react";
import { cn } from "../../lib/classnames";
import { useRichTextCommandExecutor } from "../../lib/richTextCommands";

/**
 * Floating rich-text toolbar driven by document.execCommand.
 * Acts on whichever EditableText currently has focus.
 */
export default function InlineFormatToolbar() {
  const [hasEditable, setHasEditable] = useState(false);
  const [activeMarks, setActiveMarks] = useState<Record<string, boolean>>({});
  const { captureSelection, exec } = useRichTextCommandExecutor();

  useEffect(() => {
    function refresh() {
      const el = document.activeElement as HTMLElement | null;
      const editable = !!el && el.isContentEditable;
      setHasEditable(editable);
      if (!editable) return;
      try {
        setActiveMarks({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          underline: document.queryCommandState("underline"),
          ul: document.queryCommandState("insertUnorderedList"),
          ol: document.queryCommandState("insertOrderedList"),
        });
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("focusin", refresh);
    document.addEventListener("focusout", refresh);
    document.addEventListener("selectionchange", refresh);
    return () => {
      document.removeEventListener("focusin", refresh);
      document.removeEventListener("focusout", refresh);
      document.removeEventListener("selectionchange", refresh);
    };
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-auto flex flex-wrap items-center gap-1 rounded-xl border border-ink-100 bg-white px-1.5 py-1 shadow-soft transition",
        !hasEditable && "opacity-60",
      )}
      onMouseDownCapture={captureSelection}
    >
      <Select
        title="Font family"
        defaultValue="Default"
        options={["Default", "Inter", "Manrope", "Source Serif 4", "JetBrains Mono"]}
        onChange={(v) => v !== "Default" && exec("fontName", v)}
      />
      <Select
        title="Font size"
        defaultValue="3"
        options={[
          { label: "10", value: "1" },
          { label: "12", value: "2" },
          { label: "14", value: "3" },
          { label: "16", value: "4" },
          { label: "18", value: "5" },
          { label: "24", value: "6" },
          { label: "32", value: "7" },
        ]}
        onChange={(v) => exec("fontSize", v)}
      />
      <Sep />
      <ToolbarBtn
        onClick={() => exec("bold")}
        title="Bold (Ctrl+B)"
        active={activeMarks.bold}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => exec("italic")}
        title="Italic (Ctrl+I)"
        active={activeMarks.italic}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 4h-9M14 20H5M15 4l-6 16" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => exec("underline")}
        title="Underline (Ctrl+U)"
        active={activeMarks.underline}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v8a6 6 0 0 0 12 0V4M5 21h14" />
        </svg>
      </ToolbarBtn>
      <label className="relative inline-flex items-center" title="Text color">
        <span className="grid h-7 w-7 place-items-center rounded-md text-ink-700 hover:bg-ink-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20h16M7 16L12 4l5 12M9 12h6" />
          </svg>
        </span>
        <input
          type="color"
          onChange={(e) => exec("foreColor", e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <Sep />
      <ToolbarBtn onClick={() => exec("justifyLeft")} title="Align left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h10M4 18h13" /></svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("justifyCenter")} title="Align center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M7 12h10M5 18h14" /></svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("justifyRight")} title="Align right">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M10 12h10M7 18h13" /></svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("justifyFull")} title="Justify">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => exec("outdent")} title="Outdent">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 6h10M11 12h10M11 18h10M7 8l-3 4 3 4" /></svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("indent")} title="Indent">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 6h10M11 12h10M11 18h10M3 8l3 4-3 4" /></svg>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => exec("insertOrderedList")}
        title="Numbered list"
        active={activeMarks.ol}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 6h11M10 12h11M10 18h11M4 6h2v0M4 6h1.5v3.5M4 13h2.5l-2.5 2.5H6.5M4 17h2.5v1.25H4M4 18.25h2.5V20H4" /></svg>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => exec("insertUnorderedList")}
        title="Bullet list"
        active={activeMarks.ul}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="5" cy="6" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="18" r="1" fill="currentColor" /><path d="M9 6h12M9 12h12M9 18h12" /></svg>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => {
          const url = prompt("Link URL", "https://");
          if (url) exec("createLink", url);
        }}
        title="Insert link"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5" /></svg>
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => exec("undo")} title="Undo (Ctrl+Z)">↶</ToolbarBtn>
      <ToolbarBtn onClick={() => exec("redo")} title="Redo (Ctrl+Y)">↷</ToolbarBtn>
    </div>
  );
}

interface SelectOpt {
  label: string;
  value: string;
}
function Select({
  title,
  options,
  defaultValue,
  onChange,
}: {
  title: string;
  options: (string | SelectOpt)[];
  defaultValue?: string;
  onChange: (value: string) => void;
}) {
  const opts: SelectOpt[] = options.map((o) =>
    typeof o === "string" ? { label: o, value: o } : o,
  );
  return (
    <select
      title={title}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      className="rounded-md border border-transparent bg-transparent px-2 py-1 text-[12px] font-semibold text-ink-700 hover:bg-ink-100"
    >
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function ToolbarBtn({
  children,
  title,
  onClick,
  active,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "grid h-7 w-7 place-items-center rounded-md text-ink-700 hover:bg-ink-100",
        active && "bg-brand-50 text-brand-700",
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-0.5 inline-block h-4 w-px bg-ink-200" />;
}

/**
 * Same execCommand flow as the main canvas toolbar, for use in the Details
 * panel when editing rich summary/custom (separate selection capture ref).
 */
export function CompactRichTextToolbar() {
  const [activeMarks, setActiveMarks] = useState<Record<string, boolean>>({});
  const { captureSelection, exec } = useRichTextCommandExecutor();

  useEffect(() => {
    function refresh() {
      const el = document.activeElement as HTMLElement | null;
      if (!el?.isContentEditable) return;
      try {
        setActiveMarks({
          bold: document.queryCommandState("bold"),
          italic: document.queryCommandState("italic"),
          underline: document.queryCommandState("underline"),
          ul: document.queryCommandState("insertUnorderedList"),
          ol: document.queryCommandState("insertOrderedList"),
        });
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("selectionchange", refresh);
    return () => document.removeEventListener("selectionchange", refresh);
  }, []);

  return (
    <div
      className="mb-2 flex flex-wrap items-center gap-0.5 rounded-lg border border-ink-200 bg-ink-50/80 px-1 py-0.5"
      onMouseDownCapture={captureSelection}
    >
      <span className="w-full pl-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-500">
        Format
      </span>
      <ToolbarBtn onClick={() => exec("bold")} title="Bold" active={activeMarks.bold}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("italic")} title="Italic" active={activeMarks.italic}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 4h-9M14 20H5M15 4l-6 16" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("underline")} title="Underline" active={activeMarks.underline}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v8a6 6 0 0 0 12 0V4M5 21h14" />
        </svg>
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => exec("insertUnorderedList")} title="Bullets" active={activeMarks.ul}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="5" cy="6" r="1" fill="currentColor" />
          <circle cx="5" cy="12" r="1" fill="currentColor" />
          <path d="M9 6h12M9 12h12" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("insertOrderedList")} title="Numbered" active={activeMarks.ol}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 6h10M8 12h10M4 6h0M4 12h0" />
        </svg>
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn onClick={() => exec("outdent")} title="Outdent">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 4h8M8 8h8M8 12h8M4 5l2 3-2 3" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn onClick={() => exec("indent")} title="Indent">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 4h8M8 8h8M8 12h8M12 5l-2 3 2 3" />
        </svg>
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => {
          const url = prompt("Link URL", "https://");
          if (url) exec("createLink", url);
        }}
        title="Link"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 7h6a3 3 0 0 1 0 6h-1M9 12H7a3 3 0 0 1 0-6h1" />
        </svg>
      </ToolbarBtn>
    </div>
  );
}
