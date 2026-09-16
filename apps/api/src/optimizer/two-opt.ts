import { evaluateRoute } from "./evaluate-route";
import type { OptimizeRequest, TravelMatrix, TripEvaluation } from "./types";

export function improveTwoOpt(request: OptimizeRequest, trip: TripEvaluation, matrix: TravelMatrix, startTimeSeconds = trip.endTimeSeconds - trip.totalDurationSeconds): TripEvaluation {
  let order = [...trip.order], best = evaluateRoute(request, order, matrix, { startTimeSeconds, returnToDepot: true });
  for (let pass = 0; pass < Math.max(1, order.length * 2); pass++) {
    let improved = false;
    for (let start = 0; start < order.length - 1 && !improved; start++) for (let end = start + 1; end < order.length; end++) {
      const candidate = [...order.slice(0, start), ...order.slice(start, end + 1).reverse(), ...order.slice(end + 1)], result = evaluateRoute(request, candidate, matrix, { startTimeSeconds, returnToDepot: true });
      if (result.feasible && result.totalDurationSeconds < best.totalDurationSeconds) { order = candidate; best = result; improved = true; break; }
    }
    if (!improved) break;
  }
  return { ...best, trip: trip.trip };
}
