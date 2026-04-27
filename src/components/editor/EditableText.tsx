import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { cn } from "../../lib/classnames";
import { tryMarkdownListOnSpace } from "../../lib/markdownListTrigger";
import { sanitizeResumeHtml, setRichTextContent } from "../../lib/sanitizeHtml";
import { useTemplateReadOnly } from "../templates/TemplateContext";

export interface EditableTextHandle {
  focus: () => void;
}

interface Props {
  value: string;
  onCommit: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "li";
  className?: string;
  style?: CSSProperties;
  /** Called on Enter when not multiline. */
  onEnter?: () => void;
  /** Called on Backspace when content is empty. */
  onBackspaceEmpty?: () => void;
  /** Disable editing entirely (preview/share view). */
  readOnly?: boolean;
  ariaLabel?: string;
  /**
   * When true, store sanitised `innerHTML` (lists, bold, links) in `value` instead
   * of `innerText` — required for the format toolbar to persist bullets and numbering.
   */
  richText?: boolean;
}

/**
 * Inline contentEditable text with:
 *   - commit-on-input (no caret jump): we suppress incoming `value`
 *     re-renders while the field is focused so typing stays smooth.
 *   - placeholder via data-attr (toggled live based on innerText)
 *   - Enter / Backspace shortcuts
 *   - paste-as-plain-text
 */
const EditableText = forwardRef<EditableTextHandle, Props>(function EditableText(
  {
    value,
    onCommit,
    placeholder,
    multiline,
    as = "span",
    className,
    style,
    onEnter,
    onBackspaceEmpty,
  readOnly: readOnlyProp,
  ariaLabel,
  richText = false,
  },
  ref,
) {
  const fromCtx = useTemplateReadOnly();
  const readOnly = readOnlyProp !== undefined ? readOnlyProp : fromCtx;
  const elRef = useRef<HTMLElement | null>(null);
  const focusedRef = useRef(false);
  const isDomEmpty = (t: string) => !t.replace(/\u00a0/g, " ").trim();
  const [empty, setEmpty] = useState(() => isDomEmpty(value));

  useLayoutEffect(() => {
    if (readOnly) focusedRef.current = false;
  }, [readOnly]);

  // Sync external value -> DOM only when not focused, so the user's caret
  // is never disturbed while typing.
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    if (focusedRef.current) return;
    if (richText) {
      if (sanitizeResumeHtml(el.innerHTML) !== value) {
        setRichTextContent(el, value, sanitizeResumeHtml);
      }
      setEmpty(isDomEmpty(el.innerText));
    } else {
      if (el.innerText !== value) {
        el.innerText = value;
      }
      setEmpty(isDomEmpty(value));
    }
  }, [value, richText]);

  useImperativeHandle(ref, () => ({
    focus() {
      const el = elRef.current;
      if (!el) return;
      el.focus();
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    },
  }));

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (readOnly) return;
    if (richText) {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && !e.shiftKey) {
        const k = e.key.toLowerCase();
        if (k === "b" || k === "i" || k === "u") {
          e.preventDefault();
          const cmd = k === "b" ? "bold" : k === "i" ? "italic" : "underline";
          const el = e.currentTarget as HTMLElement;
          el.focus();
          document.execCommand(cmd, false);
          const html = sanitizeResumeHtml(el.innerHTML);
          setEmpty(isDomEmpty(el.innerText));
          if (html !== value) onCommit(html);
          return;
        }
      }
    }
    if (richText && multiline) {
      const el = e.currentTarget;
      if (tryMarkdownListOnSpace(el, e)) {
        return;
      }
    }
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      // commit immediately and call onEnter without forcing blur
      const text = (e.currentTarget as HTMLElement).innerText;
      if (text !== value) onCommit(text);
      onEnter?.();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === "Backspace" && onBackspaceEmpty) {
      const text = (e.currentTarget as HTMLElement).innerText;
      if (!text || text.trim() === "") {
        e.preventDefault();
        onBackspaceEmpty();
      }
    }
  }

  function handleInput(e: React.FormEvent<HTMLElement>) {
    const el = e.currentTarget as HTMLElement;
    if (richText) {
      const html = sanitizeResumeHtml(el.innerHTML);
      setEmpty(isDomEmpty(el.innerText));
      if (html !== value) onCommit(html);
    } else {
      const text = el.innerText;
      setEmpty(isDomEmpty(text));
      if (text !== value) onCommit(text);
    }
  }

  function handleBlur() {
    focusedRef.current = false;
    const el = elRef.current;
    if (!el) return;
    if (richText) {
      const html = sanitizeResumeHtml(el.innerHTML);
      if (html !== value) onCommit(html);
      setEmpty(isDomEmpty(el.innerText));
    } else {
      if (el.innerText !== value) {
        el.innerText = value;
      }
      setEmpty(isDomEmpty(el.innerText));
    }
  }

  function handleCompositionEnd(e: React.CompositionEvent<HTMLElement>) {
    if (readOnly) return;
    const el = e.currentTarget as HTMLElement;
    if (richText) {
      const html = sanitizeResumeHtml(el.innerHTML);
      setEmpty(isDomEmpty(el.innerText));
      if (html !== value) onCommit(html);
    } else {
      const text = el.innerText;
      setEmpty(isDomEmpty(text));
      if (text !== value) onCommit(text);
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        elRef.current = node;
        if (!node) return;
        if (richText) {
          if (sanitizeResumeHtml(node.innerHTML) !== value) {
            setRichTextContent(node, value, sanitizeResumeHtml);
          }
        } else if (node.innerText !== value) {
          node.innerText = value;
        }
      }}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      role="textbox"
      aria-label={ariaLabel ?? placeholder ?? "Editable text"}
      data-placeholder={placeholder}
      spellCheck
      onFocus={() => {
        if (readOnly) return;
        focusedRef.current = true;
        const n = elRef.current;
        if (n) setEmpty(isDomEmpty(n.innerText));
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onInput={handleInput}
      onCompositionEnd={handleCompositionEnd}
      onPaste={handlePaste}
      className={cn(
        readOnly ? "rcp-readonly" : "rcp-editable",
        empty && "rcp-editable--empty",
        className,
      )}
      style={style}
    />
  );
});

export default EditableText;
