/**
 * Inline SVG diagrams for the chapter lessons.
 * Every diagram is token-coloured (currentColor / Tailwind semantic classes)
 * so it themes with the rest of the design system.
 */

export type DiagramKind =
  | "hilbert-vector"
  | "spectral"
  | "bloch-sphere"
  | "bell-circuit"
  | "measurement-noise"
  | "grover-flow"
  | "encoding-map"
  | "vqa-loop"
  | "qnn-layers"
  | "kernel-pipeline"
  | "qgan-loop"
  | "hardware-stack";

const svgProps = {
  className: "h-auto w-full",
  role: "img" as const,
};

function Wire({ y, label }: { y: number; label: string }) {
  return (
    <g>
      <text x={6} y={y + 4} className="fill-muted-foreground font-mono text-[11px]">
        {label}
      </text>
      <line x1={44} y1={y} x2={456} y2={y} className="stroke-border" strokeWidth={1.5} />
    </g>
  );
}

function Gate({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y - 16}
        width={34}
        height={32}
        rx={6}
        className="fill-card stroke-primary"
        strokeWidth={1.5}
      />
      <text
        x={x + 17}
        y={y + 5}
        textAnchor="middle"
        className="fill-foreground font-mono text-[13px]"
      >
        {label}
      </text>
    </g>
  );
}

function Box({
  x,
  y,
  w = 120,
  h = 46,
  title,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={accent ? "fill-primary/15 stroke-primary" : "fill-card stroke-border"}
        strokeWidth={1.5}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 2 : y + h / 2 + 4}
        textAnchor="middle"
        className="fill-foreground text-[12px] font-semibold"
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 14}
          textAnchor="middle"
          className="fill-muted-foreground font-mono text-[10px]"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className="stroke-primary/70"
      strokeWidth={1.5}
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd="url(#arrowhead)"
    />
  );
}

function Defs() {
  return (
    <defs>
      <marker
        id="arrowhead"
        markerWidth={8}
        markerHeight={8}
        refX={7}
        refY={3}
        orient="auto"
      >
        <path d="M0,0 L7,3 L0,6 Z" className="fill-primary/70" />
      </marker>
    </defs>
  );
}

function HilbertVector() {
  return (
    <svg {...svgProps} viewBox="0 0 480 220" aria-label="A qubit state as a vector in a 2D complex plane">
      <Defs />
      <line x1={60} y1={190} x2={430} y2={190} className="stroke-border" strokeWidth={1.5} />
      <line x1={60} y1={190} x2={60} y2={24} className="stroke-border" strokeWidth={1.5} />
      <text x={436} y={194} className="fill-muted-foreground font-mono text-[12px]">|0⟩</text>
      <text x={44} y={20} className="fill-muted-foreground font-mono text-[12px]">|1⟩</text>
      <line x1={60} y1={190} x2={300} y2={70} className="stroke-primary" strokeWidth={2.5} markerEnd="url(#arrowhead)" />
      <line x1={300} y1={70} x2={300} y2={190} className="stroke-primary/40" strokeWidth={1.2} strokeDasharray="4 4" />
      <line x1={60} y1={70} x2={300} y2={70} className="stroke-primary/40" strokeWidth={1.2} strokeDasharray="4 4" />
      <text x={182} y={118} className="fill-primary font-mono text-[13px]">|ψ⟩</text>
      <text x={170} y={208} className="fill-muted-foreground font-mono text-[11px]">α = ⟨0|ψ⟩</text>
      <text x={306} y={126} className="fill-muted-foreground font-mono text-[11px]">β = ⟨1|ψ⟩</text>
      <text x={60} y={214} className="fill-muted-foreground font-mono text-[11px]">|α|² + |β|² = 1</text>
    </svg>
  );
}

