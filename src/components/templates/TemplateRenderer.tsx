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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Resume } from "../../types/resume";
import { templateById } from "../../data/mockTemplates";
import { TemplateBindingsProvider } from "./TemplateContext";
import type { EditMode } from "./TemplateContext";
import SidebarLayout from "./layouts/SidebarLayout";
import ClassicLayout from "./layouts/ClassicLayout";
import BannerLayout from "./layouts/BannerLayout";
import MinimalLayout from "./layouts/MinimalLayout";
import TwoColLayout from "./layouts/TwoColLayout";
import { useEditor } from "../../store/EditorContext";
import "./templates.css";

interface Props {
  resume: Resume;
  shadowless?: boolean;
  mode?: EditMode;
  selectedSectionId?: string | null;
  onSelectSection?: (id: string | null) => void;
}

export function TemplateRenderer({
  resume,
  shadowless,
  mode = "preview",
  selectedSectionId = null,
  onSelectSection,
}: Props) {
  const { dispatch } = useEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = resume.sections.map((s) => s.id);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    dispatch({ type: "REORDER_SECTIONS", resumeId: resume.id, from, to });
  }

  const inner = (() => {
    const cfg = templateById(resume.templateId);
    const layout = cfg?.layoutId ?? "sidebar-left";
    switch (layout) {
      case "sidebar-left":
        return <SidebarLayout resume={resume} side="left" shadowless={shadowless} />;
      case "sidebar-right":
        return <SidebarLayout resume={resume} side="right" shadowless={shadowless} />;
      case "classic":
        return <ClassicLayout resume={resume} variant="centered" shadowless={shadowless} />;
      case "classic-left":
        return <ClassicLayout resume={resume} variant="left" shadowless={shadowless} />;
      case "banner":
        return <BannerLayout resume={resume} shadowless={shadowless} />;
      case "banner-solid":
        return <BannerLayout resume={resume} shadowless={shadowless} solid />;
      case "minimal":
        return <MinimalLayout resume={resume} shadowless={shadowless} />;
      case "two-col":
      case "two-col-accent":
        return <TwoColLayout resume={resume} shadowless={shadowless} />;
    }
  })();

  const provided = (
    <TemplateBindingsProvider
      value={{
        mode,
        resumeId: resume.id,
        dispatch,
        selectedSectionId,
        setSelectedSectionId: onSelectSection ?? (() => undefined),
      }}
    >
      {inner}
    </TemplateBindingsProvider>
  );

  if (mode !== "edit") return provided;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={resume.sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        {provided}
      </SortableContext>
    </DndContext>
  );
}
