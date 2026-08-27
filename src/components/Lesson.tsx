import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { Diagram } from "@/components/Diagrams";
import type { LessonBlock } from "@/lib/lessons";

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

export function Lesson({ blocks }: { blocks: LessonBlock[] }) {
  if (!blocks.length) return null;
  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Lesson</h2>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </section>
  );
}
