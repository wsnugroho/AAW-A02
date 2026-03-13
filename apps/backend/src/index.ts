import { Hono } from "hono";
import { cors } from "hono/cors";
import { incidentRouter } from "./routes/incident.routes";

const app = new Hono();
const port = Number(process.env.PORT ?? 3000);

app.use("*", cors());

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "campus-lab-incident-api",
    timestamp: new Date().toISOString(),
  });
});

// Mount modular routes
app.route("/api/incidents", incidentRouter);

// Consumer now runs in separate container

export default {
  port,
  fetch: app.fetch,
};

console.log(`[api] listening on http://localhost:${port}`);
