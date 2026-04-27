import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import type { Resume, ResumeSection } from "../../types/resume";
import { useEditor } from "../../store/EditorContext";
import { SECTION_ICONS } from "../../data/sectionFactories";
import { cn } from "../../lib/classnames";
import AddSectionModal from "./AddSectionModal";

interface Props {
  resume: Resume;
  selectedSectionId?: string | null;
  onSelectSection?: (id: string | null) => void;
}

export default function StructureOutline({ resume, selectedSectionId, onSelectSection }: Props) {
  const { dispatch } = useEditor();
  const [addOpen, setAddOpen] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = resume.sections.findIndex((s) => s.id === active.id);
    const newIndex = resume.sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    dispatch({ type: "REORDER_SECTIONS", resumeId: resume.id, from: oldIndex, to: newIndex });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-300 bg-brand-50/60 px-3 py-2.5 text-[12.5px] font-bold text-brand-700 transition hover:border-brand-400 hover:bg-brand-50"
      >
        <span aria-hidden>+</span> Add Section
      </button>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-500">
          Sections
        </p>
        <span className="text-[10px] text-ink-400">drag to reorder</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={resume.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-1.5">
            {resume.sections.map((section) => (
              <Row
                key={section.id}
                resume={resume}
                section={section}
                selected={selectedSectionId === section.id}
                onSelect={() => onSelectSection?.(section.id)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <AddSectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(type) => dispatch({ type: "ADD_SECTION", resumeId: resume.id, sectionType: type })}
        existingTypes={new Set(resume.sections.map((s) => s.type))}
      />
    </div>
  );
}

function Row({
  resume,
  section,
  selected,
  onSelect,
}: {
  resume: Resume;
  section: ResumeSection;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const { dispatch } = useEditor();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <motion.li
      layout
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-1 rounded-lg border px-2 py-1.5 transition",
        selected
          ? "border-brand-300 bg-brand-50/60"
          : "border-ink-100 bg-white hover:border-ink-200",
        isDragging && "opacity-70 ring-2 ring-brand-300",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="grid h-6 w-5 cursor-grab place-items-center text-ink-300 hover:text-ink-600 active:cursor-grabbing"
        title="Drag to reorder"
        aria-label="Drag handle"
      >
        ⋮⋮
      </button>
      <span className="text-sm">{SECTION_ICONS[section.type]}</span>
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 truncate text-left text-[12.5px] font-semibold text-ink-800 hover:text-brand-700"
        title="Scroll to section"
      >
        {section.title}
      </button>
      <button
        type="button"
        onClick={() =>
          dispatch({
            type: "TOGGLE_SECTION_VISIBILITY",
            resumeId: resume.id,
            sectionId: section.id,
          })
        }
        className={cn(
          "grid h-6 w-6 place-items-center rounded text-xs",
          section.visible
            ? "text-emerald-600 hover:bg-emerald-50"
            : "text-ink-300 hover:bg-ink-100",
        )}
        title={section.visible ? "Hide section" : "Show section"}
      >
        {section.visible ? "👁" : "⊘"}
      </button>
      {section.type !== "personal" && (
        <button
          type="button"
          onClick={() => {
            if (confirm(`Remove "${section.title}"?`)) {
              dispatch({ type: "REMOVE_SECTION", resumeId: resume.id, sectionId: section.id });
            }
          }}
          className="grid h-6 w-6 place-items-center rounded text-xs text-ink-300 hover:bg-red-50 hover:text-red-600"
          title="Remove section"
        >
          ✕
        </button>
      )}
    </motion.li>
  );
}

