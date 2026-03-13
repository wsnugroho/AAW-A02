import {
  createIncidentEvent,
  sampleIncidents,
  type LabIncidentPayload,
} from "../models/lab-incident";
import { loadProcessedIncidents } from "../repositories/processed-store";
import { publishIncidentEvent } from "../config/rabbitmq";

export const incidentService = {
  async getExamples() {
    return sampleIncidents;
  },

  async getProcessed() {
    return loadProcessedIncidents();
  },

  async getStats() {
    const records = await loadProcessedIncidents();
    const stats = {
      total: records.length,
      byPriority: {
        high: records.filter((r) => r.priority === "high").length,
        medium: records.filter((r) => r.priority === "medium").length,
        low: records.filter((r) => r.priority === "low").length,
      },
      byType: records.reduce(
        (acc, r) => {
          acc[r.payload.incidentType] = (acc[r.payload.incidentType] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
    return stats;
  },

  async createIncident(payload: LabIncidentPayload) {
    const event = createIncidentEvent(payload);
    await publishIncidentEvent(event);
    return event;
  },
};
