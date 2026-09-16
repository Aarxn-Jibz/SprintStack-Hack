import type { OptimizeRequest, RouteEvaluation, Stop, TravelMatrix, Violation } from "./types";

const initialTime = (value?: string) => value ? Date.parse(value) : 0;
const iso = (time: number) => time ? new Date(time).toISOString() : undefined;
export function evaluateRoute(request: OptimizeRequest, order: string[], matrix: TravelMatrix): RouteEvaluation {
  const byId = new Map(request.stops.map((stop, i) => [stop.id, { stop, i: i + 1 }]));
  const violations: Violation[] = []; let time = initialTime(request.vehicle?.startTime), previous = 0, demand = 0, distance = 0, travel = 0, waiting = 0, service = 0;
  const stops = order.flatMap((id, sequence) => {
    const entry = byId.get(id); if (!entry) return [];
    const duration = matrix.durations[previous]?.[entry.i], legDistance = matrix.distances[previous]?.[entry.i];
    if (!Number.isFinite(duration) || !Number.isFinite(legDistance)) { violations.push({ stopId: id, type: "unreachable", message: "No route to stop" }); return []; }
    travel += duration; distance += legDistance; time += duration * 1000; const arrival = time;
    const windowStart = entry.stop.timeWindow && Date.parse(entry.stop.timeWindow.start), windowEnd = entry.stop.timeWindow && Date.parse(entry.stop.timeWindow.end);
    if (windowStart && time < windowStart) { waiting += (windowStart - time) / 1000; time = windowStart; }
    const serviceStart = time;
    if (windowEnd && serviceStart > windowEnd) violations.push({ stopId: id, type: "time-window", message: "Service starts after time window" });
    demand += entry.stop.demand ?? 0;
    if (request.vehicle?.capacity !== undefined && demand > request.vehicle.capacity) violations.push({ stopId: id, type: "capacity", message: "Vehicle capacity exceeded" });
    const seconds = (entry.stop.serviceMinutes ?? 0) * 60; service += seconds; time += seconds * 1000; previous = entry.i;
    return [{ ...entry.stop, sequence: sequence + 1, arrivalTime: iso(arrival), serviceStartTime: iso(serviceStart), serviceEndTime: iso(time), waitingSeconds: Math.max(0, (serviceStart - arrival) / 1000), travelDurationSeconds: duration, travelDistanceMeters: legDistance, cumulativeDemand: demand }];
  });
  if (request.returnToDepot && previous) { travel += matrix.durations[previous][0]; distance += matrix.distances[previous][0]; }
  return { order, distanceMeters: distance, travelDurationSeconds: travel, waitingDurationSeconds: waiting, serviceDurationSeconds: service, totalDurationSeconds: travel + waiting + service, feasible: violations.length === 0 && stops.length === order.length, stops, violations };
}
