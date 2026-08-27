import type { DiagramKind } from "@/components/Diagrams";

export type LessonBlock =
  | { type: "text"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "math"; expr: string; caption?: string }
  | { type: "callout"; tone: "info" | "warn" | "tip"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "diagram"; kind: DiagramKind; caption?: string };

/**
 * Long-form lesson content for each chapter, keyed by chapter id.
 * Rendered by <Lesson /> on /syllabus/$chapterId.
 */
export const lessons: Record<string, LessonBlock[]> = {
  "linear-algebra": [
    {
      type: "text",
      text: "Quantum mechanics is linear algebra with a physical interpretation attached. A quantum state is a unit vector, an operation is a matrix that preserves that unit length, and a measurement probability is the squared size of a projection. Get comfortable with three objects — the ket, the inner product and the tensor product — and every later chapter becomes bookkeeping.",
    },
    { type: "heading", text: "1. States are unit vectors" },
    {
      type: "text",
      text: "A single qubit lives in ℂ², spanned by the computational basis |0⟩ and |1⟩. Any state is a complex combination of the two, and the amplitudes must satisfy the normalisation condition so that measurement probabilities sum to one.",
    },
    { type: "math", expr: "|ψ⟩ = α|0⟩ + β|1⟩ ,   α, β ∈ ℂ ,   |α|² + |β|² = 1", caption: "The two complex amplitudes carry four real numbers; normalisation and global phase remove two of them." },
    {
      type: "diagram",
      kind: "hilbert-vector",
      caption: "A state as a vector: the projections onto the basis axes are the amplitudes, their squared moduli are the probabilities.",
    },
    { type: "heading", text: "2. Dirac notation in one table" },
    {
      type: "table",
      head: ["Symbol", "Name", "What it is", "Result"],
      rows: [
        ["|ψ⟩", "Ket", "Column vector", "A state"],
        ["⟨ψ|", "Bra", "Conjugate transpose row vector", "A functional"],
        ["⟨φ|ψ⟩", "Inner product", "Row × column", "A complex number (overlap)"],
        ["|ψ⟩⟨ψ|", "Outer product", "Column × row", "A projector matrix"],
        ["|a⟩ ⊗ |b⟩", "Tensor product", "Kronecker product", "A joint state"],
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Read the brackets as instructions",
      text: "⟨φ|ψ⟩ collapses to a number, |ψ⟩⟨φ| expands to a matrix. If you can predict the shape of the result you almost never write an invalid expression.",
    },
    { type: "heading", text: "3. Composing registers" },
    {
      type: "text",
      text: "Two qubits are not two separate lists of amplitudes — they are one list of four. The tensor product multiplies dimensions rather than adding them, and that exponential growth is precisely the resource quantum algorithms exploit.",
    },
    { type: "math", expr: "dim(ℋ_n) = 2ⁿ    →    50 qubits ≈ 1.1 × 10¹⁵ amplitudes" },
    {
      type: "steps",
      items: [
        { title: "Write the amplitudes", text: "Stack the complex coefficients into a column vector in basis order |00⟩, |01⟩, |10⟩, |11⟩." },
        { title: "Normalise", text: "Divide by the Euclidean norm √(Σ|cᵢ|²) so the vector sits on the unit sphere." },
        { title: "Check separability", text: "Try to factor the vector as a ⊗ b. If no factorisation exists, the state is entangled." },
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Global phase is invisible",
      text: "|ψ⟩ and e^{iγ}|ψ⟩ produce identical measurement statistics. Relative phase between amplitudes, by contrast, is completely physical and drives interference.",
    },
  ],

  hermitian: [
    {
      type: "text",
      text: "Two families of matrices carry all of quantum mechanics: Hermitian matrices describe what you can measure, unitary matrices describe how states change. Both are defined by a single relationship to the conjugate transpose (the dagger).",
    },
    {
      type: "table",
      head: ["Property", "Definition", "Physical role", "Spectrum"],
      rows: [
        ["Hermitian", "A = A†", "Observable (energy, spin, cost)", "Real eigenvalues"],
        ["Unitary", "U†U = I", "Gate / time evolution", "Eigenvalues on the unit circle"],
        ["Projector", "P² = P = P†", "Measurement outcome", "0 or 1"],
        ["Density matrix", "ρ = ρ†, Tr ρ = 1", "Mixed state", "Non-negative eigenvalues"],
      ],
    },
    { type: "heading", text: "The spectral theorem is the measurement rule" },
    {
      type: "text",
      text: "Diagonalising an observable hands you the measurement model for free: the eigenvalues are the outcomes you can observe, and the eigenprojectors give the probability of each one via the Born rule.",
    },
    { type: "math", expr: "A = Σᵢ λᵢ |vᵢ⟩⟨vᵢ|    →    p(λᵢ) = |⟨vᵢ|ψ⟩|²    →    ⟨A⟩ = Σᵢ λᵢ p(λᵢ)" },
    {
      type: "diagram",
      kind: "spectral",
      caption: "Every observable decomposes into outcomes (eigenvalues) and the projectors that select them.",
    },
    { type: "heading", text: "Why evolution must be unitary" },
    {
      type: "list",
      items: [
        "Unitaries preserve the norm, so probabilities keep summing to 1.",
        "They are invertible: U⁻¹ = U†, which is why every quantum gate is reversible.",
        "Solving the Schrödinger equation for a constant Hamiltonian gives U = e^(−iHt/ħ) — Hermitian generator, unitary evolution.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Pauli matrices are both",
      text: "X, Y and Z are simultaneously Hermitian and unitary. That dual role makes them usable as observables (measure spin along an axis) and as gates (flip or phase a qubit).",
    },
  ],

  bloch: [
    {
      type: "text",
      text: "A single qubit has two complex amplitudes, but global phase and normalisation strip that down to two real angles. Those two angles are exactly the latitude and longitude of a point on a sphere — the Bloch sphere — which makes single-qubit behaviour something you can literally picture.",
    },
    { type: "math", expr: "|ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩ ,   θ ∈ [0, π] ,   φ ∈ [0, 2π)" },
    {
      type: "diagram",
      kind: "bloch-sphere",
      caption: "θ is the polar angle from |0⟩; φ is the azimuthal phase. Gates are rotations, noise pulls the vector inward.",
    },
    { type: "heading", text: "Landmarks worth memorising" },
    {
      type: "table",
      head: ["Point", "State", "θ, φ", "Prepared by"],
      rows: [
        ["North pole", "|0⟩", "θ = 0", "reset"],
        ["South pole", "|1⟩", "θ = π", "X"],
        ["+X", "|+⟩ = (|0⟩+|1⟩)/√2", "θ = π/2, φ = 0", "H"],
        ["−X", "|−⟩ = (|0⟩−|1⟩)/√2", "θ = π/2, φ = π", "X then H"],
        ["+Y", "|i⟩", "θ = π/2, φ = π/2", "H then S"],
      ],
    },
    { type: "heading", text: "Gates as rotations" },
    {
      type: "list",
      items: [
        "RX(α), RY(α), RZ(α) rotate the Bloch vector by α radians about that axis.",
        "H is a π rotation about the (X+Z)/√2 diagonal — it swaps the Z and X axes.",
        "Z, S and T are all Z-rotations by π, π/2 and π/4: pure relative-phase changes, invisible in the computational basis until you interfere them.",
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "The picture stops at one qubit",
      text: "There is no Bloch sphere for two entangled qubits. Reduced states of an entangled pair sit at the centre of the sphere — maximally mixed — which is a useful signature of entanglement, not a picture of it.",
    },
  ],

  gates: [
    {
      type: "text",
      text: "A circuit is a product of unitaries applied left to right in the diagram, right to left in the matrix algebra. Building intuition means knowing a small vocabulary of gates and how they combine into the two operations that matter: superposition and conditional logic.",
    },
    {
      type: "table",
      head: ["Gate", "Qubits", "Effect", "Matrix shorthand"],
      rows: [
        ["X", "1", "Bit flip", "[[0,1],[1,0]]"],
        ["H", "1", "Creates superposition", "(X+Z)/√2"],
        ["Z / S / T", "1", "Phase by π / π/2 / π/4", "diag(1, e^{iα})"],
        ["RY(θ)", "1", "Trainable rotation", "cos(θ/2) I − i sin(θ/2) Y"],
        ["CNOT", "2", "Flip target if control is 1", "|0⟩⟨0|⊗I + |1⟩⟨1|⊗X"],
        ["CZ / CRZ", "2", "Conditional phase", "entangler in QML ansätze"],
      ],
    },
    { type: "heading", text: "The canonical circuit: a Bell pair" },
    {
      type: "diagram",
      kind: "bell-circuit",
      caption: "H creates superposition on q0; CNOT copies that indecision into a correlation. Two gates, maximal entanglement.",
    },
    {
      type: "steps",
      items: [
        { title: "Start in |00⟩", text: "All amplitude sits on the first basis state." },
        { title: "Apply H to q0", text: "State becomes (|00⟩ + |10⟩)/√2 — a product state, still separable." },
        { title: "Apply CNOT (q0 → q1)", text: "The |10⟩ branch flips to |11⟩, giving (|00⟩ + |11⟩)/√2, which cannot be factored." },
        { title: "Measure both", text: "Each qubit is random 50/50, but the two results always agree." },
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Depth is the currency",
      text: "On NISQ hardware only two-qubit gates are expensive and error-prone. Circuit quality is judged by two-qubit gate count and depth, not by how many single-qubit rotations you use.",
    },
  ],

  entanglement: [
    {
      type: "text",
      text: "Entanglement is the statement that a joint state carries information that no assignment of individual states can reproduce. Measurement is the moment those correlations become classical data — and noise is what erodes them before you get there.",
    },
    { type: "heading", text: "Detecting entanglement" },
    {
      type: "list",
      items: [
        "Try to factor: if |ψ⟩ ≠ |a⟩ ⊗ |b⟩ for any single-qubit states, it is entangled.",
        "Trace out one qubit: if the reduced density matrix ρ_A is mixed (Tr ρ_A² < 1), the pair is entangled.",
        "Entanglement entropy S = −Tr(ρ_A log ρ_A) is 0 for product states and 1 bit for a Bell pair.",
      ],
    },
    {
      type: "diagram",
      kind: "measurement-noise",
      caption: "Real devices push pure states into mixed ones. Fidelity is what survives the pipeline.",
    },
    { type: "heading", text: "The three noise budgets" },
    {
      type: "table",
      head: ["Source", "Symptom", "Typical scale", "Mitigation"],
      rows: [
        ["T1 amplitude damping", "|1⟩ decays to |0⟩", "50–300 µs", "shorter circuits"],
        ["T2 dephasing", "relative phase randomises", "30–200 µs", "dynamical decoupling"],
        ["Gate error", "wrong rotation angle", "1e−3 (1q), 1e−2 (2q)", "calibration, ZNE"],
        ["Readout error", "measured bit is flipped", "1–3%", "confusion-matrix inversion"],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "No signalling, no copying",
      text: "Measuring your half of a Bell pair does not transmit information — the marginal statistics stay uniform. And the no-cloning theorem forbids copying an unknown state, which is why quantum error correction has to be indirect.",
    },
  ],

  algorithms: [
    {
      type: "text",
      text: "Quantum speedups are never magic parallelism. Every algorithm follows the same recipe: spread amplitude over all candidates, use interference to make wrong answers cancel, then measure once the right answer dominates.",
    },
    {
      type: "diagram",
      kind: "grover-flow",
      caption: "Grover's loop — oracle marks, diffusion amplifies. Iterate about (π/4)√N times, no more.",
    },
    { type: "heading", text: "The classic four" },
    {
      type: "table",
      head: ["Algorithm", "Problem", "Classical", "Quantum"],
      rows: [
        ["Deutsch–Jozsa", "constant vs balanced", "2^(n−1)+1 queries", "1 query"],
        ["Grover", "unstructured search", "O(N)", "O(√N)"],
        ["Shor", "integer factoring", "sub-exponential", "O((log N)³)"],
        ["QPE / HHL", "eigenvalues, linear systems", "O(N)", "O(log N)* "],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Read the asterisk",
      text: "HHL's exponential speedup assumes efficient state preparation, a well-conditioned matrix, and that you only need a summary statistic of the solution — not the full vector. Most claimed speedups die on data loading.",
    },
    { type: "heading", text: "Why over-iterating hurts" },
    {
      type: "text",
      text: "Grover rotates the state vector by a fixed angle each iteration. Past the optimal count the amplitude on the marked item rotates back down, so the success probability oscillates. Knowing when to stop is part of the algorithm.",
    },
    { type: "math", expr: "k* = ⌊(π/4)√(N/M)⌋   for M marked items among N" },
  ],

  encoding: [
    {
      type: "text",
      text: "Quantum machine learning lives or dies on data loading. A model can only be as good as the map that turns a classical feature row into a quantum state, and every encoding trades qubit count against circuit depth and expressivity.",
    },
    {
      type: "diagram",
      kind: "encoding-map",
      caption: "Three ways into Hilbert space: wide and literal, shallow and NISQ-friendly, or compact but deep.",
    },
    {
      type: "table",
      head: ["Encoding", "Qubits for n features", "Depth", "Best for"],
      rows: [
        ["Basis", "n", "O(1)", "binary data, oracles"],
        ["Angle", "n", "O(1)", "NISQ models, small tabular data"],
        ["Amplitude", "log₂ n", "O(n) (expensive)", "high-dimensional vectors"],
        ["ZZ feature map", "n", "O(n²)", "hard-to-simulate kernels"],
        ["Data re-uploading", "1–n", "layers × n", "expressivity on few qubits"],
      ],
    },
    { type: "heading", text: "The preprocessing checklist" },
    {
      type: "steps",
      items: [
        { title: "Scale", text: "Map features into [0, π] (or [−π, π]) so rotation angles do not wrap around and alias." },
        { title: "Reduce", text: "PCA or feature selection down to the qubit budget — 8–12 features is realistic today." },
        { title: "Normalise", text: "For amplitude encoding, the row must be an L2 unit vector; pad with zeros to the next power of two." },
        { title: "Verify", text: "Sanity-check that distinct inputs give distinguishable states (non-trivial kernel off-diagonal)." },
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Re-uploading beats width",
      text: "Repeating the same encoding block between trainable layers turns a small circuit into a Fourier series with many frequencies — usually more useful than adding qubits.",
    },
  ],

  variational: [
    {
      type: "text",
      text: "Variational algorithms are the workhorse of the NISQ era: a short parameterised circuit runs on the QPU, a classical optimiser owns the loop. The quantum device only ever answers one question — what is the expectation value of this observable?",
    },
    {
      type: "diagram",
      kind: "vqa-loop",
      caption: "The hybrid loop. Anything expensive and stateful stays classical; the quantum device is a fast expectation-value oracle.",
    },
    { type: "heading", text: "Gradients without backpropagation" },
    {
      type: "text",
      text: "You cannot backpropagate through hardware — there is no intermediate state to store. The parameter-shift rule instead recovers exact analytic gradients by evaluating the same circuit at two shifted parameter values.",
    },
    { type: "math", expr: "∂⟨H⟩/∂θᵢ = ½ [ ⟨H⟩(θᵢ + π/2) − ⟨H⟩(θᵢ − π/2) ]", caption: "Two extra circuit evaluations per parameter — exact, not a finite difference." },
    { type: "heading", text: "The barren plateau problem" },
    {
      type: "list",
      items: [
        "Gradients of deep, randomly initialised ansätze vanish exponentially in qubit count.",
        "Mitigations: shallow hardware-efficient ansätze, layerwise training, small or structured initialisation, and local rather than global cost observables.",
        "Local cost functions (measuring single-qubit observables) keep gradients alive far longer than global ones.",
      ],
    },
    {
      type: "table",
      head: ["Algorithm", "Objective", "Typical use"],
      rows: [
        ["VQE", "minimise ⟨H⟩ (ground-state energy)", "chemistry, materials"],
        ["QAOA", "maximise a combinatorial cost", "MaxCut, portfolio, routing"],
        ["VQC", "minimise classification loss", "supervised QML"],
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Shots are your error bars",
      text: "Every expectation value is a sample mean; its standard error scales as 1/√shots. Optimisers that assume noiseless gradients (plain Adam with tiny learning rates) often need SPSA or shot-adaptive schedules instead.",
    },
  ],

  qnn: [
    {
      type: "text",
      text: "A quantum neural network is a variational circuit read as a model: encode the input, apply trainable rotations interleaved with entanglers, and read out an expectation value as the prediction. The 'neurons' are rotation angles; the nonlinearity comes from encoding and measurement, not from an activation function.",
    },
    {
      type: "diagram",
      kind: "qnn-layers",
      caption: "Encode → trainable layer → entangle → trainable layer → measure. Repeat the middle block to add capacity.",
    },
    { type: "heading", text: "Anatomy of a layer" },
    {
      type: "table",
      head: ["Stage", "Classical analogue", "Quantum implementation"],
      rows: [
        ["Input", "input vector", "feature map U(x)"],
        ["Weights", "weight matrix", "RY/RZ angles θ"],
        ["Mixing", "dense connections", "ring of CNOT / CZ"],
        ["Nonlinearity", "ReLU", "measurement + re-uploading"],
        ["Output", "logit", "⟨Z⟩ on a readout qubit"],
      ],
    },
    { type: "heading", text: "Training loop in practice" },
    {
      type: "steps",
      items: [
        { title: "Batch", text: "Sample a mini-batch; run one circuit per example (plus two per parameter for gradients)." },
        { title: "Loss", text: "Map ⟨Z⟩ ∈ [−1, 1] to a probability via (1 + ⟨Z⟩)/2 and apply binary cross-entropy." },
        { title: "Update", text: "Feed parameter-shift gradients to Adam or SPSA on the classical side." },
        { title: "Regularise", text: "Limit depth, share parameters between layers, and monitor gradient variance for plateaus." },
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Benchmark against a classical baseline",
      text: "A logistic regression on the same preprocessed features is the honest control. If the QNN does not beat it, the interesting result is the encoding, not the model.",
    },
  ],

  kernels: [
    {
      type: "text",
      text: "Kernel methods sidestep training a quantum model altogether. You only use the device to estimate similarity between data points in a quantum feature space, then hand that Gram matrix to a classical SVM — convex, reproducible, no barren plateaus.",
    },
    {
      type: "diagram",
      kind: "kernel-pipeline",
      caption: "The quantum part is a fidelity measurement; the learning is classical convex optimisation.",
    },
    { type: "math", expr: "K(xᵢ, xⱼ) = |⟨φ(xᵢ)|φ(xⱼ)⟩|²   estimated by running U(xⱼ)† U(xᵢ)|0⟩ and counting the |0…0⟩ outcome" },
    { type: "heading", text: "Kernel vs variational" },
    {
      type: "table",
      head: ["", "Quantum kernel", "Variational QNN"],
      rows: [
        ["Optimisation", "Convex (SVM)", "Non-convex, plateau-prone"],
        ["Circuit count", "O(m²) for m samples", "O(m × params) per epoch"],
        ["Scaling limit", "dataset size", "circuit depth"],
        ["Noise response", "kernel concentrates toward identity", "biased gradients"],
      ],
    },
    {
      type: "callout",
      tone: "warn",
      title: "Watch for kernel concentration",
      text: "With too many qubits or too expressive a feature map, off-diagonal kernel entries collapse toward zero and the SVM memorises the training set. Keep feature maps shallow and check the kernel's eigenvalue spread before training.",
    },
  ],

  qgan: [
    {
      type: "text",
      text: "Quantum GANs put a parameterised circuit in the generator's seat. Because a quantum circuit natively produces samples from a distribution, generative modelling is one of the more natural fits for near-term hardware — especially for loading distributions that are hard to prepare classically.",
    },
    {
      type: "diagram",
      kind: "qgan-loop",
      caption: "Adversarial training: the generator is a circuit, the discriminator is usually a small classical network.",
    },
    { type: "math", expr: "min_θg max_θd  E_x[log D(x)] + E_z[log(1 − D(G(z, θg)))]" },
    { type: "heading", text: "Three configurations" },
    {
      type: "list",
      items: [
        "Quantum generator + classical discriminator — the standard, most stable setup on today's hardware.",
        "Classical generator + quantum discriminator — rarely useful; the discriminator gains little.",
        "Fully quantum — elegant for learning quantum states themselves (state tomography, data loading for QAE).",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      title: "Stabilising adversarial training on hardware",
      text: "Use shot budgets large enough that the discriminator is not chasing sampling noise, update the discriminator more often than the generator, and consider Wasserstein loss with gradient penalty to avoid mode collapse.",
    },
  ],

  hardware: [
    {
      type: "text",
      text: "Everything above the qubits exists to fight decoherence. Knowing where your circuit sits in the stack tells you which knob actually improves a result: a better ansatz, a smarter transpiler pass, or simply a different backend.",
    },
    {
      type: "diagram",
      kind: "hardware-stack",
      caption: "From application intent down to physical qubits — each layer trades abstraction for fidelity.",
    },
    { type: "heading", text: "Choosing a modality" },
    {
      type: "table",
      head: ["Platform", "Gate speed", "Coherence", "Connectivity", "Trade-off"],
      rows: [
        ["Superconducting", "~10–100 ns", "50–300 µs", "nearest-neighbour", "fast but needs mK cooling"],
        ["Trapped ion", "~10–100 µs", "seconds", "all-to-all", "high fidelity, slow gates"],
        ["Neutral atom", "~1 µs", "~1 s", "reconfigurable", "great scaling, young stack"],
        ["Photonic", "ns", "n/a (flying)", "measurement-based", "room temperature, lossy"],
      ],
    },
    { type: "heading", text: "Getting a usable result today" },
    {
      type: "steps",
      items: [
        { title: "Transpile to the native gate set", text: "Routing on a sparse coupling map can triple your two-qubit gate count — check the depth after transpilation, not before." },
        { title: "Mitigate readout", text: "Calibrate a confusion matrix and invert it; this is the cheapest accuracy win available." },
        { title: "Apply ZNE", text: "Run the circuit at amplified noise levels and extrapolate the expectation value back to zero noise." },
        { title: "Compare to a simulator", text: "Always keep a noiseless reference run so you can attribute error to hardware rather than to your algorithm." },
      ],
    },
    {
      type: "callout",
      tone: "info",
      title: "Error correction is the next threshold",
      text: "Surface codes need roughly 1,000 physical qubits per logical qubit at current error rates. Until then, the discipline is mitigation: shorter circuits, local observables, and honest error bars.",
    },
  ],
};
