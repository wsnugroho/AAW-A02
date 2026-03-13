import { z } from "zod";

export const INCIDENT_QUEUE = "lab.incident.reported";

export type IncidentType =
  | "device_overheat"
  | "network_unstable"
  | "water_leak"
  | "projector_failure"
  | "minor_noise";

export type Priority = "low" | "medium" | "high";

export interface LabIncidentPayload {
  labId: string;
  reportedBy: "student" | "assistant" | "technician";
  incidentType: IncidentType;
  severityHint: number;
  description: string;
}

export interface LabIncidentReportedEvent {
  eventId: string;
  type: "lab.incident.reported";
  occurredAt: string;
  payload: LabIncidentPayload;
}

export interface IncidentProcessingResult {
  priority: Priority;
  action: string;
}

export interface ProcessedIncidentRecord extends IncidentProcessingResult {
  eventId: string;
  processedAt: string;
  queueName: string;
  payload: LabIncidentPayload;
}

export const labIncidentPayloadSchema = z.object({
  labId: z.string().min(3).max(32),
  reportedBy: z.enum(["student", "assistant", "technician"]),
  incidentType: z.enum([
    "device_overheat",
    "network_unstable",
    "water_leak",
    "projector_failure",
    "minor_noise",
  ]),
  severityHint: z.number().int().min(1).max(5),
  description: z.string().min(10).max(280),
});

export function classifyIncident(
  payload: LabIncidentPayload,
): IncidentProcessingResult {
  if (
    payload.incidentType === "water_leak" ||
    payload.incidentType === "device_overheat" ||
    payload.severityHint >= 4
  ) {
    return {
      priority: "high",
      action: "dispatch technician immediately and isolate affected equipment",
    };
  }

  if (
    payload.incidentType === "network_unstable" ||
    payload.incidentType === "projector_failure" ||
    payload.severityHint === 3
  ) {
    return {
      priority: "medium",
      action: "schedule inspection within the current shift",
    };
  }

  return {
    priority: "low",
    action: "monitor the issue and include it in routine maintenance",
  };
}

export function createIncidentEvent(
  payload: LabIncidentPayload,
): LabIncidentReportedEvent {
  return {
    eventId: crypto.randomUUID(),
    type: "lab.incident.reported",
    occurredAt: new Date().toISOString(),
    payload,
  };
}

export const sampleIncidents: LabIncidentPayload[] = [
  {
    labId: "LAB-NET-02",
    reportedBy: "student",
    incidentType: "network_unstable",
    severityHint: 3,
    description: "Internet disconnected three times during routing lab session.",
  },
  {
    labId: "LAB-EMBED-01",
    reportedBy: "assistant",
    incidentType: "device_overheat",
    severityHint: 5,
    description: "Microcontroller rack emitted heat and burning smell.",
  },
  {
    labId: "LAB-MULTI-03",
    reportedBy: "technician",
    incidentType: "minor_noise",
    severityHint: 1,
    description: "Projector fan is noisy but class can continue normally.",
  },
  {
    labId: "LAB-AI-04",
    reportedBy: "student",
    incidentType: "water_leak",
    severityHint: 5,
    description: "Water dripped near workstation power extension after heavy rain.",
  },
];
