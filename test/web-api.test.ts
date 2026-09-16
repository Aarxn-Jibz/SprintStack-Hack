import { expect, test } from "bun:test";
import { routePlanFromApi, type ApiRoute } from "../src/api";

test("web adapter converts GeoJSON longitude-latitude coordinates for Leaflet", () => {
  const route: ApiRoute = { distanceMeters: 1200, totalDurationSeconds: 600, trips: [{ trip: 1, load: 5, distanceMeters: 1200, totalDurationSeconds: 600, stops: [{ id: "a", cumulativeDemand: 5 }] }], geometry: { geometry: { type: "LineString", coordinates: [[77.2, 28.5], [77.3, 28.6]] } } };
  const plan = routePlanFromApi(route, { id: "depot", name: "Depot", lat: 28.5, lng: 77.2 }, [{ id: "a", name: "Drop", lat: 28.6, lng: 77.3, timeWindow: "09:00-11:00", weightKg: 5 }], 10);
  expect(plan.coords).toEqual([[28.5, 77.2], [28.6, 77.3]]);
  expect(plan.nodes.filter(node => node.kind === "stop")[0]?.trip).toBe(1);
});