function Spectral() {
  return (
    <svg {...svgProps} viewBox="0 0 480 180" aria-label="Spectral decomposition of a Hermitian operator">
      <Defs />
      <Box x={10} y={62} w={110} title="A = A†" sub="observable" accent />
      <Arrow x1={124} y1={85} x2={158} y2={85} />
      <Box x={162} y={62} w={130} title="Diagonalise" sub="A = Σ λᵢ |vᵢ⟩⟨vᵢ|" />
      <Arrow x1={296} y1={85} x2={330} y2={85} />
      <Box x={334} y={20} w={136} h={44} title="Eigenvalues λᵢ" sub="measured values" />
      <Box x={334} y={104} w={136} h={44} title="Projectors |vᵢ⟩⟨vᵢ|" sub="p(λᵢ) = |⟨vᵢ|ψ⟩|²" />
      <Arrow x1={302} y1={78} x2={330} y2={46} />
      <Arrow x1={302} y1={94} x2={330} y2={122} />
    </svg>
  );
}

function BlochSphere() {
  return (
    <svg {...svgProps} viewBox="0 0 480 300" aria-label="The Bloch sphere with theta and phi angles">
      <Defs />
      <circle cx={240} cy={150} r={110} className="fill-primary/5 stroke-border" strokeWidth={1.5} />
      <ellipse cx={240} cy={150} rx={110} ry={34} className="fill-none stroke-border" strokeWidth={1.2} strokeDasharray="4 4" />
      <line x1={240} y1={40} x2={240} y2={260} className="stroke-border" strokeWidth={1.2} />
      <line x1={130} y1={150} x2={350} y2={150} className="stroke-border" strokeWidth={1.2} />
      <line x1={240} y1={150} x2={318} y2={82} className="stroke-primary" strokeWidth={2.5} markerEnd="url(#arrowhead)" />
      <path d="M240 100 A 50 50 0 0 1 274 116" className="fill-none stroke-star" strokeWidth={1.8} />
      <text x={250} y={104} className="fill-star font-mono text-[12px]">θ</text>
      <path d="M240 150 m 40 0 a 40 12 0 0 1 -22 11" className="fill-none stroke-success" strokeWidth={1.8} />
      <text x={272} y={176} className="fill-success font-mono text-[12px]">φ</text>
      <text x={228} y={30} className="fill-muted-foreground font-mono text-[12px]">|0⟩</text>
      <text x={228} y={282} className="fill-muted-foreground font-mono text-[12px]">|1⟩</text>
      <text x={356} y={154} className="fill-muted-foreground font-mono text-[12px]">|+⟩</text>
      <text x={90} y={154} className="fill-muted-foreground font-mono text-[12px]">|−⟩</text>
      <text x={322} y={74} className="fill-primary font-mono text-[12px]">|ψ⟩</text>
      <text x={110} y={288} className="fill-muted-foreground font-mono text-[11px]">
        |ψ⟩ = cos(θ/2)|0⟩ + e^{"{"}iφ{"}"} sin(θ/2)|1⟩
      </text>
    </svg>
  );
}

function BellCircuit() {
  return (
    <svg {...svgProps} viewBox="0 0 480 160" aria-label="Bell state circuit: Hadamard followed by CNOT and measurement">
      <Defs />
      <Wire y={50} label="q0 |0⟩" />
      <Wire y={110} label="q1 |0⟩" />
      <Gate x={90} y={50} label="H" />
      <circle cx={200} cy={50} r={6} className="fill-primary" />
      <line x1={200} y1={50} x2={200} y2={110} className="stroke-primary" strokeWidth={1.5} />
      <circle cx={200} cy={110} r={12} className="fill-card stroke-primary" strokeWidth={1.5} />
      <line x1={188} y1={110} x2={212} y2={110} className="stroke-primary" strokeWidth={1.5} />
      <line x1={200} y1={98} x2={200} y2={122} className="stroke-primary" strokeWidth={1.5} />
      <Gate x={300} y={50} label="M" />
      <Gate x={300} y={110} label="M" />
      <text x={352} y={54} className="fill-muted-foreground font-mono text-[11px]">50% |00⟩</text>
      <text x={352} y={114} className="fill-muted-foreground font-mono text-[11px]">50% |11⟩</text>
      <text x={44} y={150} className="fill-muted-foreground font-mono text-[11px]">
        (|00⟩ + |11⟩)/√2 — outcomes are perfectly correlated
      </text>
    </svg>
  );
}

