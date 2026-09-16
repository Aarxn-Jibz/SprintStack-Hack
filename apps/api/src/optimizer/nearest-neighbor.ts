import { evaluateRoute } from "./evaluate-route";
import type { OptimizeRequest, TravelMatrix } from "./types";

export function nearestNeighbor(request: OptimizeRequest, matrix: TravelMatrix) {
  const remaining = new Set(request.stops.map(s => s.id)); const order: string[] = []; const unassigned: string[] = [];
  let currentIndex = 0;
  while (remaining.size) {
    const candidates = [...remaining].map(id => {
      const index = request.stops.findIndex(stop => stop.id === id) + 1;
      const evaluated = evaluateRoute({ ...request, returnToDepot: false }, [...order, id], matrix);
      return { id, index, evaluated, cost: matrix.durations[currentIndex][index] };
    }).filter(candidate => candidate.evaluated.feasible).sort((a, b) => a.cost - b.cost || a.id.localeCompare(b.id));
    const next = candidates[0];
    if (!next) { unassigned.push(...remaining); break; }
    order.push(next.id); remaining.delete(next.id); currentIndex = next.index;
  }
  return { order, unassigned };
}
