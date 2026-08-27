import * as React from "react";
import { useMemo, useState } from "react";
import { RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type InteractiveKind =
  | "bloch-explorer"
  | "measurement-lab"
  | "grover-iterations"
  | "encoding-explorer"
  | "cost-landscape";

/* ---------------------------------------------------------------- shared UI */

function Slider({
  label,
  value,
  min,
  max,
  step = 0.01,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-primary">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-[var(--primary)]"
      />
    </label>
  );
}

function Bar({ label, pct, tone = "primary" }: { label: string; pct: number; tone?: "primary" | "star" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-muted-foreground">{label}</span>
        <span className="font-mono">{pct.toFixed(1)}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-200",
            tone === "primary" ? "bg-primary" : "bg-star",
          )}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
  );
}

function Frame({
  title,
  hint,
  children,
  controls,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  controls: React.ReactNode;
}) {
  return (
    <figure className="panel mt-8 p-5">
      <figcaption className="mb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Interactive</p>
        <h4 className="mt-1 text-base font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      </figcaption>
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0">{children}</div>
        <div className="space-y-4">{controls}</div>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------- bloch explorer */

function BlochExplorer() {
  const [theta, setTheta] = useState(Math.PI / 3);
  const [phi, setPhi] = useState(Math.PI / 4);

  const p0 = Math.cos(theta / 2) ** 2;
  const R = 96;
  const cx = 150;
  const cy = 130;
  // project: x to the right (foreshortened), y into the page, z up
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  const px = cx + R * (x * 0.95 + y * 0.36);
  const py = cy - R * (z - y * 0.28);

  return (
    <Frame
      title="Bloch sphere explorer"
      hint="Drag θ and φ and watch the state vector, the measurement probabilities and the relative phase move together."
      controls={
        <>
          <Slider
            label="Polar angle θ"
            value={theta}
            min={0}
            max={Math.PI}
            display={`${((theta / Math.PI) * 180).toFixed(0)}°`}
            onChange={setTheta}
          />
          <Slider
            label="Azimuth φ"
            value={phi}
            min={0}
            max={2 * Math.PI}
            display={`${((phi / Math.PI) * 180).toFixed(0)}°`}
            onChange={setPhi}
          />
          <div className="space-y-2">
            <Bar label="P(|0⟩)" pct={p0 * 100} />
            <Bar label="P(|1⟩)" pct={(1 - p0) * 100} tone="star" />
          </div>
          <p className="rounded-lg bg-secondary/60 p-3 text-center font-mono text-[11px] leading-relaxed">
            |ψ⟩ = {Math.cos(theta / 2).toFixed(2)}|0⟩ + e^(i{(phi / Math.PI).toFixed(2)}π)
            {Math.sin(theta / 2).toFixed(2)}|1⟩
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { l: "|0⟩", t: 0, p: 0 },
              { l: "|1⟩", t: Math.PI, p: 0 },
              { l: "|+⟩", t: Math.PI / 2, p: 0 },
              { l: "|−⟩", t: Math.PI / 2, p: Math.PI },
              { l: "|i⟩", t: Math.PI / 2, p: Math.PI / 2 },
            ].map((preset) => (
              <Button
                key={preset.l}
                size="sm"
                variant="secondary"
                className="h-7 px-2.5 font-mono text-xs"
                onClick={() => {
                  setTheta(preset.t);
                  setPhi(preset.p);
                }}
              >
                {preset.l}
              </Button>
            ))}
          </div>
        </>
      }
    >
      <svg viewBox="0 0 300 260" className="w-full" role="img" aria-label="Interactive Bloch sphere">
        <circle cx={cx} cy={cy} r={R} fill="var(--primary)" fillOpacity={0.05} stroke="var(--border)" />
        <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.3} fill="none" stroke="var(--border)" strokeDasharray="4 4" />
        <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="var(--border)" />
        <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="var(--border)" />
        <text x={cx} y={cy - R - 10} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px]">
          |0⟩
        </text>
        <text x={cx} y={cy + R + 20} textAnchor="middle" className="fill-muted-foreground font-mono text-[11px]">
          |1⟩
        </text>
        <text x={cx + R + 8} y={cy + 4} className="fill-muted-foreground font-mono text-[11px]">
          |+⟩
        </text>
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--primary)" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={px} cy={py} r={6} fill="var(--primary)" />
        <text x={px + 10} y={py - 6} className="fill-primary font-mono text-[11px]">
          |ψ⟩
        </text>
      </svg>
    </Frame>
  );
}

