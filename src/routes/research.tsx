import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, FlaskConical, RefreshCw, Satellite } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Latest Quantum Research — Quantum Learning Algorithms" },
      {
        name: "description",
        content:
          "Freshly fetched quantum computing and quantum machine learning papers, pulled live from the local research feed.",
      },
      { property: "og:title", content: "Latest Quantum Research — Quantum Learning Algorithms" },
      {
        property: "og:description",
        content:
          "Freshly fetched quantum computing and quantum machine learning papers, pulled live from the local research feed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResearchPage,
});

const API_URL = "http://127.0.0.1:5000/get-papers";

interface RawPaper {
  content?: string;
  [key: string]: unknown;
}

interface Paper {
  title: string;
  summary: string;
}

/** Parse a "Title: ... \nAbstract: ..." content string into a Paper. */
function parsePaper(raw: RawPaper, index: number): Paper {
  const content = typeof raw.content === "string" ? raw.content : "";
  const abstractMatch = content.match(/\n?\s*Abstract:\s*/i);
  if (abstractMatch) {
    const titlePart = content.slice(0, abstractMatch.index).replace(/^\s*Title:\s*/i, "");
    const summary = content.slice((abstractMatch.index ?? 0) + abstractMatch[0].length);
    return { title: titlePart.trim() || `Paper ${index + 1}`, summary: summary.trim() };
  }
  const cleaned = content.replace(/^\s*Title:\s*/i, "").trim();
  return { title: cleaned || `Paper ${index + 1}`, summary: "" };
}

async function fetchPapers(): Promise<Paper[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Backend responded with HTTP ${res.status}`);
  const data: unknown = await res.json();
  const list = (data as { papers?: RawPaper[] })?.papers;
  if (!Array.isArray(list)) return [];
  return list.map(parsePaper);
}

function ResearchPage() {
  const [skipCache, setSkipCache] = useState(0);
  const { data, isPending, isError, error, refetch, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["research-papers", skipCache],
    queryFn: fetchPapers,
    staleTime: 0, // always re-check the backend so midnight updates appear on refresh
    retry: 1,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
          <Satellite className="size-3.5" /> Live research feed
        </span>
        <h1 className="mt-5 text-3xl font-semibold sm:text-5xl">
          Latest <span className="text-gradient">quantum research</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          Papers are fetched directly from your local research backend on every visit — when the
          midnight job updates the database, refreshing this page shows the new results instantly.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSkipCache((n) => n + 1);
              void refetch();
            }}
            className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/12 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh feed
          </button>
          {dataUpdatedAt > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              Last updated {new Date(dataUpdatedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </header>

      {isPending && (
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-elevated animate-pulse p-6">
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="mt-4 h-3 w-full rounded bg-muted" />
              <div className="mt-2 h-3 w-5/6 rounded bg-muted" />
              <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="card-elevated mt-12 max-w-2xl border-destructive/50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-destructive">
            <FlaskConical className="size-5" /> Couldn't reach the research backend
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Make sure your local script is serving{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              {API_URL}
            </code>{" "}
            and then refresh the page.
          </p>
          <p className="mt-3 font-mono text-xs text-muted-foreground/70">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      )}

      {data && data.length === 0 && (
        <p className="mt-12 text-sm text-muted-foreground">
          The backend responded, but no papers were found in the feed yet.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {data.map((paper, i) => (
            <article
              key={`${paper.title}-${i}`}
              className="card-elevated group flex flex-col p-6 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                <FileText className="size-3.5 text-primary" />
                Paper {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary">
                {paper.title}
              </h2>
              {paper.summary && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {paper.summary}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
