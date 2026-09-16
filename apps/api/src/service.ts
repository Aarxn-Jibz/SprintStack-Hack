import { lineString } from "./export/geojson";
import { evaluateRoute } from "./optimizer/evaluate-route";
import { nearestNeighbor } from "./optimizer/nearest-neighbor";
import { improveTwoOpt } from "./optimizer/two-opt";
import type { OptimizeRequest, RoutingMetadata } from "./optimizer/types";
import { haversineMatrix } from "./routing/haversine";
import type { RoutingProvider } from "./routing/provider";
import { straightLineGeometry } from "./routing/osrm";

export async function optimizeRoute(request: OptimizeRequest, provider: RoutingProvider) {
  const points = [request.depot, ...request.stops]; let matrix; let routing: RoutingMetadata = { provider: "osrm", degraded: false };
  try { matrix = await provider.getMatrix(points); } catch (error) { console.warn("Routing matrix unavailable; using haversine fallback", error instanceof Error ? error.message : error); matrix = haversineMatrix(points, Number(process.env.FALLBACK_SPEED_KMH ?? 35)); routing = { provider: "haversine", degraded: true }; }
  const baselineOrder = request.manualOrder ?? request.stops.map(s => s.id);
  const baseline = evaluateRoute(request, baselineOrder, matrix);
  const initial = nearestNeighbor(request, matrix);
  const improved = improveTwoOpt(request, initial.order, matrix);
  const orderedPoints = [request.depot, ...improved.order.map(id => request.stops.find(s => s.id === id)!), ...(request.returnToDepot ? [request.depot] : [])];
  let geometry = straightLineGeometry(orderedPoints);
  if (!routing.degraded) try { geometry = await provider.getRouteGeometry(orderedPoints); } catch (error) { console.warn("Route geometry unavailable; using straight-line fallback", error instanceof Error ? error.message : error); }
  const savings = (before: number, after: number) => ({ value: before - after, percent: before ? ((before - after) / before) * 100 : 0 });
  const distance = savings(baseline.distanceMeters, improved.evaluation.distanceMeters), duration = savings(baseline.travelDurationSeconds, improved.evaluation.travelDurationSeconds);
  return { routing, baseline, optimized: { ...improved.evaluation, geometry: geometry.geojson, geometryDegraded: geometry.degraded }, savings: { distanceMeters: distance.value, distancePercent: distance.percent, travelDurationSeconds: duration.value, travelDurationPercent: duration.percent }, unassignedStops: initial.unassigned };
}