function MeasurementNoise() {
  return (
    <svg {...svgProps} viewBox="0 0 480 190" aria-label="Pipeline from a pure state through noise channels to sampled counts">
      <Defs />
      <Box x={8} y={70} w={104} title="Pure |ψ⟩" sub="coherent" accent />
      <Arrow x1={116} y1={93} x2={146} y2={93} />
      <Box x={150} y={70} w={112} title="Noise channel" sub="T1 / T2 / gate" />
      <Arrow x1={266} y1={93} x2={296} y2={93} />
      <Box x={300} y={70} w={104} title="Mixed ρ" sub="Tr(ρ²) < 1" />
      <Arrow x1={408} y1={93} x2={438} y2={93} />
      <text x={442} y={97} className="fill-muted-foreground font-mono text-[11px]">shots</text>
      <text x={8} y={30} className="fill-foreground text-[12px] font-semibold">Decoherence pipeline</text>
      <text x={8} y={166} className="fill-muted-foreground font-mono text-[11px]">
        Fidelity F(ψ, ρ) = ⟨ψ|ρ|ψ⟩ drops as depth × error rate grows
      </text>
    </svg>
  );
}

function GroverFlow() {
  return (
    <svg {...svgProps} viewBox="0 0 480 240" aria-label="Grover search loop: superposition, oracle, diffusion, measure">
      <Defs />
      <Box x={20} y={20} w={130} title="1. Superposition" sub="H⊗n |0…0⟩" accent />
      <Arrow x1={150} y1={43} x2={310} y2={43} />
      <Box x={314} y={20} w={130} title="2. Oracle" sub="phase-flip |w⟩" />
      <Arrow x1={379} y1={66} x2={379} y2={104} />
      <Box x={314} y={108} w={130} title="3. Diffusion" sub="2|s⟩⟨s| − I" />
      <Arrow x1={314} y1={131} x2={154} y2={131} />
      <Box x={20} y={108} w={130} title="repeat √N times" sub="amplitude grows" />
      <Arrow x1={85} y1={154} x2={85} y2={190} />
      <Box x={20} y={194} w={130} title="4. Measure" sub="finds |w⟩ w.h.p." accent />
      <text x={170} y={200} className="fill-muted-foreground font-mono text-[11px]">
        Classical: O(N) · Grover: O(√N)
      </text>
      <text x={170} y={220} className="fill-muted-foreground font-mono text-[11px]">
        N = 1,000,000 → ~1000 iterations
      </text>
    </svg>
  );
}

function EncodingMap() {
  return (
    <svg {...svgProps} viewBox="0 0 480 220" aria-label="Comparison of basis, angle and amplitude encoding">
      <Defs />
      <Box x={10} y={86} w={110} title="Classical x" sub="ℝⁿ feature row" accent />
      <Arrow x1={124} y1={100} x2={166} y2={44} />
      <Arrow x1={124} y1={109} x2={166} y2={109} />
      <Arrow x1={124} y1={118} x2={166} y2={176} />
      <Box x={170} y={22} w={150} title="Basis encoding" sub="n bits → n qubits" />
      <Box x={170} y={86} w={150} title="Angle encoding" sub="RY(xᵢ) per qubit" />
      <Box x={170} y={154} w={150} title="Amplitude encoding" sub="n values → log₂n qubits" />
      <Arrow x1={324} y1={45} x2={358} y2={45} />
      <Arrow x1={324} y1={109} x2={358} y2={109} />
      <Arrow x1={324} y1={177} x2={358} y2={177} />
      <text x={362} y={49} className="fill-muted-foreground font-mono text-[11px]">exact, wide</text>
      <text x={362} y={113} className="fill-muted-foreground font-mono text-[11px]">shallow, NISQ</text>
      <text x={362} y={181} className="fill-muted-foreground font-mono text-[11px]">compact, deep</text>
    </svg>
  );
}

