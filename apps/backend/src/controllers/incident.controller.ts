import type { Context } from "hono";
import { incidentService } from "../services/incident.service";
import type { LabIncidentPayload } from "../models/lab-incident";

export const incidentController = {
  getExamples: async (c: Context) => {
    const data = await incidentService.getExamples();
    return c.json({ data });
  },

  getProcessed: async (c: Context) => {
    const records = await incidentService.getProcessed();
    return c.json({
      count: records.length,
      data: records,
    });
  },

  getStats: async (c: Context) => {
    const stats = await incidentService.getStats();
    return c.json(stats);
  },

  createIncident: async (c: Context) => {
    const payload = await c.req.json() as LabIncidentPayload;

    const event = await incidentService.createIncident(payload);

    return c.json(
      {
        message: "Incident event accepted and published to RabbitMQ.",
        event,
      },
      202,
    );
  },
};
