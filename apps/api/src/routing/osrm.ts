import { lineString } from "../export/geojson";
import type { Point, TravelMatrix } from "../optimizer/types";
import type { RouteGeometry, RoutingProvider } from "./provider";

const numberMatrix = (value: unknown, size: number): value is number[][] => Array.isArray(value) && value.length === size && value.every(row => Array.isArray(row) && row.length === size && row.every(cell => typeof cell === "number" && Number.isFinite(cell)));
export function osrmProvider(baseUrl = process.env.OSRM_BASE_URL ?? "https://router.project-osrm.org", timeoutMs = Number(process.env.OSRM_TIMEOUT_MS ?? 5000)): RoutingProvider {
  const request = async (path: string) => {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) throw new Error(`OSRM returned ${response.status}`);
    return response.json() as Promise<Record<string, unknown>>;
  };
  return {
    async getMatrix(points): Promise<TravelMatrix> {
      const data = await request(`/table/v1/driving/${points.map(p => `${p.lng},${p.lat}`).join(";")}?annotations=duration,distance`);
      if (!numberMatrix(data.durations, points.length) || !numberMatrix(data.distances, points.length)) throw new Error("OSRM returned an unusable matrix");
      return { durations: data.durations, distances: data.distances };
    },
    async getRouteGeometry(points): Promise<RouteGeometry> {
      const data = await request(`/route/v1/driving/${points.map(p => `${p.lng},${p.lat}`).join(";")}?overview=full&geometries=geojson`);
      const coordinates = (data.routes as Array<{ geometry?: { coordinates?: unknown } }> | undefined)?.[0]?.geometry?.coordinates;
      if (!Array.isArray(coordinates) || !coordinates.every(p => Array.isArray(p) && p.length >= 2 && p.every(n => typeof n === "number"))) throw new Error("OSRM returned unusable geometry");
      return { geojson: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: coordinates as number[][] } }, degraded: false };
    }
  };
}
export const straightLineGeometry = (points: Point[]): RouteGeometry => ({ geojson: lineString(points), degraded: true });
