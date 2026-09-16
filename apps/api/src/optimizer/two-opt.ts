import { evaluateRoute } from "./evaluate-route";
import type { OptimizeRequest, TravelMatrix } from "./types";

export function improveTwoOpt(request: OptimizeRequest, initialOrder: string[], matrix: TravelMatrix) {
  let order = [...initialOrder], best = evaluateRoute(request, order, matrix);
  const limit = Math.max(1, initialOrder.length * 2);
  for (let pass = 0; pass < limit; pass++) {
    let improved = false;
    for (let start = 0; start < order.length - 1 && !improved; start++) for (let end = start + 1; end < order.length; end++) {
      const candidate = [...order.slice(0, start), ...order.slice(start, end + 1).reverse(), ...order.slice(end + 1)];
      const result = evaluateRoute(request, candidate, matrix);
      if (result.feasible && result.totalDurationSeconds < best.totalDurationSeconds) { order = candidate; best = result; improved = true; break; }
    }
    if (!improved) break;
  }
  return { order, evaluation: best };
}
