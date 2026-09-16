import type { Depot, Stop } from "./data";
import type { RoutePlan } from "./routing";

type ApiRouteStop = { id: string; cumulativeDemand: number };
type ApiTrip = { trip: number; load: number; distanceMeters: number; totalDurationSeconds: number; stops: ApiRouteStop[] };
export type ApiRoute = { trips: ApiTrip[]; distanceMeters: number; totalDurationSeconds: number; geometry?: { geometry: { type: string; coordinates: number[][] | number[][][] } } };
type ApiResult = { baseline: ApiRoute; optimized: ApiRoute; routing: { degraded: boolean }; unassignedStops: { id: string; reason: string }[] };

const clockWindow = (value: string) => { const [start, end] = value.split("-"); return { start, end }; };
const point = ([lng, lat]: number[]) => [lat, lng] as [number, number];
export function routePlanFromApi(route: ApiRoute, depot: Depot, stops: Stop[], capacity: number): RoutePlan {
  const byId = new Map(stops.map(stop => [stop.id, stop]));
  const nodes: RoutePlan["nodes"] = [{ kind: "depot", lat: depot.lat, lng: depot.lng, name: depot.name }];
  route.trips.forEach(trip => { trip.stops.forEach(entry => { const stop = byId.get(entry.id)!; nodes.push({ kind: "stop", stop, visitIndex: nodes.filter(node => node.kind === "stop").length + 1, cumulativeKg: entry.cumulativeDemand, remainingKg: Math.max(0, capacity - entry.cumulativeDemand), overflow: false, trip: trip.trip }); }); nodes.push({ kind: "depot", lat: depot.lat, lng: depot.lng, name: depot.name }); });
  const geometry = route.geometry?.geometry;
  const coords: [number, number][] = geometry?.type === "MultiLineString" ? (geometry.coordinates as number[][][]).flat().map(point) : geometry?.type === "LineString" ? (geometry.coordinates as number[][]).map(point) : nodes.map(node => node.kind === "depot" ? [node.lat, node.lng] as [number, number] : [node.stop.lat, node.stop.lng] as [number, number]);
  return { nodes, coords, distanceKm: route.distanceMeters / 1000, durationMin: route.totalDurationSeconds / 60, overflowCount: 0, trips: route.trips.length, totalWeightKg: stops.reduce((sum, stop) => sum + stop.weightKg, 0) };
}
export async function optimize(depot: Depot, stops: Stop[], capacity: number) {
  const response = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api/v1/routes/optimize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: AbortSignal.timeout(3500),
    body: JSON.stringify({
      depot,
      stops: stops.map((stop) => ({
        id: stop.id,
        name: stop.name,
        lat: stop.lat,
        lng: stop.lng,
        demand: stop.weightKg,
        serviceMinutes: 4,
        timeWindow: clockWindow(stop.timeWindow),
      })),
      manualOrder: stops.map((stop) => stop.id),
      vehicle: { capacity, startTime: "08:00" },
      returnToDepot: true,
    }),
  });
  if (!response.ok) throw new Error("Optimization request failed");
  const result = await response.json() as ApiResult;
  return { baseline: routePlanFromApi(result.baseline, depot, stops, capacity), optimized: routePlanFromApi(result.optimized, depot, stops, capacity), unassigned: result.unassignedStops, degraded: result.routing.degraded };
}
