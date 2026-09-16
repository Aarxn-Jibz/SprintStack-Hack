# SprintStack routing API

`bun run dev:api` starts the API on port 3000. `bun test` and `bun run typecheck` validate it. Copy `.env.example` to `.env` to tune OSRM, timeout, fallback speed, port, or local CORS origin.

Endpoints: `GET /health`, `POST /api/v1/routes/optimize`.

```json
{"depot":{"lat":12.97,"lng":77.59},"stops":[{"id":"a","lat":12.98,"lng":77.60}],"vehicle":{"startTime":"08:00","capacity":10},"returnToDepot":true}
```

The API gets one road-cost matrix, evaluates the supplied manual order (or input order), builds a constraint-aware nearest-neighbor route, then applies full-route-evaluated 2-opt moves. Dijkstra belongs inside road routing, not this stop-ordering problem. Responses include both route evaluations, savings, unassigned stops, and GeoJSON geometry.

OSRM is the primary provider. Timeouts, unusable matrices, and geometry errors gracefully fall back to Haversine travel estimates or straight-line GeoJSON and report degradation; they are never labelled road routes. `src/export` includes pure GeoJSON and CSV manifest helpers for the frontend or future download endpoint.
