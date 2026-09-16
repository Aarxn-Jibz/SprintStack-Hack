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
  ArrowLeft,
  Factory,
  Filter,
  Fuel,
  Leaf,
  MapPin,
  MapPinned,
  Play,
  Plus,
  Search,
  Settings2,
  Shuffle,
  Tag,
  Timer,
  Trash2,
  Truck,
  Warehouse,
  X,
} from "lucide-react";
import { DELHI_DEPOT, generateRandomStops, LOCALES, SAMPLE_STOPS, type Stop } from "./data";
import { optimize as optimizeApi } from "./api";
import {
  baselinePlan,
  carbonKg,
  fuelLitres,
  optimizedPlan,
  pctSaved,
  type RoutePlan,
} from "./routing";

type RouteView = "both" | "baseline" | "optimized";
type StopStatus = "pending" | "done" | "held";

interface RoutingDashboardProps {
  onBack: () => void;
}

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

function PanToLocation({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.setView([target.lat, target.lng], 14, { animate: true });
    }
  }, [map, target]);
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

// Initial sample tags for demonstration
const INITIAL_TAGS: Record<string, string[]> = {
  s01: ["DEL-001", "EXPRESS"],
  s02: ["DEL-002"],
  s03: ["DEL-003", "COLD-CHAIN"],
  s04: ["DEL-004"],
  s05: ["DEL-005", "PRIORITY"],
};

