import type { Depot, Stop } from "./data";

export type RouteNode =
  | { kind: "depot"; lat: number; lng: number; name: string }
  | {
      kind: "stop";
      stop: Stop;
      visitIndex: number;
      cumulativeKg: number;
      remainingKg: number;
      overflow: boolean;
      trip: number;
    };

export type RoutePlan = {
  nodes: RouteNode[];
  coords: [number, number][];
  distanceKm: number;
  durationMin: number;
  overflowCount: number;
  trips: number;
  totalWeightKg: number;
};

const URBAN_KMH = 18;
const DWELL_MIN = 4;
const DEPOT_TURN_MIN = 6;
const CO2_KG_PER_KM = 0.21;
const FUEL_L_PER_KM = 0.12;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

function distanceMatrix(points: { lat: number; lng: number }[]): number[][] {
  const n = points.length;
  const m = Array.from({ length: n }, () => Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const d = haversineKm(points[i], points[j]);
      m[i][j] = d;
      m[j][i] = d;
    }
  }
  return m;
}

function pathDistance(order: number[], matrix: number[][]): number {
  if (order.length === 0) return 0;
  let d = matrix[0][order[0] + 1];
  for (let i = 0; i < order.length - 1; i++) {
    d += matrix[order[i] + 1][order[i + 1] + 1];
  }
  d += matrix[order[order.length - 1] + 1][0];
  return d;
}

function twoOptSwap(route: number[], i: number, k: number): number[] {
  return [...route.slice(0, i), ...route.slice(i, k + 1).reverse(), ...route.slice(k + 1)];
}

function twoOpt(order: number[], matrix: number[][]): number[] {
  if (order.length < 4) return order.slice();
  let best = order.slice();
  let improved = true;
  let guard = 0;
  while (improved && guard < 80) {
    improved = false;
    guard += 1;
    const current = pathDistance(best, matrix);
    for (let i = 0; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const candidate = twoOptSwap(best, i, k);
        const d = pathDistance(candidate, matrix);
        if (d + 1e-9 < current) {
          best = candidate;
          improved = true;
          i = best.length;
          break;
        }
      }
    }
  }
  return best;
}

function nearestNeighborTrips(
  n: number,
  matrix: number[][],
  weights: number[],
  capacity: number,
): number[][] {
  const visited = Array<boolean>(n).fill(false);
  const trips: number[][] = [];
  let visitedCount = 0;

  while (visitedCount < n) {
    const trip: number[] = [];
    let remaining = capacity;
    let current = 0;
    let progressed = true;

    while (progressed) {
      progressed = false;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < n; i++) {
        if (visited[i]) continue;
        if (weights[i] > remaining) continue;
        const d = matrix[current][i + 1];
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      if (best === -1) break;
      visited[best] = true;
      trip.push(best);
      remaining -= weights[best];
      current = best + 1;
      visitedCount += 1;
      progressed = true;
    }

    if (trip.length === 0) {
      for (let i = 0; i < n; i++) {
        if (!visited[i]) {
          visited[i] = true;
          trip.push(i);
          visitedCount += 1;
        }
      }
    }
    trips.push(trip);
  }

  return trips;
}

function assemble(
  depot: Depot,
  stops: Stop[],
  trips: number[][],
  capacity: number,
): RoutePlan {
  const nodes: RouteNode[] = [
    { kind: "depot", lat: depot.lat, lng: depot.lng, name: depot.name },
  ];
  const coords: [number, number][] = [[depot.lat, depot.lng]];
  let overflowCount = 0;
  let visitIndex = 0;
  let distanceKm = 0;
  let prev: { lat: number; lng: number } = depot;

  trips.forEach((trip, t) => {
    if (t > 0) {
      nodes.push({ kind: "depot", lat: depot.lat, lng: depot.lng, name: depot.name });
      coords.push([depot.lat, depot.lng]);
      distanceKm += haversineKm(prev, depot);
      prev = depot;
    }
    let remaining = capacity;
    trip.forEach((idx) => {
      const stop = stops[idx];
      const overflow = stop.weightKg > remaining || stop.weightKg > capacity;
      if (overflow) overflowCount += 1;
      else remaining -= stop.weightKg;
      visitIndex += 1;
      nodes.push({
        kind: "stop",
        stop,
        visitIndex,
        cumulativeKg: capacity - remaining,
        remainingKg: Math.max(0, remaining),
        overflow,
        trip: t + 1,
      });
      coords.push([stop.lat, stop.lng]);
      distanceKm += haversineKm(prev, stop);
      prev = stop;
    });
  });

  coords.push([depot.lat, depot.lng]);
  distanceKm += haversineKm(prev, depot);
  nodes.push({ kind: "depot", lat: depot.lat, lng: depot.lng, name: depot.name });

  const tripsCount = Math.max(1, trips.length);
  const durationMin =
    (distanceKm / URBAN_KMH) * 60 +
    stops.length * DWELL_MIN +
    (tripsCount - 1) * DEPOT_TURN_MIN;

  return {
    nodes,
    coords,
    distanceKm,
    durationMin,
    overflowCount,
    trips: tripsCount,
    totalWeightKg: stops.reduce((s, x) => s + x.weightKg, 0),
  };
}

export function baselinePlan(depot: Depot, stops: Stop[], capacity: number): RoutePlan {
  if (stops.length === 0) {
    return {
      nodes: [{ kind: "depot", lat: depot.lat, lng: depot.lng, name: depot.name }],
      coords: [[depot.lat, depot.lng]],
      distanceKm: 0,
      durationMin: 0,
      overflowCount: 0,
      trips: 1,
      totalWeightKg: 0,
    };
  }
  const trips: number[][] = [stops.map((_, i) => i)];
  return assemble(depot, stops, trips, capacity);
}

/** @deprecated The API is the production optimizer; retained only as a local fallback helper. */
export function optimizedPlan(depot: Depot, stops: Stop[], capacity: number): RoutePlan {
  if (stops.length === 0) return baselinePlan(depot, stops, capacity);
  const points = [depot, ...stops];
  const matrix = distanceMatrix(points);
  const weights = stops.map((s) => s.weightKg);
  const rawTrips = nearestNeighborTrips(stops.length, matrix, weights, capacity);
  const polished = rawTrips.map((trip) => {
    const local = trip.map((stopIdx) => stopIdx);
    const subPoints = [depot, ...local.map((i) => stops[i])];
    const subMatrix = distanceMatrix(subPoints);
    const localOrder = local.map((_, i) => i);
    const improved = twoOpt(localOrder, subMatrix);
    return improved.map((i) => local[i]);
  });
  return assemble(depot, stops, polished, capacity);
}

export function fuelLitres(distanceKm: number) {
  return distanceKm * FUEL_L_PER_KM;
}

export function carbonKg(distanceKm: number) {
  return distanceKm * CO2_KG_PER_KM;
}

export function pctSaved(before: number, after: number) {
  if (before <= 0) return 0;
  return ((before - after) / before) * 100;
}
