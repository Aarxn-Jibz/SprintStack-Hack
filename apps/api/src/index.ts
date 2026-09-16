import { createApp } from "./app";
const port = Number(process.env.PORT ?? 3001);
Bun.serve({ port, fetch: createApp().fetch });
console.info(`SprintStack API listening on http://localhost:${port}`);
