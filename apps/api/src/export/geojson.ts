import type { Point } from "../optimizer/types";
export const lineString = (points: Point[]) => ({ type: "Feature" as const, properties: {}, geometry: { type: "LineString" as const, coordinates: points.map(p => [p.lng, p.lat]) } });
