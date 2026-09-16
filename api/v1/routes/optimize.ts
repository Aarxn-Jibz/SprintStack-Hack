export const config = { runtime: "edge" };

import { Hono } from "hono";
import { cors } from "hono/cors";
import { ZodError } from "zod";

import { optimizeRoute } from "../../../apps/api/src/service";
import { osrmProvider } from "../../../apps/api/src/routing/osrm";
import { optimizeSchema } from "../../../apps/api/src/schemas/optimize";

const app = new Hono();
app.use('/api/*', cors({ origin: process.env.CORS_ORIGIN ?? '*', allowMethods: ['POST', 'OPTIONS'] }));

app.options('/api/v1/routes/optimize', c => c.text('', 204));

app.post('/api/v1/routes/optimize', async c => {
  let body: unknown;
  try { body = await c.req.json(); } catch { return c.json({ error: 'Invalid JSON body' }, 400); }

  try {
    const input = optimizeSchema.parse(body);
    const result = await optimizeRoute(input, osrmProvider());
    return c.json(result);
  } catch (err) {
    if (err instanceof ZodError) return c.json({ error: 'Invalid request', details: err.issues }, 400);
    console.error('Optimize error:', err instanceof Error ? err.message : err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app.fetch;
