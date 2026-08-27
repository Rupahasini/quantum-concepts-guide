import type { Chapter, QuizQuestion } from "@/lib/curriculum";

/**
 * Extra chapter-quiz questions layered on top of the two checkpoint questions
 * that ship with each chapter, so every chapter has a real five-question quiz.
 */
const extraQuestions: Record<string, QuizQuestion[]> = {
  "linear-algebra": [
    {
      id: "x-1",
      prompt: "What does the inner product ⟨φ|ψ⟩ return?",
      options: ["A matrix", "A complex number", "A probability vector", "Another ket"],
      answer: 1,
      explanation: "Bra × ket contracts a row with a column, so the result is a single scalar overlap.",
    },
    {
      id: "x-2",
      prompt: "How many complex amplitudes describe a 10-qubit register?",
      options: ["20", "100", "1024", "10"],
      answer: 2,
      explanation: "The tensor product multiplies dimensions: 2¹⁰ = 1024 amplitudes.",
    },
    {
      id: "x-3",
      prompt: "Two states differ only by a global phase e^{iγ}. What changes physically?",
      options: ["Nothing measurable", "All probabilities flip", "Only the norm", "Entanglement is destroyed"],
      answer: 0,
      explanation: "Global phase cancels in |⟨x|ψ⟩|², so it is physically unobservable — relative phase is not.",
    },
  ],
  hermitian: [
    {
      id: "x-1",
      prompt: "Which property guarantees real measurement outcomes?",
      options: ["Unitarity", "Hermiticity", "Normalisation", "Sparsity"],
      answer: 1,
      explanation: "Hermitian operators (A = A†) have real eigenvalues, which are the possible outcomes.",
    },
    {
      id: "x-2",
      prompt: "Why must gate matrices be unitary?",
      options: [
        "To keep the state normalised and the evolution reversible",
        "To make them faster to simulate",
        "So they commute with each other",
        "To force real amplitudes",
      ],
      answer: 0,
      explanation: "U†U = I preserves inner products, so probabilities still sum to one and the step is invertible.",
    },
    {
      id: "x-3",
      prompt: "The expectation value ⟨ψ|H|ψ⟩ of a Hermitian H is always…",
      options: ["Positive", "Real", "An integer", "Zero for pure states"],
      answer: 1,
      explanation: "Hermitian operators give real expectation values — that is what makes them observables.",
    },
  ],
  bloch: [
    {
      id: "x-1",
      prompt: "Which angle on the Bloch sphere controls the |0⟩ / |1⟩ probabilities?",
      options: ["The azimuth φ", "The polar angle θ", "Neither", "Both equally"],
      answer: 1,
      explanation: "P(0) = cos²(θ/2): only the polar angle moves probability between the poles.",
    },
    {
      id: "x-2",
      prompt: "Where does the Hadamard gate send |0⟩ on the sphere?",
      options: ["South pole", "+X axis (|+⟩)", "−Y axis", "It stays at |0⟩"],
      answer: 1,
      explanation: "H rotates the north pole onto the +X equator point |+⟩ = (|0⟩+|1⟩)/√2.",
    },
    {
      id: "x-3",
      prompt: "A Bloch vector with length 0.6 describes what kind of state?",
      options: ["A pure state", "An invalid state", "A mixed / decohered state", "A two-qubit state"],
      answer: 2,
      explanation: "Radius < 1 means a mixed state — decoherence or entanglement with the environment.",
    },
  ],
  gates: [
    {
      id: "x-1",
      prompt: "What does CNOT do when the control qubit is |0⟩?",
      options: ["Flips the target", "Leaves the target unchanged", "Measures the target", "Applies H to both"],
      answer: 1,
      explanation: "CNOT flips the target only on control |1⟩; on |0⟩ it acts as identity.",
    },
    {
      id: "x-2",
      prompt: "Circuit depth mainly matters because…",
      options: [
        "Longer circuits accumulate more decoherence and gate error",
        "Deeper circuits use more qubits",
        "Compilers cannot handle depth",
        "It changes the measurement basis",
      ],
      answer: 0,
      explanation: "On NISQ hardware every extra layer adds noise; depth is the budget you optimise against.",
    },
    {
      id: "x-3",
      prompt: "Which set is universal for quantum computation?",
      options: ["{X, Z}", "{H, T, CNOT}", "{CNOT} alone", "{H} alone"],
      answer: 1,
      explanation: "Clifford+T ({H, T, CNOT}) can approximate any unitary to arbitrary accuracy.",
    },
  ],
  entanglement: [
    {
      id: "x-1",
      prompt: "Measuring one qubit of |Φ⁺⟩ = (|00⟩+|11⟩)/√2 gives 1. The partner is now…",
      options: ["Random", "Definitely |1⟩", "Definitely |0⟩", "Still entangled"],
      answer: 1,
      explanation: "Outcomes of the Bell state are perfectly correlated: 1 here means 1 there.",
    },
    {
      id: "x-2",
      prompt: "Which noise channel randomly flips the phase of a qubit?",
      options: ["Amplitude damping", "Bit-flip channel", "Phase-flip (dephasing) channel", "Depolarising only"],
      answer: 2,
      explanation: "Dephasing applies Z with some probability, destroying relative phase but not populations.",
    },
    {
      id: "x-3",
      prompt: "Entanglement lets you send information faster than light.",
      options: ["True", "False"],
      answer: 1,
      explanation: "Correlations only appear once results are compared over a classical channel — no signalling.",
    },
  ],
  algorithms: [
    {
      id: "x-1",
      prompt: "Grover search over N items needs roughly how many iterations?",
      options: ["log N", "N", "√N", "N²"],
      answer: 2,
      explanation: "Grover gives a quadratic speed-up: ≈ (π/4)√N amplitude-amplification rounds.",
    },
    {
      id: "x-2",
      prompt: "What happens if you run far more Grover iterations than optimal?",
      options: [
        "The success probability keeps rising",
        "It oscillates back down — you over-rotate",
        "The circuit errors out",
        "Nothing changes",
      ],
      answer: 1,
      explanation: "Amplitude amplification is a rotation; past π/2 you rotate away from the marked state.",
    },
    {
      id: "x-3",
      prompt: "Which subroutine underlies Shor's factoring algorithm?",
      options: ["Quantum Fourier transform", "Grover oracle", "Parameter-shift rule", "Swap test"],
      answer: 0,
      explanation: "Period finding via the QFT is the quantum core; the rest is classical number theory.",
    },
  ],
  encoding: [
    {
      id: "x-1",
      prompt: "Amplitude encoding stores N features in how many qubits?",
      options: ["N", "log₂ N", "N²", "2N"],
      answer: 1,
      explanation: "Amplitudes of log₂N qubits hold N normalised values — compact but costly to prepare.",
    },
    {
      id: "x-2",
      prompt: "Angle encoding maps a feature to…",
      options: ["A rotation angle on a qubit", "A measurement basis", "A circuit depth", "An ancilla count"],
      answer: 0,
      explanation: "Each feature becomes an RY/RZ angle — shallow circuits, one qubit per feature.",
    },
    {
      id: "x-3",
      prompt: "Why does data re-uploading help expressivity?",
      options: [
        "It repeats the encoding between trainable layers, raising the Fourier degree of the model",
        "It reduces the qubit count",
        "It removes the need for measurement",
        "It makes the circuit linear",
      ],
      answer: 0,
      explanation: "Repeated encoding layers give the model access to higher-frequency Fourier terms.",
    },
  ],
  variational: [
    {
      id: "x-1",
      prompt: "How many circuit evaluations does the parameter-shift rule need per parameter?",
      options: ["1", "2", "N", "log N"],
      answer: 1,
      explanation: "Two shifted evaluations at ±π/2 give the exact analytic gradient.",
    },
    {
      id: "x-2",
      prompt: "A barren plateau shows up as…",
      options: [
        "Gradients that vanish exponentially with qubit count",
        "Exploding loss values",
        "A hardware calibration error",
        "Too few shots",
      ],
      answer: 0,
      explanation: "Deep random ansätze concentrate expectation values, flattening the landscape.",
    },
    {
      id: "x-3",
      prompt: "Which mitigation most reliably keeps gradients alive?",
      options: [
        "Global cost observables",
        "Deeper random circuits",
        "Local cost functions and shallow, structured ansätze",
        "Higher learning rate",
      ],
      answer: 2,
      explanation: "Local observables plus layerwise/structured initialisation avoid the plateau regime.",
    },
  ],
  qnn: [
    {
      id: "x-1",
      prompt: "In a hybrid QNN, what does the quantum layer actually return to the classical stack?",
      options: ["Raw statevectors", "Expectation values", "Gate matrices", "Qubit indices"],
      answer: 1,
      explanation: "You can only read expectation values (or samples) — that is the interface to autograd.",
    },
    {
      id: "x-2",
      prompt: "Why measure single-qubit Pauli-Z observables per qubit?",
      options: [
        "They form a cheap, local feature vector for the classical head",
        "They are the only measurable operator",
        "They avoid the need to train",
        "They double the qubit count",
      ],
      answer: 0,
      explanation: "Local Z expectations are cheap, low-variance and keep gradients from vanishing.",
    },
    {
      id: "x-3",
      prompt: "Shot noise in a QNN behaves most like…",
      options: ["Weight decay", "Stochastic gradient noise", "Dropout on inputs", "A learning-rate schedule"],
      answer: 1,
      explanation: "Finite sampling gives noisy gradient estimates — the optimiser sees SGD-like noise.",
    },
  ],
  kernels: [
    {
      id: "x-1",
      prompt: "A quantum kernel entry K(x, x′) is computed as…",
      options: [
        "|⟨φ(x)|φ(x′)⟩|² — the fidelity between encoded states",
        "The Euclidean distance of raw features",
        "The circuit depth ratio",
        "A trainable weight",
      ],
      answer: 0,
      explanation: "The fidelity kernel measures overlap of feature-map states, then a classical SVM does the rest.",
    },
    {
      id: "x-2",
      prompt: "How many circuit evaluations does an n-sample kernel matrix need?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      answer: 1,
      explanation: "Every pair needs an overlap estimate — the quadratic cost is the method's main limit.",
    },
    {
      id: "x-3",
      prompt: "Kernel concentration means…",
      options: [
        "Off-diagonal entries collapse toward zero, making the kernel look like the identity",
        "The kernel becomes rank-1",
        "The SVM overfits",
        "Encoding becomes cheaper",
      ],
      answer: 0,
      explanation: "With too-expressive feature maps all states become near-orthogonal and the kernel stops generalising.",
    },
  ],
  qgan: [
    {
      id: "x-1",
      prompt: "In a QGAN the generator is typically…",
      options: [
        "A parameterised quantum circuit sampling a distribution",
        "A classical CNN only",
        "The measurement device",
        "The optimiser",
      ],
      answer: 0,
      explanation: "The PQC produces samples; the discriminator (often classical) scores them.",
    },
    {
      id: "x-2",
      prompt: "Mode collapse in a QGAN shows up as…",
      options: [
        "The generator producing only a few distinct outcomes",
        "The discriminator loss exploding to infinity",
        "Qubits decohering instantly",
        "Gradients becoming exact",
      ],
      answer: 0,
      explanation: "The sampled distribution loses diversity and covers only part of the target support.",
    },
    {
      id: "x-3",
      prompt: "Which metric is commonly used to score the learned distribution?",
      options: ["Kullback–Leibler / total variation distance", "Circuit depth", "T-count", "Qubit fidelity"],
      answer: 0,
      explanation: "Distributional distances (KL, TV, MMD) compare generated and target histograms.",
    },
  ],
  hardware: [
    {
      id: "x-1",
      prompt: "Zero-noise extrapolation works by…",
      options: [
        "Deliberately amplifying noise, then extrapolating results back to the zero-noise limit",
        "Adding error-correcting qubits",
        "Removing all two-qubit gates",
        "Running on a simulator",
      ],
      answer: 0,
      explanation: "Run at several noise scale factors, fit the trend, extrapolate to scale 0.",
    },
    {
      id: "x-2",
      prompt: "Which is generally the dominant error source on today's devices?",
      options: ["Two-qubit gate error", "Single-qubit gate error", "Classical compilation", "Readout latency"],
      answer: 0,
      explanation: "Entangling gates are ~10× noisier than single-qubit gates — minimise and route them carefully.",
    },
    {
      id: "x-3",
      prompt: "Error mitigation differs from error correction because it…",
      options: [
        "Post-processes noisy results instead of encoding logical qubits",
        "Requires millions of physical qubits",
        "Guarantees exact answers",
        "Runs only in simulation",
      ],
      answer: 0,
      explanation: "Mitigation trades extra shots for bias reduction; correction needs redundant encoded qubits.",
    },
  ],
};

/** Full quiz for a chapter: shipped checkpoint questions plus the extra bank. */
export function quizFor(chapter: Chapter): QuizQuestion[] {
  return [...chapter.quiz, ...(extraQuestions[chapter.id] ?? [])];
}
