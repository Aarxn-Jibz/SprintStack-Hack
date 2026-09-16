import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  Factory,
  Fuel,
  Leaf,
  MapPinned,
  Play,
  Shuffle,
  Timer,
  Truck,
  Warehouse,
} from "lucide-react";
import { DELHI_DEPOT, generateRandomStops, SAMPLE_STOPS, type Stop } from "./data";
import { optimize as optimizeApi } from "./api";
import {
  baselinePlan,
  carbonKg,
  fuelLitres,
  pctSaved,
  type RoutePlan,
} from "./routing";

type RouteView = "both" | "baseline" | "optimized";
type StopStatus = "pending" | "done" | "held";

function pinIcon(html: string) {
  return L.divIcon({
    className: "",
    html,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    tooltipAnchor: [0, -14],
  });
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) {
      map.setView([DELHI_DEPOT.lat, DELHI_DEPOT.lng], 11);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 13 });
  }, [map, points]);
  return null;
}

function fmtKm(n: number) {
  return n.toFixed(1);
}

function fmtMin(n: number) {
  return Math.round(n).toString();
}

function fmtPct(n: number) {
  return `${n >= 0 ? "" : "+"}${Math.abs(n).toFixed(1)}%`;
}

export default function App() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [capacity, setCapacity] = useState(100);
  const [optimized, setOptimized] = useState<RoutePlan | null>(null);
  const [apiBaseline, setApiBaseline] = useState<RoutePlan | null>(null);
  const [view, setView] = useState<RouteView>("both");
  const [status, setStatus] = useState<Record<string, StopStatus>>({});
  const [notice, setNotice] = useState<string | null>(null);

  const localBaseline = useMemo(
    () => (stops.length ? baselinePlan(DELHI_DEPOT, stops, capacity) : null),
    [stops, capacity],
  );
  const baseline = apiBaseline ?? localBaseline;

  useEffect(() => {
    setOptimized(null);
    setApiBaseline(null);
  }, [stops]);

  useEffect(() => {
    setOptimized(null);
    setApiBaseline(null);
  }, [capacity]);

  const loadSample = () => {
    setStops(SAMPLE_STOPS);
    setStatus({});
    setView("both");
    setNotice("Sample Delhi NCR docket loaded. 20 drops, Okhla ICD depot.");
  };

  const loadRandom = () => {
    const next = generateRandomStops();
    setStops(next);
    setStatus({});
    setView("both");
    setNotice(`Randomised ${next.length} drops inside the Delhi NCR box.`);
  };

  const runOptimize = async () => {
    if (!stops.length) {
      setNotice("Load a docket before running the solver.");
      return;
    }
    try {
      const result = await optimizeApi(DELHI_DEPOT, stops, capacity);
      setApiBaseline(result.baseline);
      setOptimized(result.optimized);
      setView("both");
      setNotice(result.unassigned.length ? `Unassigned: ${result.unassigned.map(stop => `${stop.id} (${stop.reason})`).join(", ")}` : `Nearest-neighbour plus 2-opt complete${result.degraded ? " using fallback routing" : ""}.`);
    } catch {
      setNotice("Optimization API is unavailable. Start it with bun run dev:api.");
    }
  };

  const cycleStatus = (id: string) => {
    setStatus((prev) => {
      const cur = prev[id] ?? "pending";
      const next: StopStatus = cur === "pending" ? "done" : cur === "done" ? "held" : "pending";
      return { ...prev, [id]: next };
    });
  };

  const kmSaved = baseline && optimized ? baseline.distanceKm - optimized.distanceKm : 0;
  const minSaved = baseline && optimized ? baseline.durationMin - optimized.durationMin : 0;
  const kmPct = baseline && optimized ? pctSaved(baseline.distanceKm, optimized.distanceKm) : 0;
  const minPct = baseline && optimized ? pctSaved(baseline.durationMin, optimized.durationMin) : 0;
  const co2Saved =
    baseline && optimized ? carbonKg(baseline.distanceKm) - carbonKg(optimized.distanceKm) : 0;
  const fuelSaved =
    baseline && optimized ? fuelLitres(baseline.distanceKm) - fuelLitres(optimized.distanceKm) : 0;

  const listPlan = optimized ?? baseline;
  const boundPts = useMemo<[number, number][]>(() => {
    if (!stops.length) return [[DELHI_DEPOT.lat, DELHI_DEPOT.lng]];
    return [
      [DELHI_DEPOT.lat, DELHI_DEPOT.lng],
      ...stops.map((s) => [s.lat, s.lng] as [number, number]),
    ];
  }, [stops]);

  const showBase = view === "both" || view === "baseline";
  const showOpt = (view === "both" || view === "optimized") && Boolean(optimized);

  const visitById = useMemo(() => {
    const map = new Map<string, number>();
    listPlan?.nodes.forEach((n) => {
      if (n.kind === "stop") map.set(n.stop.id, n.visitIndex);
    });
    return map;
  }, [listPlan]);

  const overflowIds = useMemo(() => {
    const set = new Set<string>();
    listPlan?.nodes.forEach((n) => {
      if (n.kind === "stop" && n.overflow) set.add(n.stop.id);
    });
    return set;
  }, [listPlan]);

  return (
    <div className="min-h-[100dvh] bg-[#12150f] text-[#e8eadf]">
      <div className="flex h-[3px] w-full">
        <span className="flex-1 bg-[#c45c26]" />
        <span className="flex-1 bg-[#e8eadf]" />
        <span className="flex-1 bg-[#2f6b3c]" />
      </div>

      <div className="grid min-h-[calc(100dvh-3px)] lg:grid-cols-[minmax(320px,400px)_1fr]">
        <aside className="flex max-h-[100dvh] flex-col overflow-y-auto border-b border-[#2c3426] lg:border-b-0 lg:border-r">
          <header className="px-5 pt-5 pb-4">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#3a4432] bg-[#1a1f16] px-2.5 py-1 text-[11px] font-medium text-[#d6dbcb]">
              <Factory size={14} strokeWidth={1.75} />
              DPIIT Logistics Division
            </div>
            <h1 className="mt-4 text-[1.65rem] leading-[1.15] font-semibold tracking-[-0.03em] text-[#f3f6ee]">
              Last-mile route optimizer
            </h1>
            <p className="mt-2 max-w-[42ch] text-[13.5px] leading-relaxed text-[#9aa38c]">
              Client-side dispatch for a single van. Baseline follows the docket order. The solver
              uses nearest neighbour, then 2-opt, on OpenStreetMap.
            </p>
          </header>

          <div className="px-5 pb-4">
            <label className="flex items-center justify-between text-[13px] text-[#d6dbcb]" htmlFor="capacity">
              <span className="inline-flex items-center gap-1.5">
                <Truck size={15} strokeWidth={1.75} />
                Vehicle capacity
              </span>
              <span className="tabular text-[#f0b429]">{capacity} kg</span>
            </label>
            <input
              id="capacity"
              type="range"
              min={40}
              max={250}
              step={5}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="mt-2 w-full accent-[#d97706]"
            />
            <p className="mt-1.5 text-[12px] text-[#9aa38c]">
              Stops heavier than remaining payload are flagged. The solver returns to Okhla when the van is full.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loadSample}
                className="rounded-md border border-[#3a4432] bg-[#1a1f16] px-3 py-2.5 text-[13px] font-medium text-[#e8eadf] transition hover:border-[#d97706] hover:text-[#f3f6ee] active:scale-[0.98]"
              >
                Load sample data
              </button>
              <button
                type="button"
                onClick={loadRandom}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#3a4432] bg-[#1a1f16] px-3 py-2.5 text-[13px] font-medium text-[#e8eadf] transition hover:border-[#d97706] active:scale-[0.98]"
              >
                <Shuffle size={14} strokeWidth={1.75} />
                Random 15-30
              </button>
            </div>
            <button
              type="button"
              onClick={runOptimize}
              disabled={!stops.length}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#d97706] px-3 py-2.5 text-[13.5px] font-semibold text-[#12150f] transition hover:bg-[#f0b429] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#3a4432] disabled:text-[#9aa38c]"
            >
              <Play size={15} strokeWidth={2} />
              Run optimization
            </button>
            {notice ? (
              <p className="mt-2 text-[12.5px] leading-snug text-[#c5ccb6]" role="status">
                {notice}
              </p>
            ) : null}
          </div>

          <section className="border-t border-[#2c3426] px-5 py-4">
            <h2 className="text-[15px] font-semibold text-[#f3f6ee]">Baseline vs optimized</h2>
            {!baseline ? (
              <p className="mt-3 text-[13px] text-[#9aa38c]">
                Empty docket. Load the sample set or generate drops to compare tours.
              </p>
            ) : (
              <div className="mt-3 overflow-hidden rounded-md border border-[#2c3426]">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="bg-[#1a1f16] text-[#9aa38c]">
                    <tr>
                      <th className="px-3 py-2 font-medium">Metric</th>
                      <th className="px-3 py-2 font-medium">Docket order</th>
                      <th className="px-3 py-2 font-medium">2-opt</th>
                    </tr>
                  </thead>
                  <tbody className="tabular">
                    <tr className="border-t border-[#2c3426]">
                      <td className="px-3 py-2 text-[#c5ccb6]">Distance</td>
                      <td className="px-3 py-2 text-[#c2413b]">{fmtKm(baseline.distanceKm)} km</td>
                      <td className="px-3 py-2 text-[#3f8f5a]">
                        {optimized ? `${fmtKm(optimized.distanceKm)} km` : "—"}
                      </td>
                    </tr>
                    <tr className="border-t border-[#2c3426]">
                      <td className="px-3 py-2 text-[#c5ccb6]">Duration</td>
                      <td className="px-3 py-2">{fmtMin(baseline.durationMin)} min</td>
                      <td className="px-3 py-2">
                        {optimized ? `${fmtMin(optimized.durationMin)} min` : "—"}
                      </td>
                    </tr>
                    <tr className="border-t border-[#2c3426]">
                      <td className="px-3 py-2 text-[#c5ccb6]">Trips / overflow</td>
                      <td className="px-3 py-2">
                        1 / {baseline.overflowCount}
                      </td>
                      <td className="px-3 py-2">
                        {optimized ? `${optimized.trips} / ${optimized.overflowCount}` : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {optimized && baseline ? (
              <dl className="mt-3 grid grid-cols-3 gap-2 text-[12px]">
                <div className="rounded-md bg-[#1a1f16] px-2.5 py-2">
                  <dt className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <MapPinned size={12} strokeWidth={1.75} />
                    Distance
                  </dt>
                  <dd className="mt-1 tabular text-[15px] font-semibold text-[#f3f6ee]">
                    {fmtKm(kmSaved)} km
                  </dd>
                  <dd className="text-[#3f8f5a]">{fmtPct(kmPct)} shorter</dd>
                </div>
                <div className="rounded-md bg-[#1a1f16] px-2.5 py-2">
                  <dt className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <Timer size={12} strokeWidth={1.75} />
                    Time
                  </dt>
                  <dd className="mt-1 tabular text-[15px] font-semibold text-[#f3f6ee]">
                    {fmtMin(minSaved)} min
                  </dd>
                  <dd className="text-[#3f8f5a]">{fmtPct(minPct)} faster</dd>
                </div>
                <div className="rounded-md bg-[#1a1f16] px-2.5 py-2">
                  <dt className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <Leaf size={12} strokeWidth={1.75} />
                    Carbon
                  </dt>
                  <dd className="mt-1 tabular text-[15px] font-semibold text-[#f3f6ee]">
                    {co2Saved.toFixed(1)} kg
                  </dd>
                  <dd className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <Fuel size={11} strokeWidth={1.75} />
                    {fuelSaved.toFixed(1)} L
                  </dd>
                </div>
              </dl>
            ) : null}
            <p className="mt-2 text-[11.5px] leading-snug text-[#7d8670]">
              Duration assumes 18 km/h urban crawl plus 4 min dwell per drop. Carbon uses 0.21 kg CO2 per km for a BS-VI LCV. Indicative, not an inventory figure.
            </p>
          </section>

          <section className="flex min-h-0 flex-1 flex-col border-t border-[#2c3426] px-5 py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[15px] font-semibold text-[#f3f6ee]">Visit order</h2>
              <p className="text-[12px] text-[#9aa38c]">
                {stops.length ? `${stops.length} drops` : "No drops"} · click a row to cycle status
              </p>
            </div>
            {!listPlan || stops.length === 0 ? (
              <div className="mt-6 rounded-md border border-dashed border-[#3a4432] px-4 py-8 text-center text-[13px] text-[#9aa38c]">
                The stop list fills after you load a docket. Sequence numbers follow the green tour once you run the solver.
              </div>
            ) : (
              <ol className="stop-list mt-3 max-h-[42vh] space-y-1 overflow-y-auto pr-1 lg:max-h-none">
                {listPlan.nodes.map((node, i) => {
                  if (node.kind === "depot") {
                    return (
                      <li
                        key={`${i}-depot`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12.5px] text-[#f0b429]"
                      >
                        <Warehouse size={14} strokeWidth={1.75} />
                        <span className="font-medium">{node.name}</span>
                        <span className="text-[#7d8670]">{i === 0 ? "start" : "return"}</span>
                      </li>
                    );
                  }
                  const st = status[node.stop.id] ?? "pending";
                  return (
                    <li key={node.stop.id}>
                      <button
                        type="button"
                        onClick={() => cycleStatus(node.stop.id)}
                        className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-[12.5px] transition hover:bg-[#1a1f16]"
                      >
                        <span className="tabular mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d6dbcb] text-[11px] font-bold text-[#12150f]">
                          {node.visitIndex}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-[#f3f6ee]">
                            {node.stop.name}
                          </span>
                          <span className="block text-[#9aa38c]">
                            {node.stop.timeWindow} · {node.stop.weightKg} kg · trip {node.trip}
                            {node.overflow ? " · overflow" : ""}
                          </span>
                        </span>
                        <span
                          className={
                            st === "done"
                              ? "text-[#3f8f5a]"
                              : st === "held"
                                ? "text-[#c2413b]"
                                : "text-[#7d8670]"
                          }
                        >
                          {st}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </aside>

        <section className="relative min-h-[52vh] lg:min-h-0">
          <MapContainer
            center={[DELHI_DEPOT.lat, DELHI_DEPOT.lng]}
            zoom={11}
            className="absolute inset-0"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds points={boundPts} />

            {showBase && baseline ? (
              <Polyline
                positions={baseline.coords}
                pathOptions={{
                  color: "#c2413b",
                  weight: 3,
                  dashArray: "8 8",
                  opacity: showOpt ? 0.75 : 0.95,
                }}
              />
            ) : null}
            {showOpt && optimized ? (
              <Polyline
                positions={optimized.coords}
                pathOptions={{ color: "#3f8f5a", weight: 4, opacity: 0.95 }}
              />
            ) : null}

            <Marker
              position={[DELHI_DEPOT.lat, DELHI_DEPOT.lng]}
              icon={pinIcon(`<div class="pin pin-depot">HQ</div>`)}
              zIndexOffset={500}
            >
              <Popup>
                <strong>{DELHI_DEPOT.name}</strong>
                <br />
                Depot and reload point
              </Popup>
            </Marker>

            {stops.map((stop) => {
              const st = status[stop.id] ?? "pending";
              const n = visitById.get(stop.id);
              const overflow = overflowIds.has(stop.id);
              const cls =
                overflow && st !== "done"
                  ? "pin pin-overflow"
                  : st === "done"
                    ? "pin pin-done"
                    : "pin pin-drop";
              return (
                <Marker
                  key={stop.id}
                  position={[stop.lat, stop.lng]}
                  icon={pinIcon(`<div class="${cls}">${n ?? ""}</div>`)}
                >
                  <Tooltip className="pin-tip" direction="top">
                    {n ? `${n}. ` : ""}
                    {stop.name}
                  </Tooltip>
                  <Popup>
                    <strong>{stop.name}</strong>
                    <br />
                    Window {stop.timeWindow}
                    <br />
                    {stop.weightKg} kg
                    {overflow ? " · exceeds remaining capacity" : ""}
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] flex items-end justify-between gap-3 p-3 pb-8">
            <div className="pointer-events-auto max-w-[240px] rounded-md border border-[#2c3426] bg-[#12150f]/92 px-3 py-2 text-[12px] text-[#c5ccb6] shadow-[0_8px_12px_rgb(0_0_0_/_0.35)]">
              <p className="font-medium text-[#f3f6ee]">Delhi NCR last-mile board</p>
              <p className="mt-0.5">Red dashed: docket order. Green: 2-opt tour.</p>
            </div>
            <fieldset className="pointer-events-auto mb-0 flex overflow-hidden rounded-md border border-[#2c3426] bg-[#12150f]/92 text-[12.5px] shadow-[0_8px_12px_rgb(0_0_0_/_0.35)]">
              <legend className="sr-only">Route overlay</legend>
              {(
                [
                  ["both", "Both"],
                  ["baseline", "Baseline"],
                  ["optimized", "Optimized"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={
                    view === id
                      ? "bg-[#d97706] px-3 py-2 font-semibold text-[#12150f]"
                      : "px-3 py-2 text-[#d6dbcb] hover:bg-[#1a1f16]"
                  }
                >
                  {label}
                </button>
              ))}
            </fieldset>
          </div>
        </section>
      </div>
    </div>
  );
}
