import type { RouteEvaluation } from "../optimizer/types";
const escape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
export function routeManifestCsv(route: RouteEvaluation) {
  const headers = ["sequence", "stop id", "stop name", "ETA", "service start", "service end", "time window", "demand", "tags", "latitude", "longitude"];
  const rows = route.stops.map(s => [s.sequence, s.id, s.name, s.arrivalTime, s.serviceStartTime, s.serviceEndTime, s.timeWindow ? `${s.timeWindow.start}/${s.timeWindow.end}` : "", s.demand, s.tags?.join("|"), s.lat, s.lng].map(escape).join(","));
  return [headers.map(escape).join(","), ...rows].join("\n");
}
