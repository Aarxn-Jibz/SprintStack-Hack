import { expect, test } from "bun:test";
import { createApp } from "../src/app";
import { evaluateRoute } from "../src/optimizer/evaluate-route";
import { nearestNeighbor } from "../src/optimizer/nearest-neighbor";
import { improveTwoOpt } from "../src/optimizer/two-opt";
import type { OptimizeRequest, TravelMatrix } from "../src/optimizer/types";
import { haversineMatrix } from "../src/routing/haversine";
import type { RoutingProvider } from "../src/routing/provider";

const matrix = (durations: number[][]): TravelMatrix => ({ durations, distances: durations.map(row => row.map(value => value * 10)) });
const request = (demands: number[], overrides: Partial<OptimizeRequest> = {}): OptimizeRequest => ({ depot: { lat: 0, lng: 0 }, stops: demands.map((demand, i) => ({ id: String.fromCharCode(97 + i), lat: 0, lng: i + 1, demand })), vehicle: { startTime: "08:00", capacity: 10 }, returnToDepot: true, ...overrides });
const costs = matrix([[0, 60, 60, 60], [60, 0, 60, 60], [60, 60, 0, 60], [60, 60, 60, 0]]);

test("evaluator accounts for waiting, service and exact capacity", () => {
  const input = request([10], { stops: [{ id: "a", lat: 0, lng: 1, demand: 10, serviceMinutes: 10, timeWindow: { start: "08:05", end: "08:20" } }] });
  const result = evaluateRoute(input, ["a"], matrix([[0, 300], [300, 0]]));
  expect(result.waitingDurationSeconds).toBe(0); expect(result.serviceDurationSeconds).toBe(600); expect(result.feasible).toBe(true);
});
test("nearest neighbor reloads at depot and resets capacity", () => {
  const result = nearestNeighbor(request([6, 4, 6]), costs);
  expect(result.trips.map(trip => trip.order)).toEqual([["a", "b"], ["c"]]);
  expect(result.trips.map(trip => trip.load)).toEqual([10, 6]);
  expect(result.trips[1].endTimeSeconds).toBeGreaterThan(result.trips[0].endTimeSeconds);
});
test("multiple reloads, oversized stops, and missed windows are explicit", () => {
  expect(nearestNeighbor(request([6, 6, 6]), costs).trips).toHaveLength(3);
  expect(nearestNeighbor(request([11]), matrix([[0, 1], [1, 0]])).unassigned).toEqual([{ id: "a", reason: "demand-exceeds-capacity" }]);
  const late = request([1], { stops: [{ id: "a", lat: 0, lng: 1, demand: 1, timeWindow: { start: "07:00", end: "07:30" } }] });
  expect(nearestNeighbor(late, matrix([[0, 60], [60, 0]])).unassigned).toEqual([{ id: "a", reason: "time-window-infeasible" }]);
});
test("2-opt improves only a feasible capacity trip", () => {
  const input = request([2, 2, 2]); const poor = { ...evaluateRoute(input, ["a", "b", "c"], matrix([[0, 10, 1, 1], [1, 0, 10, 1], [10, 10, 0, 1], [1, 1, 10, 0]]), { returnToDepot: true }), trip: 1 };
  const result = improveTwoOpt(input, poor, matrix([[0, 10, 1, 1], [1, 0, 10, 1], [10, 10, 0, 1], [1, 1, 10, 0]]));
  expect(result.feasible).toBe(true); expect(result.load).toBeLessThanOrEqual(10); expect(result.totalDurationSeconds).toBeLessThan(poor.totalDurationSeconds);
});
test("haversine matrix and API fallback are usable", async () => {
  expect(haversineMatrix([{ lat: 0, lng: 0 }, { lat: 0, lng: 1 }]).distances[0][1]).toBeGreaterThan(110_000);
  const failed: RoutingProvider = { getMatrix: async () => { throw new Error("offline"); }, getRouteGeometry: async () => { throw new Error("offline"); } };
  const response = await createApp(failed).request("http://test/api/v1/routes/optimize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(request([6, 6])) });
  const body = await response.json() as { optimized: { trips: unknown[] }; routing: { provider: string } };
  expect(response.status).toBe(200); expect(body.optimized.trips).toHaveLength(2); expect(body.routing.provider).toBe("haversine");
});
