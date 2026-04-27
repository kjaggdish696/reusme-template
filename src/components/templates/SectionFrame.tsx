import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTemplateBindings } from "./TemplateContext";
import type { ResumeSection } from "../../types/resume";
import { cn } from "../../lib/classnames";
import SectionToolbar from "./SectionToolbar";

interface Props {
  section: ResumeSection;
  children: ReactNode;
  wrapperClass?: string;
  pinned?: boolean;
}

export default function SectionFrame({ section, children, wrapperClass, pinned }: Props) {
  const { mode } = useTemplateBindings();

  if (mode !== "edit") {
    return <div className={cn("rcp-frame rcp-frame--preview", wrapperClass)}>{children}</div>;
  }
  return (
    <EditableSectionFrame section={section} wrapperClass={wrapperClass} pinned={pinned}>
      {children}
    </EditableSectionFrame>
  );
}

function EditableSectionFrame({ section, children, wrapperClass, pinned }: Props) {
  const { selectedSectionId, setSelectedSectionId } = useTemplateBindings();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [hasFocusInside, setHasFocusInside] = useState(false);

  // Keep section selected when any field inside it gains focus.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    function onFocusIn() {
      setHasFocusInside(true);
      setSelectedSectionId(section.id);
    }
    function onFocusOut(e: FocusEvent) {
      if (!el) return;
      const next = e.relatedTarget as Node | null;
      if (next && el.contains(next)) return;
      setHasFocusInside(false);
    }
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [section.id, setSelectedSectionId]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const selected = selectedSectionId === section.id || hasFocusInside;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        wrapperRef.current = node;
      }}
      style={style}
      className={cn(
        "rcp-frame rcp-frame--edit",
        selected && "rcp-frame--selected",
        isDragging && "rcp-frame--dragging",
        wrapperClass,
      )}
      onMouseDown={() => setSelectedSectionId(section.id)}
    >
      {selected && (
        <SectionToolbar
          section={section}
          pinned={pinned}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      )}
      {children}
    </div>
  );
}
