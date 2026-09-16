# SprintStack

SprintStack is a last-mile route-optimization demo for urban freight. It compares a dispatcher-provided stop order with a nearest-neighbour + 2-opt route, then shows distance, time, fuel, and carbon savings on a Delhi NCR map.

The React dashboard works on its own; when the API is available it uses OSRM road routing. If the API or routing provider is unavailable, it falls back to the in-browser heuristic so the demo remains usable.

## Stack

- React, Vite, Tailwind CSS, Leaflet
- Bun, Hono, Zod
- OSRM with a Haversine fallback

## Run locally

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev:api
```

In another terminal:

```bash
bun run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). The API listens on `http://localhost:3000` by default.

To point the frontend at another API URL, set `VITE_API_URL` before starting Vite. The API accepts `PORT`, `CORS_ORIGIN`, and `FALLBACK_SPEED_KMH`.

## Commands

```bash
bun run build       # production frontend build
bun run typecheck   # type-check frontend and API
bun test            # API tests
```

## API

`POST /api/v1/routes/optimize` accepts a depot, stops, vehicle constraints, and an optional manual order. It returns baseline and optimized route evaluations, savings, unassigned stops, routing metadata, and GeoJSON route geometry.

```json
{
  "depot": { "lat": 12.97, "lng": 77.59 },
  "stops": [{ "id": "a", "lat": 12.98, "lng": 77.6 }],
  "vehicle": { "startTime": "08:00", "capacity": 10 },
  "returnToDepot": true
}
```

`GET /health` returns the API health status.

## Deployment

`vercel.json` configures the Vite frontend and the edge API route for Vercel.