export default function RoutingDashboard({ onBack }: RoutingDashboardProps) {
  const [stops, setStops] = useState<Stop[]>(SAMPLE_STOPS);
  const [capacity, setCapacity] = useState(100);
  const [optimized, setOptimized] = useState<RoutePlan | null>(null);
  const [apiBaseline, setApiBaseline] = useState<RoutePlan | null>(null);
  const [view, setView] = useState<RouteView>("both");
  const [status, setStatus] = useState<Record<string, StopStatus>>({});
  const [notice, setNotice] = useState<string | null>(
    "Delhi NCR docket active (20 drops, Okhla ICD depot). Click 'Run 2-Opt Optimization' to solve.",
  );

  // SEARCH & TAGGING SYSTEM STATE
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number; id: string } | null>(null);

  // Tag configuration
  const [tagPrefix, setTagPrefix] = useState("DEL");
  const [tagStartNumber, setTagStartNumber] = useState(1);
  const [tagNextNumber, setTagNextNumber] = useState(6);
  const [showTagConfig, setShowTagConfig] = useState(false);
  const [stopTags, setStopTags] = useState<Record<string, string[]>>(INITIAL_TAGS);
  const [newTagInput, setNewTagInput] = useState<{ stopId: string; value: string } | null>(null);

  // Add location drawer/dropdown state
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");

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
    setStopTags(INITIAL_TAGS);
    setTagNextNumber(6);
    setView("both");
    setSearchQuery("");
    setSelectedTagFilter(null);
    setNotice("Sample Delhi NCR docket loaded. 20 drops, Okhla ICD depot.");
  };

  const loadRandom = () => {
    const next = generateRandomStops();
    setStops(next);
    setStatus({});
    setStopTags({});
    setTagNextNumber(tagStartNumber);
    setView("both");
    setSearchQuery("");
    setSelectedTagFilter(null);
    setNotice(`Randomised ${next.length} drops inside the Delhi NCR bounding box.`);
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
      setNotice(
        result.unassigned.length
          ? `Unassigned: ${result.unassigned.map((stop) => `${stop.id} (${stop.reason})`).join(", ")}`
          : `Nearest-neighbour plus 2-opt complete${result.degraded ? " using fallback routing" : ""}.`,
      );
    } catch {
      // Seamless client-side fallback if backend API is offline
      const localOpt = optimizedPlan(DELHI_DEPOT, stops, capacity);
      setApiBaseline(null);
      setOptimized(localOpt);
      setView("both");
      setNotice("Nearest-neighbour plus 2-opt complete (client-side heuristic solver).");
    }
  };

  const cycleStatus = (id: string) => {
    setStatus((prev) => {
      const cur = prev[id] ?? "pending";
      const next: StopStatus = cur === "pending" ? "done" : cur === "done" ? "held" : "pending";
      return { ...prev, [id]: next };
    });
  };

  // TAG SYSTEM LOGIC
  const formatTag = (prefix: string, num: number) => {
    return `${prefix.trim().toUpperCase()}-${String(num).padStart(3, "0")}`;
  };

  // Add the next auto-incremented tag to a specific stop
  const addNextIncrementTag = (stopId: string) => {
    const nextTag = formatTag(tagPrefix, tagNextNumber);
    setStopTags((prev) => {
      const current = prev[stopId] ?? [];
      if (current.includes(nextTag)) return prev;
      return { ...prev, [stopId]: [...current, nextTag] };
    });
    setTagNextNumber((prev) => prev + 1);
  };

  // Add a custom tag or confirm manual input
  const addCustomTag = (stopId: string, customTag: string) => {
    const trimmed = customTag.trim().toUpperCase();
    if (!trimmed) return;
    setStopTags((prev) => {
      const current = prev[stopId] ?? [];
      if (current.includes(trimmed)) return prev;
      return { ...prev, [stopId]: [...current, trimmed] };
    });
    setNewTagInput(null);
  };

  // Remove a single tag from a stop
  const removeTag = (stopId: string, tagToRemove: string) => {
    setStopTags((prev) => {
      const current = prev[stopId] ?? [];
      const filtered = current.filter((t) => t !== tagToRemove);
      if (filtered.length === 0) {
        const next = { ...prev };
        delete next[stopId];
        return next;
      }
      return { ...prev, [stopId]: filtered };
    });
  };

  // Remove a tag everywhere across all stops
  const removeTagEverywhere = (tagToRemove: string) => {
    setStopTags((prev) => {
      const next: Record<string, string[]> = {};
      for (const [id, tagList] of Object.entries(prev)) {
        const filtered = tagList.filter((t) => t !== tagToRemove);
        if (filtered.length > 0) {
          next[id] = filtered;
        }
      }
      return next;
    });
    if (selectedTagFilter === tagToRemove) {
      setSelectedTagFilter(null);
    }
  };

  // Sequentially auto-tag all stops based on current order
  const autoTagAllStops = () => {
    let current = tagStartNumber;
    const nextTags: Record<string, string[]> = { ...stopTags };
    stops.forEach((stop) => {
      const tagStr = formatTag(tagPrefix, current);
      const existing = nextTags[stop.id] ?? [];
      if (!existing.includes(tagStr)) {
        nextTags[stop.id] = [...existing, tagStr];
      }
      current += 1;
    });
    setStopTags(nextTags);
    setTagNextNumber(current);
    setNotice(`Auto-tagged ${stops.length} stops from ${formatTag(tagPrefix, tagStartNumber)} onwards.`);
  };

  // Clear all tags
  const clearAllTags = () => {
    setStopTags({});
    setTagNextNumber(tagStartNumber);
    setSelectedTagFilter(null);
    setNotice("All stop tags cleared.");
  };

  // Add new stop from location list
  const addStopFromLocale = (localeName: string) => {
    const newId = `s${String(stops.length + 1).padStart(2, "0")}`;
    const newStop: Stop = {
      id: newId,
      lat: 28.51 + Math.random() * 0.22,
      lng: 77.06 + Math.random() * 0.25,
      name: `${localeName} drop`,
      timeWindow: "10:00-13:00",
      weightKg: Math.round(8 + Math.random() * 15),
    };
    setStops((prev) => [...prev, newStop]);
    setShowAddLocation(false);
    setLocationFilter("");
    setNotice(`Added "${newStop.name}" to route.`);
    setPanTarget({ lat: newStop.lat, lng: newStop.lng, id: newStop.id });
  };

  // All unique active tags across stops
  const allActiveTags = useMemo(() => {
    const set = new Set<string>();
    Object.values(stopTags).forEach((tags) => tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [stopTags]);

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

  // Filtered stops based on search query and selected tag
  const filteredNodes = useMemo(() => {
    if (!listPlan) return [];
    const q = searchQuery.toLowerCase().trim();
    return listPlan.nodes.filter((node) => {
      if (node.kind === "depot") return !q && !selectedTagFilter; // Always show depot when not filtering
      const stop = node.stop;
      const tags = stopTags[stop.id] ?? [];

      // Tag filter check
      if (selectedTagFilter && !tags.includes(selectedTagFilter)) {
        return false;
      }

      // Search query check (name, id, window, or tags)
      if (q) {
        const matchesName = stop.name.toLowerCase().includes(q);
        const matchesId = stop.id.toLowerCase().includes(q);
        const matchesWindow = stop.timeWindow.toLowerCase().includes(q);
        const matchesTag = tags.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesId || matchesWindow || matchesTag;
      }

      return true;
    });
  }, [listPlan, searchQuery, selectedTagFilter, stopTags]);

  // Available locales not yet added
  const availableLocales = useMemo(() => {
    const existingNames = new Set(stops.map((s) => s.name.toLowerCase()));
    return LOCALES.filter((l) => {
      const notAdded = !existingNames.has(`${l.toLowerCase()} drop`);
      const matchesSearch = locationFilter ? l.toLowerCase().includes(locationFilter.toLowerCase()) : true;
      return notAdded && matchesSearch;
    });
  }, [stops, locationFilter]);

  return (
    <div className="min-h-[100dvh] bg-[#12150f] text-[#e8eadf]">
      {/* Official Government Tricolor Stripe */}
      <div className="flex h-[3px] w-full" role="presentation">
        <span className="flex-1 bg-[#c45c26]" />
        <span className="flex-1 bg-[#e8eadf]" />
        <span className="flex-1 bg-[#2f6b3c]" />
      </div>

      <div className="grid min-h-[calc(100dvh-3px)] lg:grid-cols-[minmax(340px,420px)_1fr]">
        <aside className="flex max-h-[100dvh] flex-col overflow-y-auto border-b border-[#2c3426] lg:border-b-0 lg:border-r">
          <header className="px-5 pt-4 pb-3">
            {/* Header Top Controls: Back button & DPIIT badge */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#3a4432] bg-[#1a1f16] px-2.5 py-1.5 text-[12px] font-medium text-[#d6dbcb] transition hover:border-[#d97706] hover:text-[#f3f6ee] active:scale-[0.98]"
              >
                <ArrowLeft size={14} strokeWidth={2} />
                ← Back to Overview
              </button>

              <div className="inline-flex items-center gap-1.5 rounded-md border border-[#3a4432] bg-[#1a1f16] px-2.5 py-1 text-[11px] font-medium text-[#d6dbcb]">
                <Factory size={13} strokeWidth={1.75} className="text-[#f0b429]" />
                DPIIT Logistics
              </div>
            </div>

            <h1 className="mt-3.5 text-[1.55rem] leading-[1.15] font-semibold tracking-[-0.03em] text-[#f3f6ee]">
              Last-Mile Route Optimizer
            </h1>
            <p className="mt-1 max-w-[42ch] text-[12.5px] leading-relaxed text-[#9aa38c]">
              Client-side dispatch engine. Search locations, configure self-incrementing tags, and evaluate 2-opt tours on OpenStreetMap.
            </p>
          </header>

          <div className="px-5 pb-3">
            <label className="flex items-center justify-between text-[12.5px] text-[#d6dbcb]" htmlFor="capacity">
              <span className="inline-flex items-center gap-1.5">
                <Truck size={14} strokeWidth={1.75} />
                Vehicle capacity
              </span>
              <span className="tabular text-[#f0b429] font-bold">{capacity} kg</span>
            </label>
            <input
              id="capacity"
              type="range"
              min={40}
              max={250}
              step={5}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="mt-1.5 w-full accent-[#d97706] cursor-pointer"
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={loadSample}
                className="rounded-md border border-[#3a4432] bg-[#1a1f16] px-3 py-2 text-[12.5px] font-medium text-[#e8eadf] transition hover:border-[#d97706] hover:text-[#f3f6ee] active:scale-[0.98]"
              >
                Sample 20 Drops
              </button>
              <button
                type="button"
                onClick={loadRandom}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#3a4432] bg-[#1a1f16] px-3 py-2 text-[12.5px] font-medium text-[#e8eadf] transition hover:border-[#d97706] active:scale-[0.98]"
              >
                <Shuffle size={14} strokeWidth={1.75} />
                Random 15-30
              </button>
            </div>

            <button
              type="button"
              onClick={runOptimize}
              disabled={!stops.length}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#d97706] px-3 py-2.5 text-[13.5px] font-bold text-[#12150f] shadow-[0_2px_8px_rgba(217,119,6,0.25)] transition hover:bg-[#f0b429] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#3a4432] disabled:text-[#9aa38c]"
            >
              <Play size={15} strokeWidth={2} />
              Run 2-Opt Optimization
            </button>

            {notice ? (
              <p className="mt-2 text-[11.5px] leading-snug text-[#c5ccb6] bg-[#1a1f16] border border-[#2c3426] p-2 rounded" role="status">
                {notice}
              </p>
            ) : null}
          </div>

          {/* SEARCH & TAGGING CONTROL BAR */}
          <section className="border-t border-[#2c3426] px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12.5px] font-semibold text-[#f3f6ee] flex items-center gap-1.5">
                <Search size={13} className="text-[#f0b429]" />
                Location Search &amp; Tags
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowAddLocation((prev) => !prev)}
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition ${
                    showAddLocation
                      ? "bg-[#d97706] text-[#12150f]"
                      : "border border-[#3a4432] bg-[#1a1f16] text-[#d6dbcb] hover:border-[#d97706]"
                  }`}
                  title="Search and add locations to docket"
                >
                  <Plus size={12} />
                  Add Drop
                </button>

                <button
                  type="button"
                  onClick={() => setShowTagConfig((prev) => !prev)}
                  className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition ${
                    showTagConfig
                      ? "bg-[#f0b429] text-[#12150f]"
                      : "border border-[#3a4432] bg-[#1a1f16] text-[#d6dbcb] hover:border-[#f0b429]"
                  }`}
                  title="Configure self-incrementing tags"
                >
                  <Tag size={12} />
                  Tag Rules
                </button>
              </div>
            </div>

            {/* LOCATION SEARCH INPUT BAR */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8670] pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stops, tags (e.g. DEL-001), or windows..."
                className="w-full rounded-lg border border-[#2c3426] bg-[#1a1f16] py-2.5 pl-10 pr-9 text-[13px] text-[#e8eadf] placeholder-[#7d8670] focus:border-[#d97706] focus:outline-none focus:ring-1 focus:ring-[#d97706]/40 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa38c] hover:text-[#e8eadf] p-0.5"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* ADD LOCATION ACCORDION / PICKER */}
            {showAddLocation && (
              <div className="mt-2.5 rounded-md border border-[#3a4432] bg-[#161a12] p-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#2c3426]">
                  <span className="text-[11.5px] font-medium text-[#f0b429] flex items-center gap-1">
                    <MapPin size={12} />
                    Add Delhi NCR Location
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddLocation(false)}
                    className="text-[#9aa38c] hover:text-[#e8eadf]"
                  >
                    <X size={12} />
                  </button>
                </div>

                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Filter Delhi NCR locales (e.g. Munirka, Lodi)..."
                  className="mt-2 w-full rounded border border-[#2c3426] bg-[#12150f] px-2.5 py-1.5 text-[11.5px] text-[#e8eadf] placeholder-[#7d8670] focus:border-[#d97706] focus:outline-none"
                />

                <div className="mt-2 max-h-36 overflow-y-auto space-y-1 pr-1">
                  {availableLocales.slice(0, 10).map((locale) => (
                    <button
                      key={locale}
                      type="button"
                      onClick={() => addStopFromLocale(locale)}
                      className="w-full flex items-center justify-between px-2 py-1 rounded bg-[#1a1f16] text-left text-[11.5px] text-[#d6dbcb] hover:bg-[#252c1f] hover:text-[#f3f6ee]"
                    >
                      <span>{locale}</span>
                      <span className="text-[10.5px] text-[#d97706] font-medium">+ Add</span>
                    </button>
                  ))}
                  {availableLocales.length === 0 && (
                    <p className="text-[11px] text-[#7d8670] py-2 text-center">
                      No matching locales found.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAG CONFIGURATION DRAWER (Starting Tag & Self-Increment) */}
            {showTagConfig && (
              <div className="mt-2.5 rounded-md border border-[#3a4432] bg-[#161a12] p-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#2c3426]">
                  <span className="text-[11.5px] font-semibold text-[#f0b429] flex items-center gap-1">
                    <Settings2 size={12} />
                    Tag Rules &amp; Increment Settings
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTagConfig(false)}
                    className="text-[#9aa38c] hover:text-[#e8eadf]"
                  >
                    <X size={12} />
                  </button>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10.5px] text-[#9aa38c] block" htmlFor="tagPrefix">
                      Tag Prefix
                    </label>
                    <input
                      id="tagPrefix"
                      type="text"
                      value={tagPrefix}
                      onChange={(e) => setTagPrefix(e.target.value.toUpperCase())}
                      placeholder="e.g. DEL, PKG"
                      className="mt-0.5 w-full rounded border border-[#2c3426] bg-[#12150f] px-2 py-1 text-[11.5px] text-[#e8eadf] font-mono focus:border-[#d97706] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] text-[#9aa38c] block" htmlFor="tagStartNumber">
                      Starting Tag #
                    </label>
                    <input
                      id="tagStartNumber"
                      type="number"
                      min={1}
                      value={tagStartNumber}
                      onChange={(e) => {
                        const val = Math.max(1, Number(e.target.value));
                        setTagStartNumber(val);
                        setTagNextNumber(val);
                      }}
                      className="mt-0.5 w-full rounded border border-[#2c3426] bg-[#12150f] px-2 py-1 text-[11.5px] text-[#e8eadf] tabular font-mono focus:border-[#d97706] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-[#9aa38c]">
                  <span>Next auto-tag:</span>
                  <span className="font-mono font-semibold text-[#f0b429]">
                    {formatTag(tagPrefix, tagNextNumber)}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={autoTagAllStops}
                    className="flex-1 rounded bg-[#3f8f5a] px-2 py-1.5 text-[11.5px] font-semibold text-[#f3f6ee] transition hover:bg-[#4ea86d] active:scale-[0.98]"
                  >
                    Auto-Tag All Drops (1..N)
                  </button>

                  <button
                    type="button"
                    onClick={clearAllTags}
                    className="rounded border border-[#522522] bg-[#291615] px-2 py-1.5 text-[11px] font-medium text-[#c2413b] hover:bg-[#3d1e1c]"
                    title="Clear all tags"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE TAG FILTER PILLS */}
            {allActiveTags.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10.5px] text-[#7d8670] flex items-center gap-1">
                  <Filter size={10} />
                  Tags:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter(null)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition ${
                    selectedTagFilter === null
                      ? "bg-[#d97706] text-[#12150f] font-bold"
                      : "bg-[#1a1f16] text-[#9aa38c] border border-[#2c3426]"
                  }`}
                >
                  All ({stops.length})
                </button>
                {allActiveTags.map((tag) => (
                  <div
                    key={tag}
                    className={`inline-flex items-center rounded text-[10px] font-mono transition border ${
                      selectedTagFilter === tag
                        ? "bg-[#f0b429] text-[#12150f] border-[#f0b429] font-bold"
                        : "bg-[#1a1f16] text-[#c5ccb6] border-[#2c3426] hover:border-[#f0b429]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                      className="px-1.5 py-0.5"
                    >
                      #{tag}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTagEverywhere(tag);
                      }}
                      className="pr-1 text-[#7d8670] hover:text-[#e05252] cursor-pointer"
                      title={`Delete tag #${tag} from all drops`}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* BASELINE VS OPTIMIZED METRICS */}
          <section className="border-t border-[#2c3426] px-5 py-3">
            <h2 className="text-[13.5px] font-semibold text-[#f3f6ee]">Baseline vs 2-Opt Solved</h2>
            {!baseline ? (
              <p className="mt-2 text-[12.5px] text-[#9aa38c]">
                Empty docket. Load the sample set or generate drops to compare tours.
              </p>
            ) : (
              <div className="mt-2 overflow-hidden rounded-md border border-[#2c3426]">
                <table className="w-full text-left text-[12px]">
                  <thead className="bg-[#1a1f16] text-[#9aa38c]">
                    <tr>
                      <th className="px-3 py-1.5 font-medium">Metric</th>
                      <th className="px-3 py-1.5 font-medium">Docket Order</th>
                      <th className="px-3 py-1.5 font-medium text-[#3f8f5a]">2-Opt Tour</th>
                    </tr>
                  </thead>
                  <tbody className="tabular">
                    <tr className="border-t border-[#2c3426]">
                      <td className="px-3 py-1.5 text-[#c5ccb6]">Distance</td>
                      <td className="px-3 py-1.5 text-[#c2413b] font-medium">{fmtKm(baseline.distanceKm)} km</td>
                      <td className="px-3 py-1.5 text-[#3f8f5a] font-semibold">
                        {optimized ? `${fmtKm(optimized.distanceKm)} km` : "—"}
                      </td>
                    </tr>
                    <tr className="border-t border-[#2c3426]">
                      <td className="px-3 py-1.5 text-[#c5ccb6]">Duration</td>
                      <td className="px-3 py-1.5">{fmtMin(baseline.durationMin)} min</td>
                      <td className="px-3 py-1.5 text-[#3f8f5a]">
                        {optimized ? `${fmtMin(optimized.durationMin)} min` : "—"}
                      </td>
                    </tr>
                    <tr className="border-t border-[#2c3426]">
                      <td className="px-3 py-1.5 text-[#c5ccb6]">Trips / Overflow</td>
                      <td className="px-3 py-1.5">
                        1 / {baseline.overflowCount}
                      </td>
                      <td className="px-3 py-1.5">
                        {optimized ? `${optimized.trips} / ${optimized.overflowCount}` : "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {optimized && baseline ? (
              <dl className="mt-2.5 grid grid-cols-3 gap-2 text-[11.5px]">
                <div className="rounded-md bg-[#1a1f16] border border-[#2c3426] px-2 py-1.5">
                  <dt className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <MapPinned size={11} strokeWidth={1.75} />
                    Distance
                  </dt>
                  <dd className="mt-0.5 tabular text-[14px] font-bold text-[#f3f6ee]">
                    {fmtKm(kmSaved)} km
                  </dd>
                  <dd className="text-[#3f8f5a] font-medium">{fmtPct(kmPct)} shorter</dd>
                </div>

                <div className="rounded-md bg-[#1a1f16] border border-[#2c3426] px-2 py-1.5">
                  <dt className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <Timer size={11} strokeWidth={1.75} />
                    Time
                  </dt>
                  <dd className="mt-0.5 tabular text-[14px] font-bold text-[#f3f6ee]">
                    {fmtMin(minSaved)} min
                  </dd>
                  <dd className="text-[#3f8f5a] font-medium">{fmtPct(minPct)} faster</dd>
                </div>

                <div className="rounded-md bg-[#1a1f16] border border-[#2c3426] px-2 py-1.5">
                  <dt className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <Leaf size={11} strokeWidth={1.75} />
                    Carbon
                  </dt>
                  <dd className="mt-0.5 tabular text-[14px] font-bold text-[#f3f6ee]">
                    {co2Saved.toFixed(1)} kg
                  </dd>
                  <dd className="inline-flex items-center gap-1 text-[#9aa38c]">
                    <Fuel size={10} strokeWidth={1.75} />
                    {fuelSaved.toFixed(1)} L
                  </dd>
                </div>
              </dl>
            ) : null}
          </section>

          {/* VISIT SEQUENCE & TAGGED STOP LIST */}
          <section className="flex min-h-0 flex-1 flex-col border-t border-[#2c3426] px-5 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[13.5px] font-semibold text-[#f3f6ee]">Visit Sequence</h2>
              <p className="text-[11px] text-[#9aa38c]">
                {filteredNodes.length} shown · Click row to cycle status
              </p>
            </div>

            {filteredNodes.length === 0 ? (
              <div className="mt-3 rounded-md border border-dashed border-[#3a4432] px-4 py-6 text-center text-[12.5px] text-[#9aa38c]">
                {searchQuery || selectedTagFilter
                  ? "No stops match current search or tag filter."
                  : "The stop list fills after loading a docket."}
              </div>
            ) : (
              <ol className="stop-list mt-2 max-h-[32vh] space-y-1.5 overflow-y-auto pr-1 lg:max-h-none">
                {filteredNodes.map((node, i) => {
                  if (node.kind === "depot") {
                    return (
                      <li
                        key={`${i}-depot`}
                        className="flex items-center gap-2 rounded-md bg-[#1a1f16]/60 px-2 py-1.5 text-[11.5px] text-[#f0b429]"
                      >
                        <Warehouse size={13} strokeWidth={1.75} />
                        <span className="font-semibold">{node.name}</span>
                        <span className="text-[#7d8670]">{i === 0 ? "(Departure)" : "(Reload Return)"}</span>
                      </li>
                    );
                  }

                  const stop = node.stop;
                  const st = status[stop.id] ?? "pending";
                  const tags = stopTags[stop.id] ?? [];
                  const isAddingTag = newTagInput?.stopId === stop.id;

                  return (
                    <li
                      key={stop.id}
                      className="rounded-md border border-[#2c3426] bg-[#1a1f16]/80 p-2 transition hover:border-[#3a4432]"
                    >
                      <div className="flex w-full items-start gap-2">
                        {/* Sequence number badge */}
                        <button
                          type="button"
                          onClick={() => setPanTarget({ lat: stop.lat, lng: stop.lng, id: stop.id })}
                          title="Click to center on map"
                          className="tabular mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d6dbcb] text-[10.5px] font-bold text-[#12150f] hover:bg-[#f0b429]"
                        >
                          {node.visitIndex}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <button
                              type="button"
                              onClick={() => cycleStatus(stop.id)}
                              className="truncate text-left font-medium text-[12.5px] text-[#f3f6ee] hover:text-[#f0b429]"
                            >
                              {stop.name}
                            </button>

                            <span
                              onClick={() => cycleStatus(stop.id)}
                              className={`cursor-pointer text-[10.5px] font-semibold uppercase ${
                                st === "done"
                                  ? "text-[#3f8f5a]"
                                  : st === "held"
                                    ? "text-[#c2413b]"
                                    : "text-[#7d8670]"
                              }`}
                            >
                              {st}
                            </span>
                          </div>

                          <div className="mt-0.5 text-[11px] text-[#9aa38c]">
                            {stop.timeWindow} · {stop.weightKg} kg · trip {node.trip}
                            {node.overflow ? " · overflow" : ""}
                          </div>

                          {/* TAG CHIPS ROW */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded bg-[#12150f] px-1.5 py-0.5 text-[10px] font-mono text-[#d6dbcb] border border-[#2c3426]"
                              >
                                #{tag}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTag(stop.id, tag);
                                  }}
                                  className="text-[#7d8670] hover:text-[#c2413b]"
                                  title={`Remove tag #${tag}`}
                                >
                                  <X size={10} />
                                </button>
                              </span>
                            ))}

                            {/* Self-Incrementing Quick Tag Button */}
                            <button
                              type="button"
                              onClick={() => addNextIncrementTag(stop.id)}
                              className="inline-flex items-center gap-0.5 rounded border border-dashed border-[#3a4432] bg-[#12150f]/60 px-1.5 py-0.5 text-[9.5px] font-mono text-[#f0b429] hover:border-[#f0b429]"
                              title={`Add next auto tag (${formatTag(tagPrefix, tagNextNumber)})`}
                            >
                              <Plus size={9} />
                              {formatTag(tagPrefix, tagNextNumber)}
                            </button>

                            {/* Custom Tag Input Toggle */}
                            {!isAddingTag ? (
                              <button
                                type="button"
                                onClick={() => setNewTagInput({ stopId: stop.id, value: "" })}
                                className="rounded px-1 py-0.5 text-[9.5px] text-[#7d8670] hover:text-[#e8eadf]"
                                title="Add custom tag"
                              >
                                + Custom
                              </button>
                            ) : (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  addCustomTag(stop.id, newTagInput.value);
                                }}
                                className="inline-flex items-center gap-1"
                              >
                                <input
                                  type="text"
                                  autoFocus
                                  value={newTagInput.value}
                                  onChange={(e) =>
                                    setNewTagInput({ stopId: stop.id, value: e.target.value })
                                  }
                                  placeholder="Tag name"
                                  className="w-16 rounded border border-[#d97706] bg-[#12150f] px-1 py-0.5 text-[9.5px] text-[#e8eadf] font-mono focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="rounded bg-[#d97706] px-1 py-0.5 text-[9px] font-bold text-[#12150f]"
                                >
                                  Add
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setNewTagInput(null)}
                                  className="text-[#7d8670] hover:text-[#e8eadf]"
                                >
                                  <X size={10} />
                                </button>
                              </form>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </aside>

        {/* Right Section: Leaflet OpenStreetMap View with dark filter */}
        <section className="relative min-h-[52vh] lg:min-h-0">
          <MapContainer
            center={[DELHI_DEPOT.lat, DELHI_DEPOT.lng]}
            zoom={11}
            className="absolute inset-0"
            scrollWheelZoom
          >
            {/* Standard OpenStreetMap tiles filtered by CSS dark inversion */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds points={boundPts} />
            <PanToLocation target={panTarget} />

            {/* Baseline Route: Red dashed */}
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

            {/* 2-Opt Optimized Route: Green solid */}
            {showOpt && optimized ? (
              <Polyline
                positions={optimized.coords}
                pathOptions={{ color: "#3f8f5a", weight: 4, opacity: 0.95 }}
              />
            ) : null}

            {/* Depot Staging Yard Marker */}
            <Marker
              position={[DELHI_DEPOT.lat, DELHI_DEPOT.lng]}
              icon={pinIcon(`<div class="pin pin-depot">HQ</div>`)}
              zIndexOffset={500}
            >
              <Popup>
                <strong>{DELHI_DEPOT.name}</strong>
                <br />
                Central Staging Yard &amp; Reload Depot
              </Popup>
            </Marker>

            {/* Stop Markers */}
            {stops.map((stop) => {
              const st = status[stop.id] ?? "pending";
              const n = visitById.get(stop.id);
              const overflow = overflowIds.has(stop.id);
              const tags = stopTags[stop.id] ?? [];
              const isHighlighted = panTarget?.id === stop.id;

              const cls =
                overflow && st !== "done"
                  ? "pin pin-overflow"
                  : st === "done"
                    ? "pin pin-done"
                    : isHighlighted
                      ? "pin pin-depot"
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
                    {tags.length > 0 ? ` [${tags.join(", ")}]` : ""}
                  </Tooltip>
                  <Popup>
                    <div className="text-[12px] leading-snug">
                      <strong>{stop.name}</strong>
                      <div className="mt-1 text-[#9aa38c]">
                        Window: {stop.timeWindow} · Weight: {stop.weightKg} kg
                        {overflow ? " · exceeds capacity" : ""}
                      </div>

                      {/* Display tags in popup */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded bg-[#1a1f16] px-1.5 py-0.5 text-[10px] font-mono text-[#f0b429] border border-[#2c3426]"
                          >
                            <span>#{t}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTag(stop.id, t);
                              }}
                              className="text-[#9aa38c] hover:text-[#e05252] cursor-pointer ml-0.5 transition"
                              title={`Delete tag #${t}`}
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>

                      {/* Quick Tag add inside popup */}
                      <div className="mt-2 pt-1.5 border-t border-[#2c3426] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => addNextIncrementTag(stop.id)}
                          className="text-[10px] font-mono text-[#d97706] hover:underline"
                        >
                          + Tag {formatTag(tagPrefix, tagNextNumber)}
                        </button>
                        <span className="text-[10px] uppercase font-semibold text-[#3f8f5a]">
                          {st}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Overlay Controls */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] flex items-end justify-between gap-3 p-3 pb-8">
            <div className="pointer-events-auto max-w-[260px] rounded-md border border-[#2c3426] bg-[#12150f]/92 px-3 py-2 text-[12px] text-[#c5ccb6] shadow-[0_8px_12px_rgb(0_0_0_/_0.35)] backdrop-blur-sm">
              <p className="font-semibold text-[#f3f6ee]">Delhi NCR Dispatch Board</p>
              <p className="mt-0.5 text-[#9aa38c]">
                Red dashed: docket sequence. Green solid: 2-opt tour.
              </p>
            </div>

            <fieldset className="pointer-events-auto mb-0 flex overflow-hidden rounded-md border border-[#2c3426] bg-[#12150f]/92 text-[12.5px] shadow-[0_8px_12px_rgb(0_0_0_/_0.35)] backdrop-blur-sm">
              <legend className="sr-only">Route overlay display mode</legend>
              {(
                [
                  ["both", "Both"],
                  ["baseline", "Docket"],
                  ["optimized", "2-Opt Tour"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className={
                    view === id
                      ? "bg-[#d97706] px-3.5 py-2 font-bold text-[#12150f]"
                      : "px-3.5 py-2 text-[#d6dbcb] hover:bg-[#1a1f16]"
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
