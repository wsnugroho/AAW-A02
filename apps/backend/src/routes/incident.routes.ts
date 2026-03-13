import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { labIncidentPayloadSchema } from "../models/lab-incident";
import { incidentController } from "../controllers/incident.controller";

const incidentRouter = new Hono();

incidentRouter.get("/examples", incidentController.getExamples);
incidentRouter.get("/processed", incidentController.getProcessed);
incidentRouter.get("/stats", incidentController.getStats);

incidentRouter.post(
  "/",
  zValidator("json", labIncidentPayloadSchema),
  incidentController.createIncident,
);

export { incidentRouter };
