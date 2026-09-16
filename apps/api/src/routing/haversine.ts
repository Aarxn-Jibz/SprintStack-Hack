import type { Point, TravelMatrix } from "../optimizer/types";
const radians = (n: number) => n * Math.PI / 180;
export const haversineMeters = (a: Point, b: Point) => {
  const dLat = radians(b.lat - a.lat), dLng = radians(b.lng - a.lng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(radians(a.lat)) * Math.cos(radians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};
export const haversineMatrix = (points: Point[], speedKmh = 35): TravelMatrix => {
  const distances = points.map(a => points.map(b => haversineMeters(a, b)));
  return { distances, durations: distances.map(row => row.map(d => d / (speedKmh * 1000 / 3600))) };
};