function VqaLoop() {
  return (
    <svg {...svgProps} viewBox="0 0 480 250" aria-label="Variational hybrid loop between QPU and classical optimiser">
      <Defs />
      <rect x={8} y={8} width={230} height={234} rx={14} className="fill-primary/5 stroke-border" strokeDasharray="5 5" />
      <rect x={246} y={8} width={226} height={234} rx={14} className="fill-card/50 stroke-border" strokeDasharray="5 5" />
      <text x={22} y={30} className="fill-primary font-mono text-[11px] uppercase">QPU</text>
      <text x={260} y={30} className="fill-muted-foreground font-mono text-[11px] uppercase">CPU</text>
      <Box x={30} y={48} w={186} title="Encode data" sub="feature map U(x)" />
      <Arrow x1={123} y1={94} x2={123} y2={124} />
      <Box x={30} y={128} w={186} title="Ansatz U(θ)" sub="parameterised layers" accent />
      <Arrow x1={123} y1={174} x2={123} y2={198} />
      <Box x={30} y={198} w={186} h={38} title="Measure ⟨H⟩" />
      <Arrow x1={218} y1={217} x2={300} y2={196} />
      <Box x={266} y={158} w={186} h={38} title="Loss L(θ)" />
      <Arrow x1={359} y1={158} x2={359} y2={130} />
      <Box x={266} y={84} w={186} title="Gradient" sub="parameter-shift rule" />
      <Arrow x1={359} y1={84} x2={359} y2={60} />
      <Box x={266} y={22} w={186} h={36} title="Optimiser update θ ← θ − η∇L" accent />
      <Arrow x1={266} y1={40} x2={218} y2={110} dashed />
    </svg>
  );
}

function QnnLayers() {
  return (
    <svg {...svgProps} viewBox="0 0 480 200" aria-label="Quantum neural network circuit with repeated encoding and entangling layers">
      <Defs />
      <Wire y={54} label="q0" />
      <Wire y={98} label="q1" />
      <Wire y={142} label="q2" />
      <Gate x={60} y={54} label="RY" />
      <Gate x={60} y={98} label="RY" />
      <Gate x={60} y={142} label="RY" />
      <text x={62} y={30} className="fill-muted-foreground font-mono text-[10px]">encode x</text>
      <Gate x={150} y={54} label="RZ" />
      <Gate x={150} y={98} label="RZ" />
      <Gate x={150} y={142} label="RZ" />
      <text x={148} y={30} className="fill-muted-foreground font-mono text-[10px]">θ layer 1</text>
      <circle cx={230} cy={54} r={5} className="fill-primary" />
      <line x1={230} y1={54} x2={230} y2={98} className="stroke-primary" strokeWidth={1.4} />
      <circle cx={230} cy={98} r={9} className="fill-card stroke-primary" strokeWidth={1.4} />
      <circle cx={262} cy={98} r={5} className="fill-primary" />
      <line x1={262} y1={98} x2={262} y2={142} className="stroke-primary" strokeWidth={1.4} />
      <circle cx={262} cy={142} r={9} className="fill-card stroke-primary" strokeWidth={1.4} />
      <text x={226} y={30} className="fill-muted-foreground font-mono text-[10px]">entangle</text>
      <Gate x={310} y={54} label="RY" />
      <Gate x={310} y={98} label="RY" />
      <Gate x={310} y={142} label="RY" />
      <text x={306} y={30} className="fill-muted-foreground font-mono text-[10px]">θ layer 2</text>
      <Gate x={400} y={54} label="⟨Z⟩" />
      <text x={392} y={30} className="fill-muted-foreground font-mono text-[10px]">readout</text>
      <text x={44} y={186} className="fill-muted-foreground font-mono text-[11px]">
        prediction ŷ = ⟨ψ(x, θ)| Z₀ |ψ(x, θ)⟩
      </text>
    </svg>
  );
}

function KernelPipeline() {
  return (
    <svg {...svgProps} viewBox="0 0 480 200" aria-label="Quantum kernel pipeline feeding a classical SVM">
      <Defs />
      <Box x={8} y={72} w={98} title="xᵢ, xⱼ" sub="data pair" accent />
      <Arrow x1={110} y1={95} x2={140} y2={95} />
      <Box x={144} y={72} w={132} title="Feature map" sub="|φ(x)⟩ = U(x)|0⟩" />
      <Arrow x1={280} y1={95} x2={310} y2={95} />
      <Box x={314} y={72} w={158} title="Fidelity test" sub="K = |⟨φ(xᵢ)|φ(xⱼ)⟩|²" />
      <Arrow x1={393} y1={118} x2={393} y2={150} />
      <Box x={300} y={152} w={172} h={38} title="Classical SVM on kernel K" />
      <text x={8} y={38} className="fill-foreground text-[12px] font-semibold">Kernel estimation runs on hardware, training stays classical</text>
      <text x={8} y={168} className="fill-muted-foreground font-mono text-[11px]">O(m²) circuit</text>
      <text x={8} y={186} className="fill-muted-foreground font-mono text-[11px]">evaluations</text>
    </svg>
  );
}

