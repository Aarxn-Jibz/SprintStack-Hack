import type { OptimizeRequest, RouteEvaluation, TravelMatrix, Violation } from "./types";

const toSeconds = (clock?: string) => { if (!clock) return 0; const [hour, minute] = clock.split(":").map(Number); return hour * 3600 + minute * 60; };
const toClock = (value: number) => `${String(Math.floor(value / 3600) % 24).padStart(2, "0")}:${String(Math.floor(value / 60) % 60).padStart(2, "0")}`;
export type RouteState = { startTimeSeconds?: number; initialLoad?: number; returnToDepot?: boolean };

export function evaluateRoute(request: OptimizeRequest, order: string[], matrix: TravelMatrix, state: RouteState = {}): RouteEvaluation {
  const byId = new Map(request.stops.map((stop, i) => [stop.id, { stop, index: i + 1 }]));
  const violations: Violation[] = []; let time = state.startTimeSeconds ?? toSeconds(request.vehicle?.startTime), previous = 0, load = state.initialLoad ?? 0, distance = 0, travel = 0, waiting = 0, service = 0;
  const stops = order.flatMap((id, sequence) => {
    const entry = byId.get(id); if (!entry) return [];
    const duration = matrix.durations[previous]?.[entry.index], legDistance = matrix.distances[previous]?.[entry.index];
    if (!Number.isFinite(duration) || !Number.isFinite(legDistance)) { violations.push({ stopId: id, type: "unreachable", message: "No route to stop" }); return []; }
    time += duration; travel += duration; distance += legDistance; const arrival = time;
    const start = entry.stop.timeWindow && toSeconds(entry.stop.timeWindow.start), end = entry.stop.timeWindow && toSeconds(entry.stop.timeWindow.end);
    if (start !== undefined && time < start) { waiting += start - time; time = start; }
    const serviceStart = time;
    if (end !== undefined && serviceStart > end) violations.push({ stopId: id, type: "time-window", message: "Service starts after time window" });
    load += entry.stop.demand ?? 0;
    if (request.vehicle?.capacity !== undefined && load > request.vehicle.capacity) violations.push({ stopId: id, type: "capacity", message: "Vehicle capacity exceeded" });
    const serviceSeconds = (entry.stop.serviceMinutes ?? 0) * 60; service += serviceSeconds; time += serviceSeconds; previous = entry.index;
    return [{ ...entry.stop, sequence: sequence + 1, arrivalTime: toClock(arrival), serviceStartTime: toClock(serviceStart), serviceEndTime: toClock(time), waitingSeconds: serviceStart - arrival, travelDurationSeconds: duration, travelDistanceMeters: legDistance, cumulativeDemand: load }];
  });
  if (state.returnToDepot && previous) { const duration = matrix.durations[previous][0], legDistance = matrix.distances[previous][0]; time += duration; travel += duration; distance += legDistance; }
  return { order, distanceMeters: distance, travelDurationSeconds: travel, waitingDurationSeconds: waiting, serviceDurationSeconds: service, totalDurationSeconds: travel + waiting + service, feasible: violations.length === 0 && stops.length === order.length, stops, violations, endTimeSeconds: time, load };
}
