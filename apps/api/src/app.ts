import { cors } from "hono/cors";
import { Hono } from "hono";
import { ZodError } from "zod";
import { optimizeRoute } from "./service";
import { osrmProvider } from "./routing/osrm";
import type { RoutingProvider } from "./routing/provider";
import { optimizeSchema } from "./schemas/optimize";

export function createApp(provider: RoutingProvider = osrmProvider()) {
  const app = new Hono();
  app.use("/api/*", cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000", allowMethods: ["POST", "OPTIONS"] }));
  app.get("/health", c => c.json({ status: "ok" }));
  app.post("/api/v1/routes/optimize", async c => {
    let body: unknown;
    try { body = await c.req.json(); } catch { return c.json({ error: "Invalid JSON body" }, 400); }
    const input = optimizeSchema.parse(body);
    return c.json(await optimizeRoute(input, provider));
  });
  app.onError((error, c) => error instanceof ZodError ? c.json({ error: "Invalid request", details: error.issues }, 400) : c.json({ error: "Internal server error" }, 500));
  return app;
}
