type Value = string | number | false | null | undefined;
type Arg = Value | Record<string, unknown> | Arg[];

export function cn(...args: Arg[]): string {
  const out: string[] = [];
  const visit = (v: Arg) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
    } else if (Array.isArray(v)) {
      v.forEach(visit);
    } else if (typeof v === "object") {
      for (const k of Object.keys(v)) {
        if (v[k]) out.push(k);
      }
    }
  };
  args.forEach(visit);
  return out.join(" ");
}