/* -------------------------------------------------------- measurement lab */

function MeasurementLab() {
  const [angle, setAngle] = useState(Math.PI / 2);
  const [shots, setShots] = useState(256);
  const [counts, setCounts] = useState<{ zero: number; one: number } | null>(null);

  const p0 = Math.cos(angle / 2) ** 2;

  function run() {
    let zero = 0;
    for (let i = 0; i < shots; i++) if (Math.random() < p0) zero++;
    setCounts({ zero, one: shots - zero });
  }

  const measured0 = counts ? (counts.zero / shots) * 100 : null;

  return (
    <Frame
      title="Shots and sampling noise"
      hint="Prepare RY(θ)|0⟩, then sample. Few shots means a noisy estimate of the true probability — this is exactly the noise your optimiser fights."
      controls={
        <>
          <Slider
            label="Rotation RY(θ)"
            value={angle}
            min={0}
            max={Math.PI}
            display={`${((angle / Math.PI) * 180).toFixed(0)}°`}
            onChange={(v) => {
              setAngle(v);
              setCounts(null);
            }}
          />
          <Slider
            label="Shots"
            value={shots}
            min={8}
            max={4096}
            step={8}
            display={String(shots)}
            onChange={(v) => {
              setShots(v);
              setCounts(null);
            }}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={run}>
              <Play className="size-3.5" /> Run circuit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCounts(null)}>
              <RotateCcw className="size-3.5" /> Clear
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Ideal P(|0⟩) = {(p0 * 100).toFixed(1)}%
            {measured0 !== null && ` · sampled ${measured0.toFixed(1)}% (error ${Math.abs(measured0 - p0 * 100).toFixed(1)} pts)`}
          </p>
        </>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-secondary/40 px-4 py-3 text-center font-mono text-sm">
          |0⟩ ── RY({((angle / Math.PI) * 180).toFixed(0)}°) ──▉ measure
        </div>
        <div className="space-y-3">
          <Bar label="ideal |0⟩" pct={p0 * 100} />
          <Bar label="ideal |1⟩" pct={(1 - p0) * 100} />
        </div>
        {counts && (
          <div className="space-y-3 rounded-xl border border-border p-4">
            <p className="font-mono text-[11px] uppercase tracking-wider text-star">Sampled histogram</p>
            <Bar label={`|0⟩ ×${counts.zero}`} pct={(counts.zero / shots) * 100} tone="star" />
            <Bar label={`|1⟩ ×${counts.one}`} pct={(counts.one / shots) * 100} tone="star" />
          </div>
        )}
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------ grover iterations */

function GroverIterations() {
  const [n, setN] = useState(8);
  const [iters, setIters] = useState(2);

  const N = 2 ** n;
  const optimal = Math.round((Math.PI / 4) * Math.sqrt(N));
  const thetaG = Math.asin(1 / Math.sqrt(N));
  const success = Math.sin((2 * iters + 1) * thetaG) ** 2;

  const curve = useMemo(() => {
    const max = Math.max(optimal * 3, 6);
    return Array.from({ length: max + 1 }, (_, k) => Math.sin((2 * k + 1) * thetaG) ** 2);
  }, [optimal, thetaG]);

  const w = 300;
  const h = 160;
  const path = curve
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (curve.length - 1)) * w} ${h - p * (h - 12) - 6}`)
    .join(" ");

  return (
    <Frame
      title="Grover: over-rotation is real"
      hint="Success probability oscillates. Stop at ≈ (π/4)√N — keep going and amplitude rotates back out of the marked state."
      controls={
        <>
          <Slider
            label="Qubits n (N = 2ⁿ)"
            value={n}
            min={2}
            max={12}
            step={1}
            display={`${n} → N=${N}`}
            onChange={(v) => setN(v)}
          />
          <Slider
            label="Iterations"
            value={iters}
            min={0}
            max={Math.max(optimal * 3, 6)}
            step={1}
            display={String(iters)}
            onChange={setIters}
          />
          <Bar label="P(marked item)" pct={success * 100} tone={iters === optimal ? "primary" : "star"} />
          <p className="text-xs text-muted-foreground">
            Optimal ≈ <span className="font-mono text-primary">{optimal}</span> iterations · classical search
            needs ≈ <span className="font-mono">{N / 2}</span> queries.
          </p>
          <Button size="sm" variant="secondary" onClick={() => setIters(optimal)}>
            Snap to optimum
          </Button>
        </>
      }
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Grover success probability curve">
        <line x1={0} y1={h - 6} x2={w} y2={h - 6} stroke="var(--border)" />
        <line x1={0} y1={6} x2={w} y2={6} stroke="var(--border)" strokeDasharray="4 4" />
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth={2} />
        <circle
          cx={(iters / (curve.length - 1)) * w}
          cy={h - success * (h - 12) - 6}
          r={5}
          fill="var(--star)"
        />
        <text x={4} y={16} className="fill-muted-foreground font-mono text-[10px]">
          P = 1
        </text>
      </svg>
    </Frame>
  );
}

/* ------------------------------------------------------ encoding explorer */

function EncodingExplorer() {
  const [f1, setF1] = useState(0.6);
  const [f2, setF2] = useState(-0.3);
  const [layers, setLayers] = useState(1);

  const a1 = f1 * Math.PI * layers;
  const a2 = f2 * Math.PI * layers;
  const z1 = Math.cos(a1);
  const z2 = Math.cos(a2);

  return (
    <Frame
      title="Angle encoding playground"
      hint="Two features become two rotation angles. Extra re-uploading layers multiply the frequency, so the model can fit sharper structure."
      controls={
        <>
          <Slider label="feature x₁" value={f1} min={-1} max={1} display={f1.toFixed(2)} onChange={setF1} />
          <Slider label="feature x₂" value={f2} min={-1} max={1} display={f2.toFixed(2)} onChange={setF2} />
          <Slider
            label="Re-uploading layers"
            value={layers}
            min={1}
            max={5}
            step={1}
            display={String(layers)}
            onChange={setLayers}
          />
          <div className="space-y-2">
            <Bar label="⟨Z₀⟩ mapped" pct={((z1 + 1) / 2) * 100} />
            <Bar label="⟨Z₁⟩ mapped" pct={((z2 + 1) / 2) * 100} tone="star" />
          </div>
          <p className="text-xs text-muted-foreground">
            ⟨Z₀⟩ = {z1.toFixed(3)} · ⟨Z₁⟩ = {z2.toFixed(3)}
          </p>
        </>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        <div className="rounded-xl border border-border bg-secondary/40 p-4">
          <p className="text-muted-foreground">q₀: |0⟩ ─ RY({a1.toFixed(2)}) ─●─ measure Z</p>
          <p className="mt-2 text-muted-foreground">q₁: |0⟩ ─ RY({a2.toFixed(2)}) ─⊕─ measure Z</p>
          <p className="mt-3 text-[11px] text-primary">
            encoding repeated ×{layers} → Fourier degree {layers}
          </p>
        </div>
        <svg viewBox="0 0 300 120" className="w-full" role="img" aria-label="Encoded feature response">
          <path
            d={Array.from({ length: 121 }, (_, i) => {
              const t = -1 + (i / 120) * 2;
              const yv = Math.cos(t * Math.PI * layers);
              return `${i === 0 ? "M" : "L"} ${(i / 120) * 300} ${60 - yv * 48}`;
            }).join(" ")}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
          />
          <circle cx={((f1 + 1) / 2) * 300} cy={60 - z1 * 48} r={5} fill="var(--star)" />
          <line x1={0} y1={60} x2={300} y2={60} stroke="var(--border)" strokeDasharray="4 4" />
        </svg>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------------- cost landscape */

function CostLandscape() {
  const [theta, setTheta] = useState(1.0);
  const [shift, setShift] = useState(Math.PI / 2);

  const cost = (t: number) => 0.5 * (1 - Math.cos(2 * t)) + 0.15 * Math.cos(4 * t);
  const plus = cost(theta + shift);
  const minus = cost(theta - shift);
  const grad = 0.5 * (plus - minus);

  const pts = Array.from({ length: 161 }, (_, i) => {
    const t = (i / 160) * 2 * Math.PI;
    return { t, c: cost(t) };
  });
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(p.t / (2 * Math.PI)) * 300} ${120 - p.c * 80}`)
    .join(" ");
  const px = (theta / (2 * Math.PI)) * 300;

  return (
    <Frame
      title="Parameter-shift on a real landscape"
      hint="Move θ and the shift s. The gradient is just half the difference of two circuit evaluations — no backpropagation through hardware."
      controls={
        <>
          <Slider
            label="Parameter θ"
            value={theta}
            min={0}
            max={2 * Math.PI}
            display={theta.toFixed(2)}
            onChange={setTheta}
          />
          <Slider
            label="Shift s"
            value={shift}
            min={0.1}
            max={Math.PI}
            display={`${(shift / Math.PI).toFixed(2)}π`}
            onChange={setShift}
          />
          <div className="space-y-1 rounded-lg bg-secondary/60 p-3 font-mono text-[11px]">
            <p>L(θ+s) = {plus.toFixed(4)}</p>
            <p>L(θ−s) = {minus.toFixed(4)}</p>
            <p className="text-primary">∂L/∂θ ≈ {grad.toFixed(4)}</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setTheta((t) => Math.max(0, Math.min(2 * Math.PI, t - 0.6 * grad)))}
          >
            Take a gradient step
          </Button>
        </>
      }
    >
      <svg viewBox="0 0 300 140" className="w-full" role="img" aria-label="Cost landscape with shifted evaluations">
        <line x1={0} y1={120} x2={300} y2={120} stroke="var(--border)" />
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth={2} />
        {[
          { v: theta + shift, c: plus },
          { v: theta - shift, c: minus },
        ].map((p, i) => (
          <circle
            key={i}
            cx={((((p.v % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) / (2 * Math.PI)) * 300}
            cy={120 - p.c * 80}
            r={4}
            fill="var(--star)"
          />
        ))}
        <circle cx={px} cy={120 - cost(theta) * 80} r={6} fill="var(--primary)" />
      </svg>
    </Frame>
  );
}

const registry: Record<InteractiveKind, () => React.ReactElement> = {
  "bloch-explorer": BlochExplorer,
  "measurement-lab": MeasurementLab,
  "grover-iterations": GroverIterations,
  "encoding-explorer": EncodingExplorer,
  "cost-landscape": CostLandscape,
};

export function Interactive({ kind }: { kind: InteractiveKind }) {
  const Widget = registry[kind];
  return <Widget />;
}

/** Which interactive widgets belong to which chapter. */
export const interactivesByChapter: Record<string, InteractiveKind[]> = {
  "linear-algebra": ["bloch-explorer"],
  hermitian: ["measurement-lab"],
  bloch: ["bloch-explorer", "measurement-lab"],
  gates: ["bloch-explorer"],
  entanglement: ["measurement-lab"],
  algorithms: ["grover-iterations"],
  encoding: ["encoding-explorer"],
  variational: ["cost-landscape"],
  qnn: ["cost-landscape", "measurement-lab"],
  kernels: ["encoding-explorer"],
  qgan: ["measurement-lab"],
  hardware: ["measurement-lab"],
};
