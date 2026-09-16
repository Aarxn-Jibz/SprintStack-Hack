import { evaluateRoute } from "./evaluate-route";
import type { OptimizeRequest, TravelMatrix, TripEvaluation, UnassignedStop } from "./types";

export function nearestNeighbor(request: OptimizeRequest, matrix: TravelMatrix) {
  const remaining = new Set(request.stops.map(s => s.id)); const trips: TripEvaluation[] = []; const unassigned: UnassignedStop[] = [];
  let time: number | undefined;
  while (remaining.size) {
    const order: string[] = []; let current = 0;
    while (true) {
      const candidates = [...remaining].map(id => {
        const index = request.stops.findIndex(stop => stop.id === id) + 1;
        return { id, index, result: evaluateRoute(request, [...order, id], matrix, { startTimeSeconds: time }), cost: matrix.durations[current][index] };
      }).filter(candidate => candidate.result.feasible).sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
      const next = candidates[0]; if (!next) break;
      order.push(next.id); remaining.delete(next.id); current = next.index;
    }
    if (order.length) { const result = evaluateRoute(request, order, matrix, { startTimeSeconds: time, returnToDepot: true }); trips.push({ ...result, trip: trips.length + 1 }); time = result.endTimeSeconds; continue; }
    for (const id of remaining) { const stop = request.stops.find(s => s.id === id)!; unassigned.push({ id, reason: request.vehicle?.capacity && (stop.demand ?? 0) > request.vehicle.capacity ? "demand-exceeds-capacity" : "time-window-infeasible" }); }
    break;
  }
  return { trips, unassigned };
}
