import { evaluateRoute } from "./optimizer/evaluate-route";
import { nearestNeighbor } from "./optimizer/nearest-neighbor";
import { improveTwoOpt } from "./optimizer/two-opt";
import type { OptimizeRequest, RouteEvaluation, RoutingMetadata, TripEvaluation, UnassignedStop } from "./optimizer/types";
import { haversineMatrix } from "./routing/haversine";
import type { RoutingProvider } from "./routing/provider";
import { straightLineGeometry } from "./routing/osrm";

const combine = (trips: TripEvaluation[]): RouteEvaluation => ({ order: trips.flatMap(trip => trip.order), distanceMeters: trips.reduce((n, trip) => n + trip.distanceMeters, 0), travelDurationSeconds: trips.reduce((n, trip) => n + trip.travelDurationSeconds, 0), waitingDurationSeconds: trips.reduce((n, trip) => n + trip.waitingDurationSeconds, 0), serviceDurationSeconds: trips.reduce((n, trip) => n + trip.serviceDurationSeconds, 0), totalDurationSeconds: trips.reduce((n, trip) => n + trip.totalDurationSeconds, 0), feasible: trips.every(trip => trip.feasible), stops: trips.flatMap(trip => trip.stops), violations: trips.flatMap(trip => trip.violations), endTimeSeconds: trips.at(-1)?.endTimeSeconds ?? 0, load: trips.at(-1)?.load ?? 0 });
function manualTrips(request: OptimizeRequest, matrix: { durations: number[][]; distances: number[][] }) {
  const orders: string[][] = [[]]; const unassigned: UnassignedStop[] = [];
  for (const id of request.manualOrder ?? request.stops.map(stop => stop.id)) {
    const stop = request.stops.find(item => item.id === id)!;
    if (request.vehicle?.capacity && (stop.demand ?? 0) > request.vehicle.capacity) { unassigned.push({ id, reason: "demand-exceeds-capacity" }); continue; }
    const current = orders.at(-1)!;
    if (current.length && !evaluateRoute(request, [...current, id], matrix).feasible) orders.push([id]); else current.push(id);
  }
  let time: number | undefined; const trips = orders.filter(order => order.length).map((order, index) => { const result = evaluateRoute(request, order, matrix, { startTimeSeconds: time, returnToDepot: true }); time = result.endTimeSeconds; return { ...result, trip: index + 1 }; });
  return { trips, unassigned };
}
export async function optimizeRoute(request: OptimizeRequest, provider: RoutingProvider) {
  const points = [request.depot, ...request.stops]; let matrix; let routing: RoutingMetadata = { provider: "osrm", degraded: false };
  try { matrix = await provider.getMatrix(points); } catch (error) { console.warn("Routing matrix unavailable; using haversine fallback", error instanceof Error ? error.message : error); matrix = haversineMatrix(points, Number(process.env.FALLBACK_SPEED_KMH ?? 35)); routing = { provider: "haversine", degraded: true }; }
  const baselineResult = manualTrips(request, matrix); const baseline = { ...combine(baselineResult.trips), trips: baselineResult.trips };
  const initial = nearestNeighbor(request, matrix); let time: number | undefined;
  const trips = initial.trips.map(trip => { const improved = improveTwoOpt(request, trip, matrix, time); time = improved.endTimeSeconds; return improved; });
  const optimized = combine(trips); const lines: number[][][] = []; let geometryDegraded = routing.degraded;
  for (const trip of trips) { const tripPoints = [request.depot, ...trip.order.map(id => request.stops.find(stop => stop.id === id)!), request.depot]; let geometry = straightLineGeometry(tripPoints); if (!routing.degraded) try { geometry = await provider.getRouteGeometry(tripPoints); } catch { geometryDegraded = true; } lines.push(geometry.geojson.geometry.coordinates); }
  const geometry = lines.length === 1 ? { type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: lines[0] } } : { type: "Feature" as const, properties: {}, geometry: { type: "MultiLineString" as const, coordinates: lines } };
  const distance = baseline.distanceMeters - optimized.distanceMeters, duration = baseline.travelDurationSeconds - optimized.travelDurationSeconds;
  return { routing, baseline, optimized: { ...optimized, trips, geometry, geometryDegraded }, savings: { distanceMeters: distance, distancePercent: baseline.distanceMeters ? distance / baseline.distanceMeters * 100 : 0, travelDurationSeconds: duration, travelDurationPercent: baseline.travelDurationSeconds ? duration / baseline.travelDurationSeconds * 100 : 0 }, unassignedStops: initial.unassigned };
}
