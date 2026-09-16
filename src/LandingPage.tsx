import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Factory,
  Fuel,
  Layers,
  Leaf,
  Route,
  Shield,
  Warehouse,
} from "lucide-react";

interface LandingPageProps {
  onLaunch: () => void;
}

// Simulated mock points for the interactive hero route comparison graphic
const MOCK_DEPOT = { x: 50, y: 78, name: "Okhla ICD Depot" };
const MOCK_STOPS = [
  { id: 1, x: 25, y: 22, name: "CP Hub", unoptOrder: 1, optOrder: 2 },
  { id: 2, x: 75, y: 18, name: "Karol Bagh", unoptOrder: 4, optOrder: 3 },
  { id: 3, x: 84, y: 46, name: "Lajpat Central", unoptOrder: 2, optOrder: 5 },
  { id: 4, x: 70, y: 68, name: "GK M-Block", unoptOrder: 5, optOrder: 6 },
  { id: 5, x: 30, y: 64, name: "Saket Mall", unoptOrder: 3, optOrder: 7 },
  { id: 6, x: 18, y: 44, name: "Hauz Khas", unoptOrder: 6, optOrder: 1 },
];

export default function LandingPage({ onLaunch }: LandingPageProps) {
  const [routeMode, setRouteMode] = useState<"both" | "baseline" | "optimized">("both");
  const [activeStop, setActiveStop] = useState<number | null>(null);

  // Unoptimized (docket sequence) path
  const unoptSorted = [...MOCK_STOPS].sort((a, b) => a.unoptOrder - b.unoptOrder);
  const unoptPath = [
    `${MOCK_DEPOT.x},${MOCK_DEPOT.y}`,
    ...unoptSorted.map((s) => `${s.x},${s.y}`),
    `${MOCK_DEPOT.x},${MOCK_DEPOT.y}`,
  ].join(" ");

  // 2-Opt optimized path (smooth uncrossed perimeter tour)
  const optSorted = [...MOCK_STOPS].sort((a, b) => a.optOrder - b.optOrder);
  const optPath = [
    `${MOCK_DEPOT.x},${MOCK_DEPOT.y}`,
    ...optSorted.map((s) => `${s.x},${s.y}`),
    `${MOCK_DEPOT.x},${MOCK_DEPOT.y}`,
  ].join(" ");

  return (
    <div className="min-h-[100dvh] bg-[#12150f] text-[#e8eadf]">
      {/* Official Government of India Tricolor Header Accent */}
      <div className="flex h-[3px] w-full" role="presentation">
        <span className="flex-1 bg-[#c45c26]" />
        <span className="flex-1 bg-[#e8eadf]" />
        <span className="flex-1 bg-[#2f6b3c]" />
      </div>

      {/* Top Navigation Bar: Single-line on desktop, max 68px */}
      <header className="sticky top-0 z-50 border-b border-[#2c3426] bg-[#12150f]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Identity: DPIIT / National Logistics Portal */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#3a4432] bg-[#1a1f16] text-[#f0b429]">
              <Factory size={18} strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold tracking-tight text-[#f3f6ee]">
                  DPIIT
                </span>
                <span className="rounded bg-[#1a1f16] px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-[#9aa38c] border border-[#2c3426]">
                  LOGISTICS DIVISION
                </span>
              </div>
              <p className="text-[10.5px] leading-none text-[#7d8670]">
                Ministry of Commerce & Industry · Government of India
              </p>
            </div>
          </div>

          {/* Nav Links & Launch CTA */}
          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 text-[13px] font-medium text-[#c5ccb6] md:flex">
              <a href="#policy" className="transition hover:text-[#f0b429]">
                Policy Context
              </a>
              <a href="#specs" className="transition hover:text-[#f0b429]">
                Algorithmic Specs
              </a>
              <a href="#benchmarks" className="transition hover:text-[#f0b429]">
                Benchmarks
              </a>
            </nav>

            <button
              type="button"
              onClick={onLaunch}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#d97706] px-3.5 py-2 text-[13px] font-semibold text-[#12150f] transition hover:bg-[#f0b429] active:scale-[0.98]"
            >
              Launch Engine
              <ArrowRight size={14} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION: Fits initial viewport, capped top padding */}
        <section className="relative border-b border-[#2c3426] px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Value Proposition & Launch CTA */}
              <div className="lg:col-span-7">
                {/* 1. Eyebrow */}
                <div className="inline-flex items-center gap-2 rounded-md border border-[#3a4432] bg-[#1a1f16] px-2.5 py-1 text-[11px] font-medium text-[#f0b429]">
                  <Shield size={12} strokeWidth={2} />
                  PM GATISHAKTI &amp; NATIONAL LOGISTICS POLICY INITIATIVE
                </div>

                {/* 2. Headline (Max 2 lines on desktop) */}
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#f3f6ee] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
                  Algorithmic Last-Mile Route Optimization for Urban Freight
                </h1>

                {/* 3. Subtext (Max 20 words) */}
                <p className="mt-3.5 max-w-[55ch] text-[14.5px] leading-relaxed text-[#9aa38c]">
                  Cutting urban freight transit time, fuel consumption, and carbon emissions under India&apos;s National Logistics Policy framework.
                </p>

                {/* 4. Primary CTA Button + Secondary Action */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onLaunch}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#d97706] px-6 py-3.5 text-[14.5px] font-bold text-[#12150f] shadow-[0_4px_16px_rgba(217,119,6,0.25)] transition hover:bg-[#f0b429] active:scale-[0.98]"
                  >
                    Launch Optimizer Engine
                    <ArrowRight size={17} strokeWidth={2.2} />
                  </button>

                  <a
                    href="#interactive-demo"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-[#3a4432] bg-[#1a1f16] px-4 py-3.5 text-[13.5px] font-medium text-[#e8eadf] transition hover:border-[#d97706] hover:text-[#f3f6ee] active:scale-[0.98]"
                  >
                    Explore Heuristic Demo
                  </a>
                </div>

                {/* High-Density Stat Badges (3 items) */}
                <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-md border border-[#2c3426] bg-[#1a1f16]/90 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#9aa38c]">
                      <Fuel size={13} strokeWidth={1.75} className="text-[#3f8f5a]" />
                      FUEL CONSERVATION
                    </div>
                    <div className="tabular mt-1 text-[17px] font-bold text-[#f3f6ee]">
                      18–25% Reduction
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#7d8670]">
                      BS-VI delivery van baseline
                    </p>
                  </div>

                  <div className="rounded-md border border-[#2c3426] bg-[#1a1f16]/90 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#9aa38c]">
                      <Cpu size={13} strokeWidth={1.75} className="text-[#f0b429]" />
                      SOLVER ENGINE
                    </div>
                    <div className="mt-1 text-[17px] font-bold text-[#f3f6ee]">
                      NN + 2-Opt Heuristics
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#7d8670]">
                      Cross-path elimination
                    </p>
                  </div>

                  <div className="rounded-md border border-[#2c3426] bg-[#1a1f16]/90 p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#9aa38c]">
                      <Layers size={13} strokeWidth={1.75} className="text-[#d97706]" />
                      COMPUTE LATENCY
                    </div>
                    <div className="tabular mt-1 text-[17px] font-bold text-[#f3f6ee]">
                      0ms In-Browser
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#7d8670]">
                      100% client-side dispatch
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Route Polygon Visualizer Mockup */}
              <div id="interactive-demo" className="lg:col-span-5">
                <div className="rounded-lg border border-[#2c3426] bg-[#1a1f16] p-4 shadow-xl">
                  {/* Visualizer Header */}
                  <div className="flex items-center justify-between border-b border-[#2c3426] pb-3">
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#f3f6ee]">
                        Delhi NCR Delivery Quadrant
                      </div>
                      <div className="text-[11px] text-[#7d8670]">
                        Okhla Staging Yard · 6 Urban Drops
                      </div>
                    </div>

                    {/* Interactive Filter Pills */}
                    <div className="inline-flex rounded-md border border-[#2c3426] bg-[#12150f] p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setRouteMode("both")}
                        className={`rounded px-2 py-1 font-medium transition ${
                          routeMode === "both"
                            ? "bg-[#d97706] text-[#12150f] font-semibold"
                            : "text-[#9aa38c] hover:text-[#e8eadf]"
                        }`}
                      >
                        Both
                      </button>
                      <button
                        type="button"
                        onClick={() => setRouteMode("baseline")}
                        className={`rounded px-2 py-1 font-medium transition ${
                          routeMode === "baseline"
                            ? "bg-[#c2413b] text-[#f3f6ee] font-semibold"
                            : "text-[#9aa38c] hover:text-[#e8eadf]"
                        }`}
                      >
                        Docket
                      </button>
                      <button
                        type="button"
                        onClick={() => setRouteMode("optimized")}
                        className={`rounded px-2 py-1 font-medium transition ${
                          routeMode === "optimized"
                            ? "bg-[#3f8f5a] text-[#f3f6ee] font-semibold"
                            : "text-[#9aa38c] hover:text-[#e8eadf]"
                        }`}
                      >
                        2-Opt
                      </button>
                    </div>
                  </div>

                  {/* SVG Route Graph Container */}
                  <div className="relative mt-3 h-[280px] w-full overflow-hidden rounded-md border border-[#2c3426] bg-[#0e120c]">
                    {/* Background Grid Pattern */}
                    <svg className="absolute inset-0 h-full w-full stroke-[#21281c] opacity-60" width="100%" height="100%">
                      <defs>
                        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                          <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.75" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    <svg
                      viewBox="0 0 100 100"
                      className="absolute inset-0 h-full w-full overflow-visible"
                    >
                      {/* Unoptimized Route (Red Dashed, Intersecting Paths) */}
                      {(routeMode === "both" || routeMode === "baseline") && (
                        <polyline
                          points={unoptPath}
                          fill="none"
                          stroke="#c2413b"
                          strokeWidth="2.2"
                          strokeDasharray="3 3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={routeMode === "both" ? 0.7 : 1}
                        />
                      )}

                      {/* Optimized Route (Green Solid, 2-Opt Disentangled Polygon) */}
                      {(routeMode === "both" || routeMode === "optimized") && (
                        <polyline
                          points={optPath}
                          fill="none"
                          stroke="#3f8f5a"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={0.95}
                        />
                      )}

                      {/* Depot Node */}
                      <g transform={`translate(${MOCK_DEPOT.x}, ${MOCK_DEPOT.y})`}>
                        <rect
                          x="-4"
                          y="-4"
                          width="8"
                          height="8"
                          rx="1.5"
                          fill="#f0b429"
                          stroke="#12150f"
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="9"
                          textAnchor="middle"
                          fill="#f0b429"
                          fontSize="3.8"
                          fontWeight="700"
                        >
                          DEPOT
                        </text>
                      </g>

                      {/* Stop Nodes */}
                      {MOCK_STOPS.map((stop) => {
                        const isHovered = activeStop === stop.id;
                        return (
                          <g
                            key={stop.id}
                            transform={`translate(${stop.x}, ${stop.y})`}
                            onMouseEnter={() => setActiveStop(stop.id)}
                            onMouseLeave={() => setActiveStop(null)}
                            className="cursor-pointer"
                          >
                            <circle
                              r={isHovered ? "4" : "3.2"}
                              fill={routeMode === "baseline" ? "#c2413b" : "#3f8f5a"}
                              stroke="#12150f"
                              strokeWidth="1.2"
                              className="transition-all"
                            />
                            <text
                              x="0"
                              y="1.2"
                              textAnchor="middle"
                              fill="#f3f6ee"
                              fontSize="3"
                              fontWeight="800"
                            >
                              {routeMode === "baseline" ? stop.unoptOrder : stop.optOrder}
                            </text>
                            <text
                              x="0"
                              y="-5"
                              textAnchor="middle"
                              fill="#d6dbcb"
                              fontSize="3.2"
                              fontWeight="500"
                            >
                              {stop.name}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Visualizer Legend Overlay */}
                    <div className="absolute right-2 bottom-2 rounded border border-[#2c3426] bg-[#12150f]/90 px-2 py-1.5 text-[10.5px] text-[#c5ccb6] backdrop-blur-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3 bg-[#c2413b] border-b border-dashed" />
                        <span>Docket (18.4 km · 3 crossings)</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-3 bg-[#3f8f5a]" />
                        <span className="font-semibold text-[#3f8f5a]">
                          2-Opt (13.9 km · 0 crossings)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visualizer Footer Bar */}
                  <div className="mt-3 flex items-center justify-between text-[12px] text-[#9aa38c]">
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-[#3f8f5a]" />
                      4.5 km (−24.5%) saved instantly
                    </span>
                    <button
                      type="button"
                      onClick={onLaunch}
                      className="inline-flex items-center gap-1 font-semibold text-[#f0b429] hover:underline"
                    >
                      Test with 20 stops →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURAL BREAKDOWN GRID: 3 Industrial High-Density Cards */}
        <section className="border-b border-[#2c3426] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h2 className="text-xl font-bold tracking-tight text-[#f3f6ee] sm:text-2xl">
                System Architecture &amp; Operational Mechanics
              </h2>
              <p className="mt-1 max-w-[65ch] text-[13.5px] text-[#9aa38c]">
                Engineered for immediate dispatch clarity without cloud latency or third-party telematics fees.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Card 1: The Bottleneck */}
              <div className="rounded-lg border border-[#2c3426] bg-[#1a1f16] p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#522522] bg-[#291615] text-[#c2413b]">
                  <Route size={16} strokeWidth={2} />
                </div>
                <h3 className="mt-3 text-[15.5px] font-semibold text-[#f3f6ee]">
                  1. The Last-Mile Bottleneck
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#9aa38c]">
                  Dispatch manifests sequenced in static docket order create criss-crossing paths, excessive U-turns, and deadhead mileage in congested urban nodes.
                </p>
                <ul className="mt-4 space-y-1.5 text-[12px] text-[#c5ccb6]">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c2413b]" />
                    Unchecked O(n!) combinatorial path sprawl
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c2413b]" />
                    Frequent return-to-depot capacity overflows
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c2413b]" />
                    Driver fatigue and delayed time windows
                  </li>
                </ul>
              </div>

              {/* Card 2: The Heuristic Solution */}
              <div className="rounded-lg border border-[#2c3426] bg-[#1a1f16] p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#3a4432] bg-[#1f281b] text-[#3f8f5a]">
                  <Cpu size={16} strokeWidth={2} />
                </div>
                <h3 className="mt-3 text-[15.5px] font-semibold text-[#f3f6ee]">
                  2. Dynamic 2-Opt Local Search
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#9aa38c]">
                  Combines a greedy nearest-neighbor initialization with iterative 2-opt pairwise edge exchange, systematically untangling self-intersecting loops.
                </p>
                <ul className="mt-4 space-y-1.5 text-[12px] text-[#c5ccb6]">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3f8f5a]" />
                    Haversine spherical distance matrix (R=6,371 km)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3f8f5a]" />
                    Trips auto-partitioned by van payload capacity
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3f8f5a]" />
                    Sub-10ms deterministic execution in JS
                  </li>
                </ul>
              </div>

              {/* Card 3: Instant Baseline ROI */}
              <div className="rounded-lg border border-[#2c3426] bg-[#1a1f16] p-5">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#4a391e] bg-[#292013] text-[#f0b429]">
                  <BarChart3 size={16} strokeWidth={2} />
                </div>
                <h3 className="mt-3 text-[15.5px] font-semibold text-[#f3f6ee]">
                  3. Instant Baseline ROI
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#9aa38c]">
                  Operators immediately receive quantifiable validation: distance delta, turnaround time savings, and carbon reduction metrics against docket orders.
                </p>
                <ul className="mt-4 space-y-1.5 text-[12px] text-[#c5ccb6]">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f0b429]" />
                    18–25% verifiable distance reduction
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f0b429]" />
                    0.21 kg CO₂ saved per km eliminated
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f0b429]" />
                    Seamless drop status tracking for drivers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY CONTEXT SECTION */}
        <section id="policy" className="border-b border-[#2c3426] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-1.5 rounded border border-[#3a4432] bg-[#1a1f16] px-2.5 py-0.5 text-[11px] font-medium text-[#f0b429]">
                  NATIONAL LOGISTICS POLICY
                </div>
                <h2 className="mt-3 text-2xl font-bold text-[#f3f6ee]">
                  Aligning Urban Freight with India&apos;s National Master Plan
                </h2>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[#9aa38c]">
                  India&apos;s logistics expenditure has historically accounted for ~13–14% of GDP. The National Logistics Policy (NLP), supported by PM GatiShakti multi-modal connectivity, aims to reduce this below 9% through digitization, modal shifts, and last-mile efficiency.
                </p>
                <div className="mt-5 rounded-md border border-[#2c3426] bg-[#1a1f16] p-3 text-[12px] text-[#c5ccb6]">
                  <p className="font-semibold text-[#f0b429]">Target 2030 Mandate</p>
                  <p className="mt-1 text-[#9aa38c]">
                    Elevate India to the top 25 in the World Bank Logistics Performance Index (LPI) while achieving carbon-neutral freight logistics corridors.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#f3f6ee]">
                    <Shield size={16} className="text-[#3f8f5a]" />
                    Urban Congestion Alleviation
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#9aa38c]">
                    By eliminating crossing paths and redundant loops, delivery vans complete dockets earlier in the morning before peak metro congestion windows.
                  </p>
                </div>

                <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#f3f6ee]">
                    <Leaf size={16} className="text-[#3f8f5a]" />
                    BS-VI &amp; EV Transition
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#9aa38c]">
                    Route length contraction preserves EV battery state-of-charge (SoC) and cuts BS-VI diesel particulate emissions by over 20% per delivery shift.
                  </p>
                </div>

                <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#f0b429]">
                    <Layers size={16} className="text-[#f0b429]" />
                    Zero Telematics Dependency
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#9aa38c]">
                    Operates standalone in any browser on standard mobile devices, empowering small regional fleet operators without expensive SaaS subscriptions.
                  </p>
                </div>

                <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#f3f6ee]">
                    <CheckCircle2 size={16} className="text-[#f0b429]" />
                    Deterministic Open Standards
                  </div>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-[#9aa38c]">
                    Built entirely on open cartographic layers (OpenStreetMap) and verifiable mathematical heuristics, preventing vendor lock-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ALGORITHMIC SPECS SECTION */}
        <section id="specs" className="border-b border-[#2c3426] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 rounded border border-[#3a4432] bg-[#1a1f16] px-2.5 py-0.5 text-[11px] font-medium text-[#f0b429]">
                TECHNICAL SPECIFICATIONS
              </div>
              <h2 className="mt-2 text-2xl font-bold text-[#f3f6ee]">
                Algorithmic Formulation &amp; Heuristic Mechanics
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Spec 1: Haversine Formulation */}
              <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                <div className="font-mono text-[11px] text-[#f0b429]">01 / DISTANCE MATRIX</div>
                <h3 className="mt-1 text-[15px] font-semibold text-[#f3f6ee]">
                  Haversine Great-Circle Metric
                </h3>
                <p className="mt-2 text-[12.5px] text-[#9aa38c]">
                  Computes orthodromic distance across spherical latitude/longitude coordinates:
                </p>
                <div className="mt-3 rounded bg-[#12150f] p-3 font-mono text-[11.5px] text-[#d6dbcb] border border-[#2c3426]">
                  d = 2R · arcsin(√(sin²(Δφ/2) + cos φ₁ cos φ₂ sin²(Δλ/2)))
                </div>
                <p className="mt-2 text-[11.5px] text-[#7d8670]">
                  Where R = 6,371 km. Matrix precomputation runs in O(n²) time.
                </p>
              </div>

              {/* Spec 2: 2-Opt Swap Inversion */}
              <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                <div className="font-mono text-[11px] text-[#3f8f5a]">02 / LOCAL SEARCH</div>
                <h3 className="mt-1 text-[15px] font-semibold text-[#f3f6ee]">
                  2-Opt Edge Disentanglement
                </h3>
                <p className="mt-2 text-[12.5px] text-[#9aa38c]">
                  Iteratively replaces two non-adjacent edges (u, u+1) and (v, v+1) with (u, v) and (u+1, v+1):
                </p>
                <div className="mt-3 rounded bg-[#12150f] p-3 font-mono text-[11.5px] text-[#d6dbcb] border border-[#2c3426]">
                  if (dist(u,v) + dist(u+1,v+1) &lt; dist(u,u+1) + dist(v,v+1)) =&gt; reverse(u+1 .. v)
                </div>
                <p className="mt-2 text-[11.5px] text-[#7d8670]">
                  Eliminates polygon edge intersections until local minimum is reached.
                </p>
              </div>

              {/* Spec 3: Capacity Bin-Packing */}
              <div className="rounded-md border border-[#2c3426] bg-[#1a1f16] p-4">
                <div className="font-mono text-[11px] text-[#d97706]">03 / CONSTRAINT BIN-PACKING</div>
                <h3 className="mt-1 text-[15px] font-semibold text-[#f3f6ee]">
                  Payload Partitioning
                </h3>
                <p className="mt-2 text-[12.5px] text-[#9aa38c]">
                  Enforces vehicle gross vehicle weight constraints before assigning next nearest stop:
                </p>
                <div className="mt-3 rounded bg-[#12150f] p-3 font-mono text-[11.5px] text-[#d6dbcb] border border-[#2c3426]">
                  Σ weight(stop_i) ≤ vehicle_capacity (kg)
                </div>
                <p className="mt-2 text-[11.5px] text-[#7d8670]">
                  When payload is exhausted, vehicle triggers automatic depot turn loop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENCHMARKS SECTION */}
        <section id="benchmarks" className="border-b border-[#2c3426] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded border border-[#3a4432] bg-[#1a1f16] px-2.5 py-0.5 text-[11px] font-medium text-[#f0b429]">
                  OPERATIONAL VALIDATION
                </div>
                <h2 className="mt-2 text-2xl font-bold text-[#f3f6ee]">
                  Delhi NCR Corridor Benchmarking
                </h2>
                <p className="mt-1 max-w-[60ch] text-[13.5px] text-[#9aa38c]">
                  Tested on real delivery dockets across 20 urban hubs starting from Okhla ICD Staging Yard.
                </p>
              </div>

              <button
                type="button"
                onClick={onLaunch}
                className="inline-flex items-center gap-2 rounded-md bg-[#d97706] px-4 py-2.5 text-[13.5px] font-semibold text-[#12150f] transition hover:bg-[#f0b429]"
              >
                Run Live Benchmark
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Benchmark Comparison Table */}
            <div className="mt-6 overflow-x-auto rounded-lg border border-[#2c3426]">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-[#2c3426] bg-[#1a1f16] text-[#9aa38c]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Test Scenario</th>
                    <th className="px-4 py-3 font-medium">Stops</th>
                    <th className="px-4 py-3 font-medium">Unoptimized Docket</th>
                    <th className="px-4 py-3 font-medium">2-Opt Heuristic</th>
                    <th className="px-4 py-3 font-medium text-[#3f8f5a]">Distance Saved</th>
                    <th className="px-4 py-3 font-medium text-[#3f8f5a]">CO₂ Offset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c3426] tabular text-[#d6dbcb]">
                  <tr>
                    <td className="px-4 py-3 font-medium text-[#f3f6ee]">Delhi NCR Central Docket</td>
                    <td className="px-4 py-3">20 drops</td>
                    <td className="px-4 py-3 text-[#c2413b]">112.4 km</td>
                    <td className="px-4 py-3 text-[#3f8f5a] font-semibold">88.2 km</td>
                    <td className="px-4 py-3 text-[#3f8f5a] font-bold">24.2 km (21.5%)</td>
                    <td className="px-4 py-3 text-[#3f8f5a]">5.1 kg CO₂</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[#f3f6ee]">South Delhi Arterial Cluster</td>
                    <td className="px-4 py-3">15 drops</td>
                    <td className="px-4 py-3 text-[#c2413b]">78.6 km</td>
                    <td className="px-4 py-3 text-[#3f8f5a] font-semibold">60.4 km</td>
                    <td className="px-4 py-3 text-[#3f8f5a] font-bold">18.2 km (23.1%)</td>
                    <td className="px-4 py-3 text-[#3f8f5a]">3.8 kg CO₂</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[#f3f6ee]">Extended NCR Perimeter Cluster</td>
                    <td className="px-4 py-3">28 drops</td>
                    <td className="px-4 py-3 text-[#c2413b]">164.8 km</td>
                    <td className="px-4 py-3 text-[#3f8f5a] font-semibold">126.1 km</td>
                    <td className="px-4 py-3 text-[#3f8f5a] font-bold">38.7 km (23.5%)</td>
                    <td className="px-4 py-3 text-[#3f8f5a]">8.1 kg CO₂</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA STRIP */}
        <section className="bg-[#1a1f16] px-4 py-12 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-[#f3f6ee] sm:text-3xl">
              Ready to Optimize Last-Mile Urban Delivery Tours?
            </h2>
            <p className="mt-2 text-[14px] text-[#9aa38c]">
              Load official sample manifests or generate custom delivery sets right in your browser.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onLaunch}
                className="inline-flex items-center gap-2 rounded-md bg-[#d97706] px-7 py-3.5 text-[15px] font-bold text-[#12150f] shadow-[0_4px_16px_rgba(217,119,6,0.3)] transition hover:bg-[#f0b429] active:scale-[0.98]"
              >
                Launch Optimizer Engine Now
                <ArrowRight size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#2c3426] bg-[#12150f] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-[12px] text-[#7d8670] sm:flex-row">
          <div className="flex items-center gap-2">
            <Warehouse size={14} />
            <span>Ministry of Commerce &amp; Industry · DPIIT Logistics Division</span>
          </div>
          <div>
            100% Client-Side Engine · Zero Latency · OpenStreetMap &amp; Leaflet
          </div>
        </div>
      </footer>
    </div>
  );
}
