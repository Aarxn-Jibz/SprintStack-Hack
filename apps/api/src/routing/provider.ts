import type { Point, TravelMatrix } from "../optimizer/types";
export type RouteGeometry = { geojson: { type: "Feature"; properties: Record<string, unknown>; geometry: { type: "LineString"; coordinates: number[][] } }; degraded: boolean };
export interface RoutingProvider { getMatrix(points: Point[]): Promise<TravelMatrix>; getRouteGeometry(points: Point[]): Promise<RouteGeometry>; }
