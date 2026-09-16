import { describe, expect, test } from "bun:test";
import { createApp } from "../src/app";
import { evaluateRoute } from "../src/optimizer/evaluate-route";
import { nearestNeighbor } from "../src/optimizer/nearest-neighbor";
import { improveTwoOpt } from "../src/optimizer/two-opt";
import type { OptimizeRequest, TravelMatrix } from "../src/optimizer/types";
import { haversineMatrix } from "../src/routing/haversine";
import type { RoutingProvider } from "../src/routing/provider";

const matrix = (durations: number[][]): TravelMatrix => ({ durations, distances: durations.map(row => row.map(v => v * 10)) });
const base = (stops: OptimizeRequest["stops"]): OptimizeRequest => ({ depot: { lat: 0, lng: 0 }, stops, vehicle: { startTime: "2026-01-01T08:00:00.000Z", capacity: 10 } });
const stops = [{ id: "a", lat: 0, lng: 1, demand: 2 }, { id: "b", lat: 0, lng: 2, demand: 2 }, { id: "c", lat: 0, lng: 3, demand: 2 }];

describe("route evaluator", () => {
  test("accounts for travel, waiting, service and violations", () => {
    const request = base([{ ...stops[0], serviceMinutes: 10, timeWindow: { start: "2026-01-01T08:05:00.000Z", end: "2026-01-01T08:20:00.000Z" } }]);
    const result = evaluateRoute(request, ["a"], matrix([[0, 300], [300, 0]]));
    expect(result.travelDurationSeconds).toBe(300); expect(result.waitingDurationSeconds).toBe(0); expect(result.serviceDurationSeconds).toBe(600); expect(result.totalDurationSeconds).toBe(900);
    expect(evaluateRoute(base([{ ...stops[0], demand: 11 }]), ["a"], matrix([[0, 1], [1, 0]])).feasible).toBe(false);
  });
});
describe("nearest neighbor", () => {
  test("chooses nearest feasible stop and permits waiting", () => {
    const request = base([{ ...stops[0], timeWindow: { start: "2026-01-01T09:00:00.000Z", end: "2026-01-01T10:00:00.000Z" } }, stops[1]]);
    expect(nearestNeighbor(request, matrix([[0, 20, 30], [20, 0, 10], [30, 10, 0]])).order).toEqual(["a", "b"]);
  });
  test("leaves missed windows and excess capacity unassigned", () => {
    const request = base([{ ...stops[0], demand: 11 }, { ...stops[1], timeWindow: { start: "2026-01-01T07:00:00.000Z", end: "2026-01-01T07:30:00.000Z" } }]);
    expect(nearestNeighbor(request, matrix([[0, 1, 1], [1, 0, 1], [1, 1, 0]])).unassigned).toEqual(["a", "b"]);
  });
});
test("two-opt improves a poor asymmetric route", () => {
  const costs = matrix([[0, 10, 1, 1], [1, 0, 10, 1], [10, 10, 0, 1], [1, 1, 10, 0]]);
  const result = improveTwoOpt(base(stops), ["a", "b", "c"], costs);
  expect(result.evaluation.feasible).toBe(true); expect(result.evaluation.totalDurationSeconds).toBeLessThan(12);
});
test("haversine matrix is usable", () => {
  const result = haversineMatrix([{ lat: 0, lng: 0 }, { lat: 0, lng: 1 }], 36);
  expect(result.distances[0][1]).toBeGreaterThan(110_000); expect(result.durations[0][1]).toBeGreaterThan(10_000);
});
test("API validates input and degrades to fallback", async () => {
  const failed: RoutingProvider = { getMatrix: async () => { throw new Error("offline"); }, getRouteGeometry: async () => { throw new Error("offline"); } };
  const app = createApp(failed);
  const valid = await app.request("http://test/api/v1/routes/optimize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(base(stops)) });
  expect(valid.status).toBe(200); expect((await valid.json() as { routing: { provider: string } }).routing.provider).toBe("haversine");
  const invalid = await app.request("http://test/api/v1/routes/optimize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
  expect(invalid.status).toBe(400);
});
