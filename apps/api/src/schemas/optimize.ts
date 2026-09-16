import { z } from "zod";
import type { OptimizeRequest } from "../optimizer/types";

const point = z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) });
const timeWindow = z.object({ start: z.string().datetime({ offset: true }), end: z.string().datetime({ offset: true }) }).refine((v) => Date.parse(v.start) <= Date.parse(v.end), "time window end must be after start");
const stop = point.extend({ id: z.string().min(1), name: z.string().optional(), demand: z.number().nonnegative().optional(), serviceMinutes: z.number().nonnegative().optional(), priority: z.number().optional(), tags: z.array(z.string()).optional(), timeWindow: timeWindow.optional() });
export const optimizeSchema = z.object({
  depot: point.extend({ id: z.string().optional(), name: z.string().optional() }),
  stops: z.array(stop).min(1).max(50),
  manualOrder: z.array(z.string()).optional(),
  vehicle: z.object({ capacity: z.number().positive().optional(), startTime: z.string().datetime({ offset: true }).optional() }).optional(),
  returnToDepot: z.boolean().default(false)
}).superRefine((value, ctx) => {
  const ids = new Set<string>();
  value.stops.forEach((s, i) => { if (ids.has(s.id)) ctx.addIssue({ code: "custom", path: ["stops", i, "id"], message: "duplicate stop id" }); ids.add(s.id); });
  value.manualOrder?.forEach((id, i) => { if (!ids.has(id)) ctx.addIssue({ code: "custom", path: ["manualOrder", i], message: `unknown stop id: ${id}` }); });
  if (value.manualOrder && new Set(value.manualOrder).size !== value.manualOrder.length) ctx.addIssue({ code: "custom", path: ["manualOrder"], message: "manual order contains duplicates" });
});
export type OptimizeInput = OptimizeRequest;