function QganLoop() {
  return (
    <svg {...svgProps} viewBox="0 0 480 220" aria-label="Quantum GAN adversarial loop between generator and discriminator">
      <Defs />
      <Box x={16} y={20} w={140} title="Noise z" sub="latent input" />
      <Arrow x1={156} y1={43} x2={186} y2={43} />
      <Box x={190} y={20} w={150} title="Quantum generator" sub="G(z, θg)" accent />
      <Arrow x1={265} y1={66} x2={265} y2={98} />
      <Box x={190} y={102} w={150} title="Discriminator" sub="D(·, θd)" />
      <Arrow x1={110} y1={102} x2={186} y2={120} />
      <Box x={16} y={102} w={90} h={46} title="Real data" />
      <Arrow x1={340} y1={125} x2={380} y2={125} />
      <Box x={352} y={158} w={120} h={44} title="real / fake" sub="cross-entropy" />
      <Arrow x1={352} y1={180} x2={200} y2={180} dashed />
      <text x={206} y={198} className="fill-muted-foreground font-mono text-[11px]">
        ∇θg maximise D error · ∇θd minimise it
      </text>
    </svg>
  );
}

function HardwareStack() {
  const rows = [
    { t: "Application", s: "chemistry · finance · ML" },
    { t: "Algorithm / SDK", s: "Qiskit · PennyLane · Cirq" },
    { t: "Compiler & transpiler", s: "routing, gate synthesis" },
    { t: "Error mitigation", s: "ZNE · readout calibration" },
    { t: "Control electronics", s: "microwave pulses, FPGA" },
    { t: "Physical qubits", s: "superconducting · ion trap · photonic" },
  ];
  return (
    <svg {...svgProps} viewBox="0 0 480 300" aria-label="Layers of the quantum computing stack from application to physical qubits">
      <Defs />
      {rows.map((r, i) => (
        <g key={r.t}>
          <rect
            x={40 + i * 6}
            y={12 + i * 46}
            width={400 - i * 12}
            height={38}
            rx={9}
            className={i === 0 || i === 5 ? "fill-primary/15 stroke-primary" : "fill-card stroke-border"}
            strokeWidth={1.4}
          />
          <text x={56 + i * 6} y={36 + i * 46} className="fill-foreground text-[12px] font-semibold">
            {r.t}
          </text>
          <text
            x={430 - i * 6}
            y={36 + i * 46}
            textAnchor="end"
            className="fill-muted-foreground font-mono text-[10px]"
          >
            {r.s}
          </text>
        </g>
      ))}
      <text x={40} y={294} className="fill-muted-foreground font-mono text-[11px]">
        Every layer above the qubits exists to fight decoherence.
      </text>
    </svg>
  );
}

const registry: Record<DiagramKind, () => React.JSX.Element> = {
  "hilbert-vector": HilbertVector,
  spectral: Spectral,
  "bloch-sphere": BlochSphere,
  "bell-circuit": BellCircuit,
  "measurement-noise": MeasurementNoise,
  "grover-flow": GroverFlow,
  "encoding-map": EncodingMap,
  "vqa-loop": VqaLoop,
  "qnn-layers": QnnLayers,
  "kernel-pipeline": KernelPipeline,
  "qgan-loop": QganLoop,
  "hardware-stack": HardwareStack,
};

export function Diagram({ kind, caption }: { kind: DiagramKind; caption?: string | undefined }) {
  const Component = registry[kind];
  return (
    <figure className="panel my-6 p-4 sm:p-6">
      <Component />
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">{caption}</figcaption>
      )}
    </figure>
  );
}
