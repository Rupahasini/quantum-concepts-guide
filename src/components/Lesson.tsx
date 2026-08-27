import { Circle, CircleCheck, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { Diagram } from "@/components/Diagrams";
import { Interactive, interactivesByChapter } from "@/components/InteractiveDiagrams";
import { Button } from "@/components/ui/button";
import type { LessonBlock } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";

const calloutStyles = {
  info: { ring: "border-primary/40 bg-primary/5", icon: Info, tint: "text-primary" },
  tip: { ring: "border-success/40 bg-success/5", icon: Lightbulb, tint: "text-success" },
  warn: { ring: "border-star/40 bg-star/5", icon: TriangleAlert, tint: "text-star" },
} as const;

function Block({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="mt-10 text-lg font-semibold sm:text-xl">{block.text}</h3>;

    case "text":
      return <p className="mt-4 leading-relaxed text-muted-foreground">{block.text}</p>;

    case "list":
      return (
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3">
              <span className="mt-0.5 font-mono text-xs text-primary">
                {block.ordered ? `${i + 1}.` : "—"}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "math":
      return (
        <figure className="mt-5">
          <div className="overflow-x-auto rounded-xl border border-border bg-secondary/50 px-5 py-4 text-center font-mono text-sm text-foreground">
            {block.expr}
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "callout": {
      const { ring, icon: Icon, tint } = calloutStyles[block.tone];
      return (
        <aside className={`mt-6 rounded-xl border p-4 ${ring}`}>
          <p className={`flex items-center gap-2 text-sm font-semibold ${tint}`}>
            <Icon className="size-4" /> {block.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{block.text}</p>
        </aside>
      );
    }

    case "table":
      return (
        <div className="panel mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {block.head.map((h) => (
                  <th key={h} className="px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-primary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        j === 0
                          ? "px-4 py-3 font-medium text-foreground"
                          : "px-4 py-3 text-muted-foreground"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "steps":
      return (
        <ol className="mt-6 space-y-3">
          {block.items.map((step, i) => (
            <li key={step.title} className="card-elevated flex gap-4 p-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-xs text-primary">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "diagram":
      return <Diagram kind={block.kind} caption={block.caption} />;

    default:
      return null;
  }
}

type Section = { id: string; title: string | null; blocks: LessonBlock[] };

function toSections(blocks: LessonBlock[]): Section[] {
  const sections: Section[] = [];
  for (const block of blocks) {
    if (block.type === "heading" || sections.length === 0) {
      sections.push({
        id: `s${sections.length}`,
        title: block.type === "heading" ? block.text : null,
        blocks: block.type === "heading" ? [] : [block],
      });
      continue;
    }
    sections[sections.length - 1]!.blocks.push(block);
  }
  return sections;
}

export function Lesson({ blocks, chapterId }: { blocks: LessonBlock[]; chapterId: string }) {
  const { sectionsRead, actions } = useProgress();
  const sections = useMemo(() => toSections(blocks), [blocks]);
  const read = sectionsRead[chapterId] ?? [];
  const widgets = interactivesByChapter[chapterId] ?? [];

  if (!sections.length) return null;

  const doneCount = sections.filter((s) => read.includes(s.id)).length;
  const pct = (doneCount / sections.length) * 100;
  const allRead = doneCount === sections.length;

  function markSection(section: Section) {
    const nowRead = actions.toggleSection(chapterId, section.id);
    if (!nowRead) return;
    const nextCount = sections.filter((s) => s.id === section.id || read.includes(s.id)).length;
    if (nextCount === sections.length) {
      const first = actions.completeChapter(chapterId);
      toast.success("Lesson finished", {
        description: first ? "Chapter marked complete — the next one is unlocked." : undefined,
      });
    }
  }

  return (
    <section className="mt-12">
      <div className="sticky top-24 z-10 -mx-4 mb-2 border-y border-border bg-background/85 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="font-mono uppercase tracking-[0.2em] text-primary">Lesson progress</span>
          <span className="font-mono text-muted-foreground">
            {doneCount}/{sections.length} sections
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${allRead ? "bg-success" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {sections.map((section, si) => {
        const isRead = read.includes(section.id);
        const widget = widgets[si === 0 ? 0 : si === Math.floor(sections.length / 2) ? 1 : -1];
        return (
          <div key={section.id} className={isRead ? "opacity-95" : undefined}>
            {section.title && (
              <h3 className="mt-10 flex items-start gap-2 text-lg font-semibold sm:text-xl">
                {isRead && <CircleCheck className="mt-1 size-4 shrink-0 text-success" />}
                {section.title}
              </h3>
            )}
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            {widget && <Interactive kind={widget} />}
            <div className="mt-5 flex justify-end border-b border-dashed border-border pb-6">
              <Button
                size="sm"
                variant={isRead ? "secondary" : "outline"}
                onClick={() => markSection(section)}
              >
                {isRead ? <CircleCheck className="size-3.5" /> : <Circle className="size-3.5" />}
                {isRead ? "Section read" : "Mark section read"}
              </Button>
            </div>
          </div>
        );
      })}
    </section>
  );
}
